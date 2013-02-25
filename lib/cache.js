var pandoc = require('pdc');

// `exports.attach` gets called by broadway on `app.use`
exports.attach = function (options) {
  
  var app = this,
      cache = {}; // the cache object
  
  app.cache = {}; // the interface
  
  app.cache.get = function (what, callback) {
    if (callback) {
      callback(cache[what]);
    }
  };
  
  app.cache.set = function (what, value, callback) {
    
    if (callback) {
      if (value) {
        if (what) {
          cache[what] = value;
        } else {
          callback(new Error("No what"));
        }
      } else {
        callback(new Error("No value"));   
      }
    }
  };
      
  // build the home/info page (done once at startup)
  app.cache.infopage = function (data) {
    // data is hardcoded for now
    data = {
      "title": "jitit",
      "hello-msg": "oh hai!",
      "hello-txt": "Try to: \n\n- `GET` [`/wiki`](/wiki)\n- `GET` [`/wiki/ARCH`](/wiki/ARCH)\n\nThis uses the [`pandoc`](http://johnmacfarlane.net/pandoc) document converter."
    };
    
    var info = {};
    info.txt = "# " + data.title + "\n";
    info.txt += "\n";
    info.txt += data['hello-msg'] + "\n";
    info.txt += "\n";
    info.txt += data['hello-txt'] + "\n\n";

    // get the pandoc version info
    pandoc(null, null, null, [ '-v' ], function(err, res) {
      require('eyes').inspect(res);
      info.txt += "### `Pandoc` version info:\n";
      info.txt += "```shell\n" + res + "\n```\n";
    
      pandoc(info.txt, 'markdown', 'html', function(err, conv) {
        info.html = conv || err;
         app.cache.set('infopage', info, function() {
           if (err) {
             throw new Error('wtf');
           }
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