chai = require('chai')
chai.should()

assert = require('chai').assert

describe 'syslog', ->
  # should provide instances
  it 'should provide instances', ->
    (-> syslog = require('../lib/syslog').getInstance()).should.not.throw ''

  # syslog should be a syslog object
  it 'should be a syslog instance', ->
    syslog = require('../lib/syslog').getInstance()
    (-> syslog.log(syslog.LOG_INFO, 'Test')).should.not.throw ''

  # check singleton
  it 'should be a singleton', ->
    sl = require('../lib/syslog')
    syslog1 = sl.getInstance()
    syslog2 = sl.getInstance()
    assert.strictEqual(syslog1, syslog2)
