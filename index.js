var _            = require("lodash");
var async        = require("async");
var Templates    = require("./lib/templates");
var Translations = require("./lib/translations");
var Generator     = require("./lib/generator");

function IGen (options) {
  if (!options) {
    options = {};
  }
  var requiredFields = ['templates', 'translations', 'generator'];
  _.each(requiredFields, function(field){
    if (!options[field]) {
      throw new Error('Field "' + field + '" is required');
    }
  });

  this.translations = new Translations(options.translations);
  this.templates = new Templates(options.templates);
  this.generator = new Generator(options.generator);
}

IGen.prototype._runLang = function (language, callback) {
  var self = this;
  async.series({
    translations: function(next) {
      self.translations.extractLang(language, next);
    },
    keys: function(next) {
      self.templates.parseKeys(next);
    }
  }, function(err, results){
    if (err) return callback(err);

    var filename = self.translations.getLangFilename(language);
    if (!filename) {
      return callback('Filename is not defined for language: "' + language + '"');
    }

    var keys = results.keys;
    var translations = results.translations;

    self.generator.run(filename, keys, translations, callback);
  });
};


/**
 * Generate language files
 */
IGen.prototype.run = function (langName, callback) {
  var self = this;

  var languages = [langName];
  if (typeof langName === 'function') {
    languages = this.translations.getLanguages();
    callback = langName;
  }

  async.eachSeries(
    languages,
    function(language, next){
      if (!self.translations.getLangFilename(language)) {
        return next();
      }
      self._runLang(language, next);
    },
    callback
  );
};

module.exports = exports = IGen;