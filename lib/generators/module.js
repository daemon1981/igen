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
  this.writeFile(file, '', callback);
};

ModuleGenerator.prototype.writeHeader = function (file, callback) {
  this.appendFile(file, 'module.exports = {\n', callback);
};

ModuleGenerator.prototype.writeContent = function (file, json, callback) {
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

ModuleGenerator.prototype.writeFooter = function (file, callback) {
  this.appendFile(file, '};', callback);
};

ModuleGenerator.prototype.appendFile = function (file, data, callback) {
  fs.appendFile(file, data, { encoding: "utf-8" }, callback);
};

ModuleGenerator.prototype.writeFile = function (file, data, callback) {
  fs.writeFile(file, data, { encoding: "utf-8" }, callback);
};

module.exports = exports = ModuleGenerator;