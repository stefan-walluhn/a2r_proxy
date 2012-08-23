var chai = require('chai');
chai.should();

describe('configloader', function() {
  it('should load, even with nonexisting file', function() {
    return (function() {
      var config;
      return config = require('../lib/configloader').load('nonexistent.config');
    }).should.not["throw"]('ENOENT');
  });

  it('should resolve to default values on non existing file', function() {
    var config;
    config = require('../lib/configloader').load('nonexistent.config');
    config['notify_server_port'].should.equal(7010);
    config['index_server_address'].should.equal('localhost');
    return config['index_server_port'].should.equal(7001);
  });
  
  it('should parse config files', function() {
    var config;
    config = require('../lib/configloader').load('../test/fixtures/config/mock1.config');
    config['notify_server_port'].should.equal(8010);
    config['index_server_address'].should.equal("test.host");
    return config['index_server_port'].should.equal(8001);
  });

  return it('should throw exception on parse error', function() {
    return (function() {
      var config;
      return config = require('../lib/configloader').load('../test/fixtures/config/mock2.config');
    }).should["throw"]('JSON.parse');
  });
});
