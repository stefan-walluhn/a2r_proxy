syslog = null

init = (logger_name = 'a2r') -> 
  if not syslog?
    syslog = require('node-syslog')
    syslog.init logger_name, syslog.LOG_PID | syslog.LOG_0DELAY, syslog.LOG_LOCAL0
  return syslog

module.exports = init

