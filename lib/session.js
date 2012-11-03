var Session = (function() {
  var self = Object.create({}) ;

  return self ;
}()) ;

var createSession = function(c) {
  var session = Object.create(Session, {
    data: { value: {} },
    backend: { value: {} },
  }) ;

  session.connection = c ;

  return session ;
}

module.exports.createSession = createSession ;
