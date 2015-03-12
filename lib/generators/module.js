var fs    = require('fs');
var _     = require('lodash');
var util  = require('util');
var async = require('async');

var Abstract = require('./abstract');

function ModuleGenerator() {
  Abstract.call(this);
}

util.inherits(ModuleGenerator, Abstract);

ModuleGenerator.prototype.run = function (file, json, callback) {
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

ModuleGenerator.prototype.resetContent = function (file, callback) {
  fs.writeFile(file, '', callback);
};

ModuleGenerator.prototype.writeHeader = function (file, callback) {
  fs.appendFile(file, 'module.exports = {\n', callback);
};

ModuleGenerator.prototype.writeContent = function (file, json, callback) {
  var i = 0;
  var keys = _.keys(json);
  var numKeys = keys.length;
  async.eachSeries(
    keys,
    function(key, next){
      var value = json[key].replace(/"/g, '\\"');
      var line = '  ' + key + ': "' + value + '"';
      if (i < numKeys - 1) {
        line += ',';
      }
      fs.appendFile(file, line + '\n', next);
      i++;
    },
    callback
  );
};

ModuleGenerator.prototype.writeFooter = function (file, callback) {
  fs.appendFile(file, '};', callback);
};

module.exports = exports = ModuleGenerator;