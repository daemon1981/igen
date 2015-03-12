var fs = require("fs");
var _  = require('lodash');

// example options {
//   file:           "./file.csv",  // location of the translation "CSV" file (String)
//   indexHeader:    0,             // index of the header                    (Number, default 0)
//   indexStartBody: 1,             // starting index of the body             (Number, default 1)
//   keyColumn:      "dev",         // column of the translation keys         (Number|String, default 0)
//   refLanguage:    "fr",          // column of the ref translation language (Number|String, default 0)
//   languages: {
//     fr: {
//       column:   "fr" // (String|Number, required)
//       filename: "fr" // (String, required)
//     },
//     en: {
//       column:   "en"
//       filename: "en"
//     }
//   }
// },
function Translations (options) {
  if (!options) {
    options = {};
  }

  if (!options.file) {
    throw new Error('Field file is required');
  }
  
  options = _.defaults(options, {
    indexHeader: 0,     // index of the header                    (Number, default 0)
    indexStartBody: 1,  // starting index of the body             (Number, default 1)
    keyColumn: 0,       // column of the translation keys         (Number|String, default 0)
    refLanguage: 1      // column of the ref translation language (Number|String, default 0)
  });
  this.options = options;
}

Translations.prototype.getLanguages = function () {
  return _.keys(this.options.languages);
};

Translations.prototype.getLanguageConf = function (language) {
  if (_.indexOf(this.getLanguages(), language) === -1) {
    return null;
  }

  return this.options.languages[language];
};

Translations.prototype.getLangField = function (language, field) {
  var conf = this.getLanguageConf(language);

  if (!conf || !conf[field]) {
    return null;
  }

  return conf[field];
};

Translations.prototype.getLangFilename = function (language) {
  return this.getLangField(language, 'filename');
};

Translations.prototype.getLangColumn = function (language) {
  return this.getLangField(language, 'column');
};

Translations.prototype.extractLang = function (language, callback) {
  var langColumn = this.getLangColumn(language);
  var self = this;

  fs.readFile(this.options.file, { encoding: "utf-8" }, function (err, data) {
    if (err) return callback(err);

    var translations = {};
    var lines = data.split("\n");
    var header = lines.shift();

    var langIndex = self.getFieldColumnIndex(header, langColumn);
    var keyIndex = self.getFieldColumnIndex(header, self.options.keyColumn);

    _.each(lines, function(line){
      var data = self.parseCsvLine(line, keyIndex, langIndex);
      if (!data) {
        return;
      }
      translations[data.key] = data.value;
    });

    translations = self.sortByKey(translations);

    callback(null, translations);
  });
};

Translations.prototype.sortByKey = function (translations) {
  var keys = _.keys(translations);
  keys.sort();

  var sortedTranslations = {};
  _.each(keys, function(key){
    sortedTranslations[key] = translations[key];
  });
  return sortedTranslations;
};

Translations.prototype.parseCsvLine = function (line, keyIndex, langIndex) {
  var values = line.split(';');
  var key = values[keyIndex];
  var trad = values[langIndex];

  if (!key) {
    return null;
  }

  return { key: key.trim(), value: trad.trim() };
};

Translations.prototype.getFieldColumnIndex = function(header, field) {
  if (!_.isString(field)) {
    return field;
  }

  var fields = header.split(';');
  var i = 0;
  var index = -1;
  while (i < fields.length) {
    if (new RegExp(field, 'i').test(fields[i])){
      index = i;
    }
    i++;
  }
  return index;
};

module.exports = exports = Translations;