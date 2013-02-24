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
  
  app.github.fetch = function (conf, callback) {
    
    var content = {},
    
    // handle githubs encoded answers
    encode = function (buffer, cb) {
      
      var res = new Buffer(buffer, 'base64').toString('utf8');      
      cb(null, res);
      
    },
    
    handleResponse = function (err, res, cb) {

      if (err) {
        cb(err);
      } else {
        
        encode(res.content, function (err, res) {
          cb(null, res);
        });
      
      }
      
    };
    
    if (conf.readme) {
      delete conf.readme;
      
      github.repos.getReadme(conf, function (err, res) {
        handleResponse(err, res, callback); 
      });
      
    } else if (conf.path) {
      
      github.repos.getContent(conf, function (err, res) {
        handleResponse(err, res, callback);
      });
      
    } else {
      handleResponse(new Error("No path given!"), null, callback);
    }
    
  }; // end app.github function
  
};

// `exports.init` gets called by broadway on `app.init`.
exports.init = function (done) {

  // This plugin doesn't require any initialization step.
  return done();

};
