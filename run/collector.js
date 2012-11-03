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

    if (type == 129) address += "/A" ;
    if (type == 130) address += "/B" ;
    if (type == 131) address += "/C" ;
    if (type == 132) address += "/D" ;
    if (type == 133) address += "/E" ;
    if (type == 134) address += "/F" ;
    if (type == 144) address += "/ACCEL_X" ;
    if (type == 145) address += "/ACCEL_Y" ;
    if (type == 146) address += "/ACCEL_Z" ;
    if (type == 160) address += "/GYRO_X" ;
    if (type == 161) address += "/GYRO_Y" ;
    if (type == 162) address += "/GYRO_Z" ;
    if (type == 176) address += "/TEMP" ;
    if (type == 178) address += "/LIGHT" ;

    var buf = osc.toBuffer({
      address: address ,
      args: [{type: "integer", value: msg.readInt16LE(i+1)}]
    }) ;

    udp_send.send(buf, 0, buf.length, session.port, session.host) ;
    }
}) ;

// ToDo: This doen't work at all
udp_res.on("close", function() {
  console.log("Close proxy listened on port" + argv.backendport) ;
}) ;


proxy.listen = function(port) {
  console.log("New proxy listen on port: " + port) ;
  udp_res.bind(port) ;
}

proxy.listen(argv.proxyport) ;

