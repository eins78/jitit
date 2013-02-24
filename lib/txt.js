var pandoc = require('pdc');

// `exports.attach` gets called by broadway on `app.use`
exports.attach = function (options) {
  
  var app = this;
  
  // usage ex: app.txt("# h1", 'markdown', 'html', function(err,res){});
  app.txt = function(string, from, to, callback) {
    
    // right now just a wrapper around pdc/pandoc
    pandoc(string, from, to, function(err, result) {
      
      if (err) {
        
        callback(err);
        
      } else {
        
        callback(null, result);
        
      }
      
    });
    
  }; // end app.txt function
  
};

// `exports.init` gets called by broadway on `app.init`.
exports.init = function (done) {

  // This plugin doesn't require any initialization step.
  return done();

};
