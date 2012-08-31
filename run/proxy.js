var osc = require('osc-min') ;

var argv = require('optimist').argv ;
var udp = require('dgram').createSocket('udp4') ;

var proxy = {} ;
var session = {} ;
session['name'] = argv.oscname ;
session['port'] = argv.oscport ;
proxy.init = function() {
}

proxy.listen = function(port) {
  console.log("New proxy listen on port: " + argv.proxyport) ;
}

proxy.listen(argv.p) ;

function sendStuff() {
  var buf = osc.toBuffer({
    address: argv.oscname ,
    args: [{type: "integer", value: Math.floor(Math.random() * 127)}]
  }) ;

  udp.send(buf, 0, buf.length, argv.oscport, argv.oschost) ;
}
setInterval(sendStuff, 2000) ;
