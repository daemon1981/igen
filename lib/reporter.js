var _     = require("lodash");
var jf    = require('jsonfile');

// example options {
//   file: "./locales"
// }
function Reporter (options) {
  if (!options) {
    options = {};
  }

  options = _.defaults(options, {
    file: "./reporting"
  });

  this.options = options;
}

Reporter.prototype.getMissing = function (keys, translationsKeys) {
  return _.filter(keys, function(key){
    return _.indexOf(translationsKeys, key) === -1;
  });
};

Reporter.prototype.getUsed = function (keys, translationsKeys) {
  return _.filter(translationsKeys, function(key){
    return _.indexOf(keys, key) !== -1;
  });
};

Reporter.prototype.getNotUsed = function (keys, translationsKeys) {
  return _.filter(translationsKeys, function(key){
    return _.indexOf(keys, key) === -1;
  });
};

/**
 * Here we get keys of the first translations as it all translations should have the same keys
 */
Reporter.prototype.getTranslationsKeys = function (allTranslations) {
  var languages = _.keys(allTranslations);
  return _.keys(allTranslations[languages[0]]);
};

Reporter.prototype.run = function (keys, allTranslations, callback) {
  var self = this;

  var translationsKeys = this.getTranslationsKeys(allTranslations);
  var usedKeys = this.getUsed(keys, translationsKeys);

  var reporting = {
    keys: {
      missing:       this.getMissing(keys, translationsKeys),
      used:          usedKeys,
      notUsed:       this.getNotUsed(keys, translationsKeys)
    },
    translations: {}
  };

  _.each(allTranslations, function(translations, language){
    var usedTranslations = self.intersectTranslations(usedKeys, translations);
    reporting.translations[language] = self.runTranslations(usedTranslations);
  });

  this.saveReporting(reporting, callback);
};

Reporter.prototype.intersectTranslations = function (keys, translations) {
  var intersectTranslations = {};
  _.each(keys, function(key){
    intersectTranslations[key] = translations[key];
  });
  return intersectTranslations;
};

Reporter.prototype.runTranslations = function (translations) {
  return {
    empty: this.getEmpty(translations),
    badFormat: this.getBadFormat(translations)
  };
};

Reporter.prototype.getEmpty = function (translations) {
  var keys = [];
  _.each(translations, function(value, key){
    if (value.trim() === '') {
      keys.push(key);
    }
  });
  return keys;
};

Reporter.prototype.getBadFormat = function (translations) {
  var keys = [];
  var self = this;
  _.each(translations, function(value, key){
    if (!self.isRightFormat(value)) {
      keys.push(key);
    }
  });
  return keys;
};

Reporter.prototype.isRightFormat = function (value) {
  if (!value) {
    return false;
  }
  return true;
};

Reporter.prototype.saveReporting = function(reporting, callback) {
  jf.writeFile(this.options.file, reporting, callback);
};


module.exports = exports = Reporter;