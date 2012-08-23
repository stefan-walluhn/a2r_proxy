//ToDo: manage a set of syslogger
var syslog = null;

var getInstance = function() {
  if (syslog == null) {
    syslog = require('node-syslog');
    syslog.init("a2r_proxy", syslog.LOG_PID | syslog.LOG_0DELAY, syslog.LOG_LOCAL0);
  }
  return syslog;
};

module.exports.getInstance = getInstance;

