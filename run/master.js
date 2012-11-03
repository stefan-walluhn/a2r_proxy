var osc_address = "/a2r/announce/" ;

var osc = require('osc-min') ;
var worker = require('child_process') ;
var net = require('net') ;

var syslog = require('../lib/syslog') ;
var config = require('../lib/configloader').load('proxy.config') ;
var sfactory = require('../lib/session') ;
var sessions = require('../lib/sessions') ;
var launcher = require('../lib/collector_launcher') ;
var notifier = require('../lib/index_notifier') ;

var master = function() {

  var server = net.createServer(function(c) {

    var remoteAddress = c.remoteAddress ;
    var remotePort = c.remotePort ;

    syslog.log(syslog.LOG_INFO, "backend " + c.remoteAddress + " connected to master a2r_proxy") ;

    c.on('data', function(data) {

      function startCollectors(session) {

        if (session.data['port'] === undefined) {
          var port = launcher.startCollector(session) ;
          session.data['port'] = port ;
        }

        notifier.notifyUpdate(session) ;
        sessions.register(session) ;
      }

      var inputData = "" ;
      var session = sessions.find(c.remoteAddress, c.remotePort) ;
      if (session === undefined) session = sfactory.createSession(c) ;
      session.data = {} ;
      session.backend['host'] = c.remoteAddress ;

      // first parse osc to hash
      try {
        inputData = osc.fromBuffer(data) ;
        if (inputData.elements === undefined) {
          syslog.log(syslog.LOG_ERR, "this is not a bundle") ;
          throw new Error("not a bundle") ;
        }
      } catch (err) {
        syslog.log(syslog.LOG_ERR, "recieved malformated osc input from backend " + c.remoteAddress) ;
        return ;
      }

      // cycle thrue all osc messages
      for (i=0; i<inputData.elements.length; i++) {
        var element = inputData.elements[i] ;

        // **** This is a massage and therefore should be metadata ****
        if (element.oscType == 'message') {

          // This is no osc for us
          if (element.address.search(osc_address) == -1) continue ;

          if (element.args.length > 0) {
            var key = element.address.substring(element.address.lastIndexOf("/")+1, element.address.length).toLowerCase() ;
            var val = element.args[0].value ;
            if (key == "port") {
              session.backend[key] = val ;
            } else {
              session.data[key] = val ;
            }

            syslog.log(syslog.LOG_DEBUG, "Metadata:\t" + key + " : " + val) ;
          }
        } 
      }
    
      if (session.data['name'] === undefined) {
        syslog.log(syslog.LOG_ERR, "Announce from " + session.backend['host'] + " missed name") ;
        return ;
      }

      if (session.backend['port'] === undefined) {
        syslog.log(syslog.LOG_ERR, "Announce from " + session.backend['host'] + " missed port") ;
        return ;
      }
    
      if (session.data['title'] === undefined) session.data['title'] = session.data['name'] ;

      if (session.data['statistic'] === undefined) session.data['statistic'] = "passthrue" ;

      // go further with starting necessary collector processes
      startCollectors(session) ;

    }.bind(this)) ;
   
    c.on('close', function() {
      syslog.log(syslog.LOG_INFO, "backend " + remoteAddress + " closed connection") ;
      var session = sessions.find(remoteAddress, remotePort) ;
      if (session === undefined) return ;

      notifier.notifyShutdown(session) ;
      launcher.stopCollector(session) ;
      sessions.unregister(remoteAddress, remotePort) ;

    }.bind(this)) ;
  }) ;

  return server ;
}

module.exports = master() ;
