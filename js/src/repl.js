module.exports = function(options) {
  repl.transform = options.transform != null ? options.transform : options.transform = process.env.REPL || "js";
  repl.loopMode = options.loopMode != null ? options.loopMode : options.loopMode = "nextTick";
  repl.didClose.once(function() {
    log.it("repl.didClose()");
    return process.exit();
  });
  return repl.sync();
};

//# sourceMappingURL=../../map/src/repl.map
