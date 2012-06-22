assert = require('assert')

assert.doesNotThrow () ->
  syslog = require('../lib/syslog')
  syslog.log syslog.LOG_INFO, 'Test'
