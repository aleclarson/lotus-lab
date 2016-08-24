exports.initCommands = function() {
  return {
    lab: function() {
      return require("./cli");
    },
    repl: function() {
      return require("./repl");
    }
  };
};

//# sourceMappingURL=map/index.map
