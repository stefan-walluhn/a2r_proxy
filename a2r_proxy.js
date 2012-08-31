#!/usr/bin/env node

/*
### A2R Proxy Server ###
#
# This server notifies A2R Index Server about new A2R Sessions
#
# Copyright (c) 2012, Stefan Walluhn
#
# this file is part of A2R.
#
# A2R is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
# 
*/

var osc_address = "/a2r/announce/" ;

var argv = require('optimist').boolean('v').argv ;

var syslog = require('./lib/syslog') ;
if (argv.v) syslog.setConsoleLog(true) ;

var config = require('./lib/configloader').load('proxy.config') ;
var osc = require('osc-min') ;
var worker = require('child_process') ;

var port = 7060 ;



var server = require('net').createServer(function(c) {
  syslog.log(syslog.LOG_INFO, "backend " + c.remoteAddress + "connected tp a2r_proxy") ;

  c.on('data', function(data) {

function startCollectors(session) {
  
  for (var i=0; i<session.sensors.length; i++) {
    startCollector(session, session.sensors[i])
  }

  notifyIndex(session) ;
}

function startCollector(session, sensor) {
  sensor.target_port = port++ ;
  syslog.log(syslog.LOG_DEBUG, "Spawning new sensor proxy") ; 
  var proxy = worker.spawn('node', ['run/proxy.js', '--proxyport', port++, '--oscport', session.port, '--oschost', session.backend_host, '--oscname', "/a2r/" + session.name + "/" + sensor.name]) ;
}

function notifyIndex(data) {
  console.log(JSON.stringify(data)) ;
  var url = "http://" + config['index_server_address'] + ":" + config['index_server_port'] ;
  syslog.log(syslog.LOG_DEBUG, "sending notification to index server at: " + url) ;
  var request = require('request') ;
  request.post({
    url: url,
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }, function(error, response, body) {
    syslog.log(syslog.LOG_ERR, body) ;
  }) ;
}

    var sessionData = "" ;
    var outputData = {} ;
    outputData['sensors'] = [] ;

    try {
      sessionData = osc.fromBuffer(data) ;
      console.log(sessionData) ;
      if (sessionData.elements === undefined) throw "not a bundle" ;
    } catch (err) {
      syslog.log(syslog.LOG_ERR, "recieved malformated input from backend") ;
      return ;
    }

    // cycle thrue all osc messages
    for (i=0; i<sessionData.elements.length; i++) {
      var element = sessionData.elements[i] ;

      if (element.oscType == 'message') {
        // This is a massage and therefore should be metadata

        // This is no osc for us
        if (element.address.search(osc_address) == -1) continue ;

        if (element.args.length > 0) {
          var key = element.address.substring(element.address.lastIndexOf("/")+1, element.address.length).toLowerCase() ;
          var val = element.args[0].value ;
          console.log("Metadata:\t" + key + " : " + val) ;
          outputData[key] = val ;
        }
      } else {
        // this is a bundle and therefor should be a sensor
        var sensor = {} ;
        for (j=0; j<sessionData.elements[i].elements.length; j++) {
        element = sessionData.elements[i].elements[j] ;

          // This is no osc for us
          if (element.address.search(osc_address) == -1) continue ;

          if (element.args.length > 0) {
            var key = element.address.substring(element.address.lastIndexOf("/")+1, element.address.length).toLowerCase() ;
            var val = element.args[0].value ;

            sensor[key] = val ;
            console.log("Sensordata:\t" + key + " : " + val) ;
          }
        }
        if (sensor['name'] !== undefined) {
          outputData['sensors'].push(sensor) ;
        }
      }
    }
  
    if (outputData['name'] === undefined) {
      syslog.log(syslog.LOG_ERR, "Announce from " + c.remoteAddress + " missed name") ;
      return ;
    }

    if (outputData['port'] === undefined) {
      syslog.log(syslog.LOG_ERR, "Announce from " + c.remoteAddress + " missed port") ;
      return ;
    }
  
    if (outputData['title'] === undefined) outputData['title'] = outputData['name'] ;

    outputData['backend_host'] = c.remoteAddress ;
    startCollectors(outputData) ;
  }.bind(this)) ;
 
  c.on('close', function(data) {
    syslog.log(syslog.LOG_INFO, "backend " + c.remoteAddress + " closed connection") ;
  }) ;
}) ;

server.listen(config['notify_server_port']) ;

syslog.log(syslog.LOG_INFO, 'starting a2r_proxy server on port ' + config['notify_server_port']) ;
