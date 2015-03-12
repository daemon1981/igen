var _     = require("lodash");
var jf    = require('jsonfile');

// example options {
//   wd: "./locales",
//   type: "module"
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

Reporter.prototype.getTranslationsKeys = function (keys, translations) {
  var allTranslationKeys = _.keys(translations);
  var translationsKeys = {};
  _.each(keys, function(key){
    if (_.indexOf(allTranslationKeys, key) !== -1) {
      translationsKeys[key] = translations[key];
    }
  });
  return translationsKeys;
};

Reporter.prototype.getMissing = function (keys, translations) {
  var allTranslationKeys = _.keys(translations);
  return _.filter(keys, function(key){
    return _.indexOf(allTranslationKeys, key) === -1;
  });
};

Reporter.prototype.getNotUsed = function (keys, translations) {
  var allTranslationKeys = _.keys(translations);
  return _.filter(allTranslationKeys, function(key){
    return _.indexOf(keys, key) === -1;
  });
};

Reporter.prototype.getBadFormat = function (translations) {
  var badFormatKeys = [];
  var self = this;
  _.each(translations, function(value, key){
    if (!self.isRightFormat(value)) {
      badFormatKeys.push(key);
    }
  });
  return [];
};

Reporter.prototype.isRightFormat = function (key) {
  if (!key) {
    return false;
  }
  return true;
};

Reporter.prototype.run = function (keys, translations, callback) {
  var keysTranslations = this.getTranslationsKeys(keys, translations);
  var notUsedKeys = this.getNotUsed(keys, translations);

  var reporting = {
    missing: this.getMissing(keys, translations),
    notUsed: notUsedKeys,
    badFormatUsed: this.getBadFormat(keysTranslations)
  };

  this.saveReporting(reporting, callback);
};

Reporter.prototype.saveReporting = function(reporting, callback) {
  jf.writeFile(this.options.file, reporting, callback);
};


module.exports = exports = Reporter;