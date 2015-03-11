function Abstract() {
}

Abstract.prototype.run = function () {
  throw new Error("method parseKeys should be implemented");
};

module.exports = exports = Abstract;