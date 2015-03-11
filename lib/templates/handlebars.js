var util = require('util');
var _    = require('lodash');
var exec = require('child_process').exec;

var Abstract = require('./abstract');

function Handlebars(path, helperName) {
  Abstract.call(this, path, helperName);
}

util.inherits(Handlebars, Abstract);

Handlebars.prototype.parseKeys = function (callback) {
  var cmd = "grep -ohPrs '{{\\s*" + this.getHelperName() + "\\s+.*?}}' " + this.getPath();

  exec(cmd, function(error, stdout, stderr){
    if (error) return callback(error);
    if (stderr) return callback(stderr);
    var keys = stdout.split('\n');

    keys = _.map(keys, function(key){
      if (!_.isString(key)) {
        return null;
      }

      key = key.trim();
      if (!key) {
        return null;
      }

      var result = /{{\s*t\b(.*)}}/.exec(key);
      if (!result || !result[1]) {
        return null;
      }
      key = result[1].replace(/"/g, '');
      key = key.replace(/\'/g, '');

      return key.trim();
    });

    callback(null, _.filter(keys));
  });
};

module.exports = exports = Handlebars;