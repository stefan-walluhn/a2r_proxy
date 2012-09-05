var request = require('request') ;

var syslog = require('./syslog') ;
var config = require('./configloader').load('proxy.config') ;

var notifyIndex = function(session) {
  
  console.log(JSON.stringify(session)) ;

  var url = "http://" + config['index_server_address'] + ":" + config['index_server_port'] ;

  syslog.log(syslog.LOG_DEBUG, "sending notification to index server at: " + url) ;

  request.post({
    url: url,
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(session)
  }, function(error, response, body) {
    syslog.log(syslog.LOG_ERR, error) ;
  }) ;
}

module.exports.notifyIndex = notifyIndex ;
