var _            = require("lodash");
var async        = require("async");
var Templates    = require("./lib/templates");
var Translations = require("./lib/translations");
var Generator    = require("./lib/generator");

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

IGen.prototype._runLang = function (language, keys, callback) {
  var self = this;
  async.series({
    translations: function(next) {
      self.translations.extractLang(language, next);
    }
  }, function(err, results){
    if (err) return callback(err);

    var filename = self.translations.getLangFilename(language);
    if (!filename) {
      return callback('Filename is not defined for language: "' + language + '"');
    }

    var translations = results.translations;

    self.generator.run(filename, keys, translations, callback);
  });
};

IGen.prototype._run = function (keys, callback) {
  var self = this;

  async.eachSeries(
    this.translations.getLanguages(),
    function(language, next){
      if (!self.translations.getLangFilename(language)) {
        return next();
      }
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
      self.templates.parseKeys(next);
    }
  }, function(err, results) {
    if (err) return callback(err);

    self._run(results.keys, callback);
  });
};

module.exports = exports = IGen;