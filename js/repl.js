var Promise, immediate, log;

immediate = require("immediate");

Promise = require("Promise");

log = require("log");

module.exports = function(options) {
  var deferred;
  repl.transform = options.transform != null ? options.transform : options.transform = process.env.REPL || "js";
  repl.loopMode = options.loopMode != null ? options.loopMode : options.loopMode = "nextTick";
  deferred = Promise.defer();
  prompt.didClose(function() {
    return log.moat(0);
  });
  repl.didClose.once(function() {
    return deferred.resolve();
  });
  immediate(function() {
    return repl.sync();
  });
  return deferred.promise;
};

//# sourceMappingURL=map/repl.map
