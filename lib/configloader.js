var load = function(config_file) {
  var config = [] ;
  var syslog = require('./syslog') ;

  try {
    config = require('cjson').load('./config/' + config_file);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
    syslog.log(syslog.LOG_WARNING, 'config file ' + config_file + ' not found');
  }

  config = set_defaults(config) ;

  return config ;
}

var set_defaults = function(config) {
  // set default values
  if (config['notify_server_port'] == null) config['notify_server_port'] = 7010;
  if (config['index_server_address'] == null) config['index_server_address'] = "localhost";
  if (config['index_server_port'] == null) config['index_server_port'] = 7001;
  if (config['index_web_port'] == null) config['index_web_port'] = 7000;
  
  return config ;
};

module.exports.load = load;
