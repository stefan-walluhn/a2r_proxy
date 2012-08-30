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

var argv = require('optimist').boolean('v').argv ;

var syslog = require('./lib/syslog') ;
if (argv.v) syslog.setConsoleLog(true) ;

var config = require('./lib/configloader').load('proxy.config') ;
var osc = require('osc-min') ;

var parseInput = function(data) {
  var sessionData = "" ;

  try {
    sessionData = osc.fromBuffer(data) ;
    console.log(sessionData) ;
  } catch (err) {
    syslog.log(syslog.LOG_ERROR, "recieved malformated input from backend") ;
  }

  for (i=0; i<sessionData.sensors.length; i++) {
    startCollector(sessionData.sensors[i]) ;
  } ;

 notifyIndex(sessionData) ;
}

function startCollector(sensor) {
  sensor.target_port = port++ ;
  sensor.query_port = port++ ;
  syslog.log(syslog.LOG_INFO, "starting new collector for sensor: " + sensor.name + " with ports #" + sensor.target_port + " and #" + sensor.query_port) ;
}

function notifyIndex(data) {
  console.log(JSON.stringify(data)) ;
  var url = "http://" + config['index_server_address'] + ":" + config['index_server_port'] ;
  syslog.log(syslog.LOG_DEBUG, "sending notification to index server at: " + url) ;
  var request = require('request') ;
  /*request.post({
    url: url,
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }, function(error, response, body) {
    syslog.log(syslog.LOG_ERROR, body) ;
  }) ;*/
}

var server = require('net').createServer(function(c) {
  syslog.log(syslog.LOG_INFO, "backend " + socket.remoteAddress + "connected tp a2r_proxy") ;

  c.on('data', parseInput) ;
  syslog.log(syslog.LOG_INFO, "backend " + c.remoteAddress + " transmitted announcment to a2r_proxy") ;

  c.on('close', function(data) {
    syslog.log(syslog.LOG_INFO, "backend " + c.remoteAddress + " closed connection") ;
  }) ;
}) ;

server.listen(config['notify_server_port']) ;

syslog.log(syslog.LOG_INFO, 'starting a2r_proxy server on port ' + config['notify_server_port']) ;
