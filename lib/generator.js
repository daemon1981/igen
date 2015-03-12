var _     = require("lodash");
var fs    = require('fs');
var async = require("async");

// example options {
//   wd: "./locales",
//   type: "module"
// }
function Generator (options) {
  if (!options) {
    options = {};
  }

  options = _.defaults(options, {
    wd: "./",
    type: 'module'
  });

  this.options = options;
}

Generator.prototype.run = function (filename, translations, callback) {
  var self = this;

  async.series([
    function mkdir(next) {
      self.mkdir(self.options.wd, next);
    },
    function saveTranslations(next) {
      var file = self.getLangFile(filename);
      self.saveTranslations(file, translations, next);
    }
  ], callback);
};

Generator.prototype.mkdir = function (dir, callback) {
  fs.exists(dir, function (exists) {
    if (exists) return callback();
    fs.mkdir(dir, callback);
  });
};

Generator.prototype.getLangFile = function(filename) {
  return this.options.wd + '/' + filename + '.js';
};

Generator.prototype.saveTranslations = function (file, json, callback) {
  var self = this;
  async.series([
    function resetContent(next) {
      self.resetContent(file, next);
    },
    function writeHeader(next) {
      self.writeHeader(file, next);
    },
    function writeContent(next) {
      self.writeContent(file, json, next);
    },
    function writeFooter(next) {
      self.writeFooter(file, next);
    }
  ], callback);
};

Generator.prototype.resetContent = function (file, callback) {
  this.writeFile(file, '', callback);
};

Generator.prototype.writeHeader = function (file, callback) {
  this.appendFile(file, 'module.exports = {\n', callback);
};

Generator.prototype.writeContent = function (file, json, callback) {
  var i = 0;
  var keys = _.keys(json);
  var numKeys = keys.length;
  var self = this;
  async.eachSeries(
    keys,
    function(key, next){
      var value = json[key].replace(/"/g, '\\"');
      var line = '  ' + key + ': "' + value + '"';
      if (i < numKeys - 1) {
        line += ',';
      }
      self.appendFile(file, line + '\n', next);
      i++;
    },
    callback
  );
};

Generator.prototype.writeFooter = function (file, callback) {
  this.appendFile(file, '};', callback);
};

Generator.prototype.appendFile = function (file, data, callback) {
  fs.appendFile(file, data, { encoding: "utf-8" }, callback);
};

Generator.prototype.writeFile = function (file, data, callback) {
  fs.writeFile(file, data, { encoding: "utf-8" }, callback);
};


module.exports = exports = Generator;