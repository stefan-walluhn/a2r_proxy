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
var sessions = require('./lib/sessions') ;
var server = require('./run/master') ;
server.listen(config['notify_server_port']) ;

syslog.log(syslog.LOG_INFO, 'master a2r_proxy started on port ' + config['notify_server_port']) ;

process.on('SIGINT', function() {
  shutdown() ;
}) ;

process.on('SIGTERM', function() {
  shutdown() ;
}) ;

process.on('SIGKILL', function() {
  shutdown() ;
}) ;

function shutdown() {
  //ToDO: Shutdown collectors, notify index as in run/master -> c.on('close')
  syslog.log(syslog.LOG_INFO, 'master a2r_proxy stopped') ;
  process.exit() ;
}
