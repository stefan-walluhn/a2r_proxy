var Session = (function() {
  var self = Object.create({}) ;

  return self ;
}()) ;

var createSession = function(c) {
  return Object.create(Session, {
    data: { value: {} },
    backend: { value: {} },
    //collectors: { value: [] },
    connection: { value: c }
  }) ;
}

module.exports.createSession = createSession ;
