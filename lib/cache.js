
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
  
};

// `exports.init` gets called by broadway on `app.init`.
exports.init = function (done) {

  // This plugin doesn't require any initialization step.
  return done();

};