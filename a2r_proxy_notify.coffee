### A2R Proxy Notify Server ###
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

syslog = require('./lib/syslog').getInstance()
config = require('./lib/configloader').load('proxy.config')

server = require('net').createServer (socket) ->
  socket.write 'Echo server\r\n'
  socket.pipe socket
server.listen config['notify_server_port']

console.log 'Server running'
syslog.log syslog.LOG_INFO, 'starting notify server on port ' + config['notify_server_port']
