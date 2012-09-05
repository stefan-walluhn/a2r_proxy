var syslog = require('./syslog') ;
var worker = require('child_process') ;

var launcher = (function() {
  var port = 17001 ;

  function startCollector(session, sensor) {
    var collector = worker.spawn('node', ['run/collector.js', '--proxyport', port, '--backendport', session.backend_port, '--backendhost', session.backend_host, '--oscaddress', '/a2r/' + session.name + '/' + sensor.name]) ;

    syslog.log(syslog.LOG_INFO, 'spawned new sensor collector at port ' + port) ;

    return port++ ;
  }

 return {
    startCollector: startCollector,
 } ;
})() ;

module.exports = launcher ;

