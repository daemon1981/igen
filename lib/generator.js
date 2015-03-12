var _     = require("lodash");
var jf    = require('jsonfile');
var fs    = require('fs');
var async = require("async");

var Generators = {
  module: require("./generators/module")
};

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

Generator.prototype.getMissing = function (keys, translations) {
  var allTranslationKeys = _.keys(translations);
  return _.filter(keys, function(key){
    return _.indexOf(allTranslationKeys, key) === -1;
  });
};

Generator.prototype.getNotUsed = function (keys, translations) {
  var allTranslationKeys = _.keys(translations);
  return _.filter(allTranslationKeys, function(key){
    return _.indexOf(keys, key) === -1;
  });
};

Generator.prototype.getBadFormat = function (translations) {
  var badFormatKeys = [];
  var self = this;
  _.each(translations, function(value, key){
    if (!self.isRightFormat(value)) {
      badFormatKeys.push(key);
    }
  });
  return [];
};

Generator.prototype.isRightFormat = function (key) {
  if (!key) {
    return false;
  }
  return true;
};

Generator.prototype.getTranslationsKeys = function (keys, translations) {
  var allTranslationKeys = _.keys(translations);
  var translationsKeys = {};
  _.each(keys, function(key){
    if (_.indexOf(allTranslationKeys, key) !== -1) {
      translationsKeys[key] = translations[key];
    }
  });
  return translationsKeys;
};

Generator.prototype.run = function (filename, keys, translations, callback) {
  var keysTranslations = this.getTranslationsKeys(keys, translations);
  var notUsedKeys = this.getNotUsed(keys, translations);

  var reporting = {
    missing: this.getMissing(keys, translations),
    notUsed: notUsedKeys,
    badFormatUsed: this.getBadFormat(keysTranslations)
  };

  var self = this;
  async.series([
    function mkdir(next) {
      self.mkdir(self.options.wd, next);
    },
    function saveReporting(next) {
      self.saveReporting(filename, reporting, next);
    },
    function saveTranslationsKeys(next) {
      self.saveTranslationsKeys(filename, translations, next);
    }
  ], callback);
};

Generator.prototype.mkdir = function (dir, callback) {
  fs.exists(dir, function (exists) {
    if (exists) return callback();
    fs.mkdir(dir, callback);
  });
};

Generator.prototype.saveReporting = function(filename, reporting, callback) {
  jf.writeFile(this.getReportingFile(filename), reporting, callback);
};

Generator.prototype.saveTranslationsKeys = function(filename, json, callback) {
  this.getGenerator().run(this.getLangFile(filename), json, callback);
};

Generator.prototype.getLangFile = function(filename) {
  return this.options.wd + '/' + filename + '.js';
};

Generator.prototype.getReportingFile = function(filename) {
  return this.options.wd + '/' + filename + '-reporting.js';
};

Generator.prototype.getGenerator = function() {
  var type = this.options.type;
  if (_.indexOf(_.keys(Generators), type)) {
    return null;
  }
  return new Generators[type.toLowerCase()]();
};


module.exports = exports = Generator;