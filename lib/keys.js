var _    = require("lodash");
var exec = require('child_process').exec;

// example options {
//   path: "./templates",
//   helperName: "t"
// }
function Templates (options) {
  if (!options) {
    options = {};
  }
  var requiredFields = ['path', 'helperName'];
  _.each(requiredFields, function(field){
    if (!options[field]) {
      throw new Error('Field "' + field + '" is required');
    }
  });
  this.options = options;
}

Templates.prototype.getHelperName = function () {
  return this.options.helperName;
};

Templates.prototype.getPath = function () {
  return this.options.path;
};

Templates.prototype.run = function (callback) {
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

    // remove null values
    keys = _.filter(keys);
    // unicity
    keys = _.uniq(keys);

    callback(null, keys);
  });
};

module.exports = exports = Templates;