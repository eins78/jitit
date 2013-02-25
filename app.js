var path      = require('path'),
    fs        = require('fs'),
    flatiron  = require('flatiron'),
    app       = flatiron.app;

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



// HTTP 
app.use(flatiron.plugins.http);

app.router.get('/', function () {
  var http = this;
  
  app.cache.get("infopage", function(info) {
    http.res.html(info.html);   
  });
});

// ROUTES ////////////////////////////////////////////

// testing: "/list" shows the list
app.router.get('/list', function(user, repo) {
  
  var http = this;
  
  // hardcoded
  user = "eins78";
  
  app.listHub(user, repo, function(err, res) {
    http.res.html((err || res || null).toString());
  });

});



// "/wiki" shows the rendered readme
app.router.get('/wiki', function(user, repo) {
  
  // hardcoded
  app.getHub("eins78", "txt.178.is", null, this);  

});

// "/wiki/$PAGE" shows a rendered wiki page from 178
app.router.get('/wiki/:page', function (page) {

  // hardcoded
  app.getHub("eins78", "txt.178.is", page + ".page", this);
  
});

// experimental public service ///////////////////////

// "/github/$user/$repo" shows the rendered readme
app.router.get('/github/:user/:repo', function (user, repo) {
  app.getHub(user, repo, null, this);
});

// "/github/$user/$repo/$PAGE" shows a rendered wiki page
app.router.get('/github/:user/:repo/:page', function (user, repo, page) {
  app.getHub(user, repo, page, this);
});

// end experimental public service ///////////////////


// start the app
app.start(3000);

// fill the infopage cache once on startup
app.cache.infopage(null);
