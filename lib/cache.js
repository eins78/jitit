var pandoc = require('pdc');

// `exports.attach` gets called by broadway on `app.use`
exports.attach = function (options) {
  
  var app = this;
  
  app.cache = {};
  
  // build the home/info page (done once at startup)
  (function infopage (data) {
    // data is hardcoded for now
    data = {
      "title": "jitit",
      "hello-msg": "oh hai!",
      "hello-txt": "Try to: \n\n- `GET` [`/wiki`](/wiki)\n- `GET` [`/wiki/ARCH`](/wiki/ARCH)"
    };
  
    app.cache.infopage = {};
    app.cache.infopage.txt = "# " + data.title + "\n";
    app.cache.infopage.txt += "\n";
    app.cache.infopage.txt += data['hello-msg'] + "\n";
    app.cache.infopage.txt += "\n";
    app.cache.infopage.txt += data['hello-txt'] + "\n\n";

    // get the pandoc version info
    pandoc(null, null, null, [ '-v' ], function(err, result) {
      app.cache.infopage.txt += "### `Pandoc` version info:\n";
      app.cache.infopage.txt += "```shell\n" + result + "\n```\n";
    
      pandoc(app.cache.infopage.txt, 'markdown', 'html', function(err, result) {
        app.cache.infopage.html = result;
      });
    });
  })();

};

// `exports.init` gets called by broadway on `app.init`.
exports.init = function (done) {

  // This plugin doesn't require any initialization step.
  return done();

};