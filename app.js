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



// HTTP //////////////////////////////////////////////
app.use(flatiron.plugins.http);

app.router.get('/', function () {
  this.res.html(app.cache.infopage.html)
});

// "/wiki" shows the rendered readme
app.router.get('/wiki', function(user, repo) {
  var http = this,
      conf;
  
  // for when not hard-coded    
  // conf = { "user": user, "repo": repo };
  
  // hardcoded
  conf = { "user": "eins78", "repo": "txt.178.is" };
  
  github.repos.getReadme(conf, function(err, res) {
    var source = new Buffer(res.content, 'base64').toString('utf8');
            
    app.txt(source, 'markdown', 'html', function(err, res) {        
      http.res.html(res);      
    });
      
  });
  
});

// "/wiki/$PAGE" shows a rendered wiki page
app.router.get('/wiki/:page', function (page) {
  var http = this,
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
  
  github.repos.getContent(conf, function(err, result) {
    
    var source = new Buffer(result.content, 'base64').toString('utf8');
            
    app.txt(source, 'markdown', 'html', function(err, output) {        
      http.res.html(output);      
    });
      
  });
  
});

// start the app
app.start(3000);
