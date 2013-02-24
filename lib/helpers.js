// `exports.attach` gets called by broadway on `app.use`
exports.attach = function (options) {
  
  var app = this;
  
  // send function
  app.send = function(err, res, sender) {
    var http = sender;
  
    if (err) {
      http.res.writeHead(500, err)
      http.res.json(err);
    } else {
      http.res.html(res);
    }
  };

};

// `exports.init` gets called by broadway on `app.init`.
exports.init = function (done) {

  // This plugin doesn't require any initialization step.
  return done();

};