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

IGen.prototype._runLang = function (language, callback) {
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

    self.generator.run(filename, results.translations, function(err){
      if (err) return callback(err);
      callback(null, results.translations);
    });
  });
};

IGen.prototype._run = function (keys, callback) {
  var self = this;
  var allTranslations = {};

  async.eachSeries(
    this.translations.getLanguages(),
    function(language, next){
      self._runLang(language, function(err, translations){
        if (err) return next(err);
        allTranslations[language] = translations;
        next();
      });
    },
    function(err){
      if (err) return callback(err);
      callback(null, allTranslations);
    }
  );
};

/**
 * Generate language files
 */
IGen.prototype.run = function (callback) {
  var self = this;

  async.waterfall([
    function keys(next) {
      self.keys.run(next);
    },
    function runLangs(keys, next) {
      self._run(keys, function(err, allTranslations){
        if (err) return next(err);
        next(null, keys, allTranslations);
      });
    },
    function reporting(keys, allTranslations, next) {
      self.reporter.run(keys, allTranslations, next);
    }
  ], callback);
};

module.exports = exports = IGen;