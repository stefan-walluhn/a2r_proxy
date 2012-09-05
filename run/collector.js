var osc = require('osc-min') ;

var argv = require('optimist').argv ;
var dgram = require('dgram') ;
var udp_send = dgram.createSocket('udp4') ;
var udp_res = dgram.createSocket('udp4') ;

var syslog = require('../lib/syslog') ;

var proxy = {} ;
var session = {} ;

session['oscAddress'] = argv.oscaddress ;
session['port'] = argv.backendport ;
session['host'] = argv.backendhost ;

udp_res.on("message", function(msg, rinfo) {

  for (var i=0; i<msg.length; i+=4) {
    var type = msg.readUInt8(i) ;
    var address = session.oscAddress ;

    if (type == 129) address += "/X" ;
    if (type == 130) address += "/Y" ;

    var buf = osc.toBuffer({
      address: address ,
      args: [{type: "integer", value: msg.readUInt16LE(i+1)}]
    }) ;

    udp_send.send(buf, 0, buf.length, session.port, session.host) ;
    }
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
