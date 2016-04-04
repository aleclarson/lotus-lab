module.exports = function() {
  this.commands.lab = function() {
    return require("./cli");
  };
  this.commands.repl = function() {
    return require("./repl");
  };
  return null;
};

//# sourceMappingURL=../../map/src/index.map
