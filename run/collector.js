var osc = require('osc-min') ;

var argv = require('optimist').argv ;
var dgram = require('dgram') ;
var udp_send = dgram.createSocket('udp4') ;
var udp_res = dgram.createSocket('udp4') ;

var proxy = {} ;
var session = {} ;

session['oscAddress'] = argv.oscaddress ;
session['port'] = argv.backendport ;
session['host'] = argv.backendhost ;

udp_res.on("message", function(msg, rinfo) {

  var buf = osc.toBuffer({
    address: session.oscAddress ,
    args: [{type: "integer", value: msg.readInt16LE(1)}]
  }) ;

  udp_send.send(buf, 0, buf.length, session.port, argv.oschost) ;
}) ;


proxy.listen = function(port) {
  console.log("New proxy listen on port: " + port) ;
  udp_res.bind(port) ;
}

proxy.listen(argv.proxyport) ;

/*
function sendStuff() {
  var buf = osc.toBuffer({
    address: session.oscAddress ,
    args: [{type: "integer", value: Math.floor(Math.random() * 127)}]
  }) ;


setInterval(sendStuff, 2000) ;*/
