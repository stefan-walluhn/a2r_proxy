var logger = (function() {
  var consoleLog = false ;
  var syslog = require('node-syslog') ;
  syslog.init("a2r_proxy", syslog.LOG_PID | syslog.LOG_0DELAY, syslog.LOG_LOCAL0) ;

  function setConsoleLog(enable) {
    enable ? consoleLog = true : this.consoleLog = false ;
  }

  function log(level, message) {
    if (consoleLog) { 
      var slevel ;
      switch (level) {
        case 0: slevel = "EMERG"; break;
        case 1: slevel = "ALERT"; break;
        case 2: slevel = "CRIT"; break;
        case 3: slevel = "ERROR"; break;
        case 4: slevel = "WARN"; break;
        case 5: slevel = "NOTICE"; break;
        case 6: slevel = "INFO"; break;
        case 7: slevel = "DEBUG"; break;
      }
      
      console.log(slevel + ":\t" + message) ;
    }
    if (level != 7) syslog.log(level, message) ;
  }

  return {
    log: log,
    setConsoleLog: setConsoleLog,
    LOG_EMERG : 0,
    LOG_ALERT : 1,
    LOG_CRIT : 2,
    LOG_ERR : 3,
    LOG_WARNING : 4,
    LOG_NOTICE : 5,
    LOG_INFO : 6,
    LOG_DEBUG : 7
  } ;
})() ;

module.exports = logger ;

