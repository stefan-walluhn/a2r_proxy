assert = require('assert')

# require should work
assert.doesNotThrow () ->
  syslog = require('../lib/syslog')()

# syslog should be a syslog object
assert.doesNotThrow () ->
  syslog = require('../lib/syslog')()
  syslog.log syslog.LOG_INFO, 'Test'

# check singleton
syslog1 = require('../lib/syslog')('test1')
syslog2 = require('../lib/syslog')('test2')

assert.strictEqual syslog1, syslog2
