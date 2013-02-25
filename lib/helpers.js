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
  
  // get stuff from github
  app.getHub = function(user, repo, page, sender) {
    var self = sender,
        conf = { 
          "user": user,
          "repo": repo,
        };
      
    if (page) {
      conf['path'] = page + ".page";
    } else { 
      conf['readme'] = true;
    }
  
    app.github.fetch(conf, function(err, result) {
      if (err) {
      
        app.send(err, null, self);
      
      } else {
                
        app.txt(result, 'markdown', 'html', function(err, output) {
        
          app.send(err, output, self);
        
        });
    
      }
    
    });
  
  };

};

// `exports.init` gets called by broadway on `app.init`.
exports.init = function (done) {

  // This plugin doesn't require any initialization step.
  return done();

};