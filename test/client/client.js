var socket = require('net').Socket({type: 'tcp4'}) ;

var dummydata = JSON.stringify({
  title: 'dummy test session',
  sensors: [{
    name: 'dreh hier',
    type: 3
  }, {
    name: 'oder hier',
    type: 1
  }]
}) ;
//dummydata += "blabal**[/this is not valid}" ;

socket.connect(7010, 'localhost', function() {
  socket.on('data', function(data) {
    console.log(data.toString()) ;
  }) ;
  socket.write(dummydata) ;
  socket.end() ;
}) ;

