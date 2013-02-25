var exec    = require('child_process').exec,
    path    = require('path'),
    pandoc  = require('pdc'); // just for getting the version

// `exports.attach` gets called by broadway on `app.use`
exports.attach = function (options) {
  
  var app = this;
  
  // send function
  app.send = function(err, res, sender) {
    var http = sender;
  
    if (err) {
      http.res.writeHead(500, err);
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
      conf.path = page + ".page";
    } else { 
      conf.readme = true;
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
  
  // build wiki homepage
  app.wikiHome = function(user, repo, sender) {
    var self = sender,
        rConf = {       // for fetching readme
          "user": user,
          "repo": repo,
          "readme": true
        },
        str  = "";
          
    app.github.fetch(rConf, function(err, res) {
      if (err) {
      
        app.send(err, null, self);
      
      } else {
        
        str += err || res + "\n";
        
        app.wikiPages(user, repo, "Pages", function(err, res) {
          
          str += err || res + "\n";
          
          app.txt(str, 'markdown', 'html', function(err, output) {
            
            app.send(err, output, self);
        
          });
    
        });
                
      }
    
    });
  
  };
  
  // get list of wiki pages from github
  app.wikiPages = function (user, repo, heading, callback) {
    
    // semi-hardcoded
    var conf = {
          'user'      : user || "eins78",
          'repo'      : repo || "txt.178.is",
          'sha'       : "master",
          'recursive' : true
        };
        
    app.github.list(conf, function(err, listAr) {
      var list;
          
      list = "## " + heading + "\n\n"
          
      if (err) {
            
      } else {
            
        listAr.forEach(function(item) {
              
          var ext = "." + app.config.get("extension");
              
          if (path.extname(item) === ext) {
            var name = item.substring(0,item.indexOf(ext));
                
            list += "- [" + name + "](/wiki/" + name + ")\n";
                       
          }
              
        });
            
      }
                    
      callback(err || null, list || null);
          
    });
    
  };
  
  // build the home/info page (done once at startup)
  app.cache.infopage = function (data) {
    // data is hardcoded for now
    data = {
      "title": "jitit",
      "hello-msg": "oh hai!",
      "hello-txt": "Try to: \n\n- `GET` [`/wiki`](/wiki)\n- `GET` [`/wiki/ARCH`](/wiki/ARCH)\n\nThis uses the [`pandoc`](http://johnmacfarlane.net/pandoc) document converter (see [version info](#pandoc-version-info)).\n\nAnd [latex]() (see [version info](#latex-version-info)) and [arch linux]() (see [version info](#posix-version-info)).\n\nAlso, it is like [gitit](http://gitit.net), but only the frontend. Contents are fetched from the [github API](http://developer.github.com)."
    };
    
    var info = {};
    info.txt = "# " + data.title + "\n";
    info.txt += "\n";
    info.txt += data['hello-msg'] + "\n\n---\n";
    info.txt += "\n";
    info.txt += data['hello-txt'] + "\n\n---\n";
    
    // get latex version string
    exec('latex -v', function (error, stdout, stderr) {
      // ignore errors
      info.latex = stderr || stdout || "";
      
      // get linux version string
      exec('uname -a', function (error, stdout, stderr) {
        // ignore errors
        info.posix = stderr || stdout || "";
        
        // get the pandoc version info
        pandoc(null, null, null, [ '-v' ], function(err, res) {

          info.txt += "#### Pandoc version info\n\n";
          info.txt += "```shell\n" + res + "\n```\n\n";
          
          info.txt += "#### LaTeX version info \n\n";
          info.txt += "```shell\n" + info.latex + "\n```\n\n";
    
          info.txt += "#### POSIX version info\n\n";
          info.txt += "```shell\n" + info.posix + "\n```\n\n";
        
          app.txt(info.txt, 'markdown', 'html', function(err, conv) {
            info.html = conv || err;
        
             app.cache.set('infopage', info, function() {
           
               if (err) {
                 throw new Error('wtf');
               }
             });
             
          });
          
        });
     
      });
      
    });
    
  };

};

// `exports.init` gets called by broadway on `app.init`.
exports.init = function (done) {

  // This plugin doesn't require any initialization step.
  return done();

};