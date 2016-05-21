var Q, log;

log = require("log");

Q = require("q");

module.exports = function(options) {
  var deferred;
  repl.transform = options.transform != null ? options.transform : options.transform = process.env.REPL || "js";
  repl.loopMode = options.loopMode != null ? options.loopMode : options.loopMode = "nextTick";
  deferred = Q.defer();
  prompt.didClose(function() {
    return log.moat(0);
  });
  repl.didClose.once(function() {
    return deferred.resolve();
  });
  Q.nextTick(function() {
    return repl.sync();
  });
  return deferred.promise;
};

//# sourceMappingURL=../../map/src/repl.map
