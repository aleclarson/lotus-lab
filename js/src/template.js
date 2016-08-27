var $LAB, Promise, log, module, noop, require;

require(process.env.LOTUS_PATH + "/lotus");

log = require("log");

noop = function() {};

module = global.__module || global.module;

require = module.require.bind(module);

$LAB = {};

$LAB.keepAlive = setInterval(noop, 2e308);

$LAB.run = function() {
  var error;
  try {
    return $SCRIPT;
  } catch (error1) {
    error = error1;
    log.moat(1);
    log.red(error.stack);
    log.moat(1);
    return repl.sync(function(script) {
      return eval(script);
    });
  }
};

Promise = require("Promise");

Promise["try"]($LAB.run).then(function() {
  log.moat(1);
  log.green("Lab finished!");
  log.moat(1);
  return clearInterval($LAB.keepAlive);
}).fail(function(error) {
  log.moat(1);
  log.red(error.stack);
  log.moat(1);
  return clearInterval($LAB.keepAlive);
});

//# sourceMappingURL=map/template.map
