function Abstract(path, helperName) {
  this.path = path;
  this.helperName = helperName;
}

Abstract.prototype.parseKeys = function () {
  throw new Error("method parseKeys should be implemented");
};

Abstract.prototype.getHelperName = function () {
  return this.helperName;
};

Abstract.prototype.getPath = function () {
  return this.path;
};

module.exports = exports = Abstract;