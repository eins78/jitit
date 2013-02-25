var pandoc = require('pdc');

// `exports.attach` gets called by broadway on `app.use`
exports.attach = function (options) {
  
  var app = this;
  
  // usage ex: app.txt("# h1", 'markdown', 'html', function(err,res){});
  app.txt = function(string, from, to, callback) {
    
    // right now just a wrapper around pdc/pandoc
    var options = [
      '--css=//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.0/css/bootstrap-combined.min.css',
      '--css=//netdna.bootstrapcdn.com/bootswatch/2.3.0/readable/bootstrap.min.css', 
      '--title-prefix=jitit',
      '--standalone',
      // '--toc', // ugly
      '--smart',
      '--normalize',
      '--preserve-tabs',
      '--tab-stop=2',
      '--jsmath'
    ];
    
    if (to === "html") {
      // to = "html5"; // has bugs, like no quotes
    };
    
    pandoc(string, from, to, options, function(err, result) {
      
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
