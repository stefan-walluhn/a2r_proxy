assert = require('assert')

# require should work, even with nonexisting file
assert.doesNotThrow () ->
  config = require('../lib/configloader')('nonexistent.config')

# non existing file should resolve to default values
config = require('../lib/configloader')('nonexistent.config')

assert.equal config['notify_server_port'], 7010
assert.equal config['index_server_address'], "localhost"
assert.equal config['index_server_port'], 7001

# config file should be parsed
config = require('../lib/configloader')('../test/fixtures/config/mock1.config')

assert.equal config['notify_server_port'], 8010
assert.equal config['index_server_address'], "test.host"
assert.equal config['index_server_port'], 8001

# should throw exception on parse error
assert.throws () -> 
  config = require('../lib/configloader')('../test/fixtures/config/mock2.config')
