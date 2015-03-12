var _            = require("lodash");
var async        = require("async");
var Keys         = require("./lib/keys");
var Translations = require("./lib/translations");
var Generator    = require("./lib/generator");
var Reporter     = require("./lib/reporter");

function IGen (options) {
  if (!options) {
    options = {};
  }
  var requiredFields = ['keys', 'translations', 'generator', 'reporter'];
  _.each(requiredFields, function(field){
    if (!options[field]) {
      throw new Error('Field "' + field + '" is required');
    }
  });

  this.translations = new Translations(options.translations.options);
  this.keys = new Keys(options.keys.options);
  this.generator = new Generator(options.generator.options);
  this.reporter = new Reporter(options.reporter.options);
}

IGen.prototype._runLang = function (language, keys, callback) {
  var self = this;

  var filename = self.translations.getLangFilename(language);
  if (!filename) {
    return callback('Filename is not defined for language: "' + language + '"');
  }

  async.series({
    translations: function(next) {
      self.translations.extractLang(language, next);
    }
  }, function(err, results){
    if (err) return callback(err);

    self._processLangResults(filename, keys, results.translations, callback);
  });
};

IGen.prototype._processLangResults = function (filename, keys, translations, callback) {
  var self = this;

  async.series({
    generator: function(next) {
      self.generator.run(filename, translations, next);
    },
    reporter: function(next) {
      self.reporter.run(keys, translations, next);
    }
  }, function(err){
    callback(err);
  });
};

IGen.prototype._run = function (keys, callback) {
  var self = this;

  async.eachSeries(
    this.translations.getLanguages(),
    function(language, next){
      self._runLang(language, keys, next);
    },
    callback
  );
};

/**
 * Generate language files
 */
IGen.prototype.run = function (callback) {
  var self = this;

  async.series({
    keys: function(next) {
      self.keys.run(next);
    }
  }, function(err, results) {
    if (err) return callback(err);

    self._run(results.keys, callback);
  });
};

module.exports = exports = IGen;