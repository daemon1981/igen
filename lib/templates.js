var _ = require("lodash");
var Parsers = {
  handlebars: require("./templates/handlebars")
};

// example options {
//   path: "./templates",
//   type: "handlebars",
//   helperName: "t"
// }
function Templates (options) {
  if (!options) {
    options = {};
  }
  var requiredFields = ['path', 'type', 'helperName'];
  _.each(requiredFields, function(field){
    if (!options[field]) {
      throw new Error('Field "' + field + '" is required');
    }
  });
  this.options = options;
}

Templates.prototype.parseKeys = function(callback) {
  this.getParser().parseKeys(callback);
};

Templates.prototype.getParser = function() {
  var type = this.options.type;
  if (_.indexOf(_.keys(Parsers), type)) {
    return null;
  }
  return new Parsers[type.toLowerCase()](this.options.path, this.options.helperName);
};

module.exports = exports = Templates;