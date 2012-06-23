chai = require('chai')
chai.should()

describe 'configloader', ->
  it 'should load, even with nonexisting file', ->
    (-> config = require('../lib/configloader').load('nonexistent.config')).should.not.throw 'ENOENT'

  it 'should resolve to default values on non existing file', ->
    config = require('../lib/configloader').load('nonexistent.config')
    config['notify_server_port'].should.equal(7010)
    config['index_server_address'].should.equal('localhost')
    config['index_server_port'].should.equal(7001)

  it 'should parse config files', ->
    config = require('../lib/configloader').load('../test/fixtures/config/mock1.config')
    config['notify_server_port'].should.equal(8010)
    config['index_server_address'].should.equal("test.host")
    config['index_server_port'].should.equal(8001)

  it 'should throw exception on parse error', ->
    (-> config = require('../lib/configloader').load('../test/fixtures/config/mock2.config')).should.throw 'JSON.parse'

