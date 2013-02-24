var GitHubApi = require('github'),
    github = new GitHubApi({
        // required
        version: "3.0.0",
        // optional
        timeout: 5000
    });

// `exports.attach` gets called by broadway on `app.use`
exports.attach = function (options) {
  
  var app = this;
  
  app.github = {};
  
  app.github.fetch = function(conf, callback) {
    
    var content = "";
    
    // right now just a wrapper around github module  
    github.repos.getContent(conf, function(err, result) {
    
      content = new Buffer(result.content, 'base64').toString('utf8');
      
      callback(null, content);
      
    });
    
  }; // end app.github function
  
};

// `exports.init` gets called by broadway on `app.init`.
exports.init = function (done) {

  // This plugin doesn't require any initialization step.
  return done();

};
