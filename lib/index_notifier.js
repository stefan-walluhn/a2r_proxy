var request = require('request') ;

var syslog = require('./syslog') ;
var config = require('./configloader').load('proxy.config') ;

var notifyUpdate = function(session) {
  
  console.log(session.data) ;

  var data = {
      url: "http://" + config['index_server_address'] + ":" + config['index_server_port'] ,
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(session.data)
  } ;

  var response_call = function(error, response, body) {
    if (error != null) {
      syslog.log(syslog.LOG_ERR, error) ;
      return ;
    }

    var token = (JSON.parse(response.body)).token ;
    if ((token !== undefined) && (token.length == 128)) {
      session.data["token"] = token ; 
    }
  }

  syslog.log(syslog.LOG_DEBUG, "sending notification to index server at: " + data.url) ;

  if (session.data.token === undefined) {
    request.post(data, response_call.bind(this)) ;
  } else {
    request.put(data, response_call.bind(this)) ;
  }
}

var notifyShutdown = function(session) {
   var data = {
      url: "http://" + config['index_server_address'] + ":" + config['index_server_port'] ,
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(session.data)
   } ;

   syslog.log(syslog.LOG_DEBUG, "sending shutdown to index server at: " + data.url) ;
   request.del(data) ;
}



module.exports.notifyIndex = notifyIndex ;
module.exports.notifyShutdown = notifyShutdown ;
