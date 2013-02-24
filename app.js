var path      = require('path'),
    fs        = require('fs'),
    flatiron  = require('flatiron'),
    app       = flatiron.app,
    GitHubApi = require('github'),
    github = new GitHubApi({
        // required
        version: "3.0.0",
        // optional
        timeout: 5000
    });

// APP CONF + PLUGINS
app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

// use txt module first
app.use(require("./lib/txt"));

// use simple cache module
app.use(require("./lib/cache"), { "cache-html": false } );

// use github module
app.use(require("./lib/github"));

// use helpers module
app.use(require("./lib/helpers"));



// HTTP //////////////////////////////////////////////
app.use(flatiron.plugins.http);

app.router.get('/', function () {
  this.res.html(app.cache.infopage.html)
});

// "/wiki" shows the rendered readme
app.router.get('/wiki', function(user, repo) {
  var self = this,
      conf;
  
  // for when not hard-coded    
  // conf = { "user": user, "repo": repo };
  
  // hardcoded
  conf = { 
    "user": "eins78",
    "repo": "txt.178.is",
    "readme": true
  };
  
  app.github.fetch(conf, function(err, result) {
    
    if (err) {
      
      app.send(err, null, self);
      
    } else {
                
      app.txt(result, 'markdown', 'html', function(err, output) {
           
        app.send(err, output, self);
      
      });
    
    }
    
  });
  
});

// "/wiki/$PAGE" shows a rendered wiki page
app.router.get('/wiki/:page', function (page) {
  var self = this,
      conf ;
  
  pagefile = path.join('.', 'content', page + ".markdown");
  
  // for when not hard-coded    
  // conf = { "user": user, "repo": repo };
  
  // hardcoded
  conf = { 
    "user": "eins78",
    "repo": "txt.178.is",
    "path": page + ".page"
  };
  
  app.github.fetch(conf, function(err, result) {
    
    if (err) {
      
      app.send(err, null, self);
      
    } else {
                
      app.txt(result, 'markdown', 'html', function(err, output) {
           
        app.send(err, output, self);
      
      });
    
    }
    
  });
  
});

// test a public service
// "/github/$user/$repo/$PAGE" shows a rendered wiki page
app.router.get('/github/:user/:repo/:page', function (user, repo, page) {
  var self = this,
      conf ;
  
  pagefile = path.join('.', 'content', page + ".markdown");
  
  // for when not hard-coded    

  conf = { 
    "user": user,
    "repo": repo,
    "path": page + ".page"
  };
  
  app.github.fetch(conf, function(err, result) {
    
    if (err) {
      
      app.send(err, null, self);
      
    } else {
                
      app.txt(result, 'markdown', 'html', function(err, output) {
        
        app.send(err, output, self);
              
      });
    
    }
    
  });
  
});

// "/github/$user/$repo" shows the rendered readme
app.router.get('/github/:user/:repo', function(user, repo) {
  var self = this,
      conf = { 
        "user": user,
        "repo": repo,
        "readme": true
      };
  
  app.github.fetch(conf, function(err, result) {
    
    if (err) {
      
      app.send(err, null, self);
      
    } else {
                
      app.txt(result, 'markdown', 'html', function(err, output) {
        
        app.send(err, output, self);
        
      });
    
    }
    
  });
  
});



// start the app
app.start(3000);
