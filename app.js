var path      = require('path'),
    fs        = require('fs'),
    flatiron  = require('flatiron'),
    app       = flatiron.app,
    GitHubApi = require('github'),
    request   = require('request'),
    pandoc    = require('pdc'),
    txt,
    cache     = {},
    github = new GitHubApi({
        // required
        version: "3.0.0",
        // optional
        timeout: 5000
    });

app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

app.use(flatiron.plugins.http);

app.router.get('/', function () {
  this.res.html(cache.infopage.html)
});

txt = function(file, from, to, callback) {
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
      callback(err);     
    } else {
      // console.log(data.toString());
      pandoc(data, 'markdown', 'html', callback);  
    }
  });  
};

app.router.get('/wiki/:page', function(page) {
  var http = this,
      pagefile;
  
  pagefile = path.join('.', 'content', page + ".markdown");
  
  txt(pagefile, 'markdown', 'html', function (err, result) {
    if (err) {
      http.res.json(err);
    } else {
      // console.log(result);
      http.res.writeHead(200, { 'Content-Type': 'text/html' });
      http.res.end(result);
    }  
  });
  
});

app.router.get('/wiki', function(user, repo) {
  var http = this,
      conf;
  
  // for when not hard-coded    
  // conf = { "user": user, "repo": repo };
  
  // hardcoded
  conf = { "user": "eins78", "repo": "txt.178.is" };
  
  github.repos.getReadme(conf, function(err, res) {
      var source = new Buffer(res.content, 'base64').toString('utf8');
            
      pandoc(source, 'markdown', 'html', function(err, res) {        
        http.res.html(res);      
      });
      
  });
  
});


app.start(3000);


// build the home/info page (done once at startup)
(function infopage (data) {
  data = {
    "title": "panwiki",
    "hello-msg": "oh hai!"
  };
  
  cache.infopage = {};
  cache.infopage.txt = "# " + data.title + "\n";
  cache.infopage.txt = cache.infopage.txt + "\n";
  cache.infopage.txt = cache.infopage.txt + data['hello-msg'] + "\n";
  cache.infopage.txt = cache.infopage.txt + "\n";

  // get the pandoc version info
  pandoc(null, null, null, [ '-v' ], function(err, result) {
    cache.infopage.txt = cache.infopage.txt + "### `Pandoc` version info:\n";
    cache.infopage.txt = cache.infopage.txt + "```shell\n" + result + "\n```\n";
    
    pandoc(cache.infopage.txt, 'markdown', 'html', function(err, result) {
      cache.infopage.html = result;
    });
  });
})();