var Module, Path, Promise, VM, _logSyntaxError, coffee, combine, didExit, log, randomString, repeatString, sync, syncFs;

require("isDev");

require("isNodeJS");

randomString = require("random-string");

repeatString = require("repeat-string");

Promise = require("Promise");

combine = require("combine");

didExit = require("exit");

coffee = require("coffee-script");

syncFs = require("io/sync");

Module = require("module");

Path = require("path");

sync = require("sync");

log = require("log");

VM = require("vm");

module.exports = function(entry, options) {
  var error, extensions, id, input, mapRef, output, outputDir, paths, pkgPath;
  if (options == null) {
    options = {};
  }
  pkgPath = lotus._helpers.findPackage(entry);
  lotus.dependers[pkgPath] = true;
  input = syncFs.read(entry);
  input = input.split(log.ln);
  input = input.map(function(line) {
    return "  " + line;
  });
  input.unshift(syncFs.read(Path.resolve(__dirname + "/../../lab/header.coffee")));
  input.push(syncFs.read(Path.resolve(__dirname + "/../../lab/footer.coffee")));
  input = input.join(log.ln);
  outputDir = Path.resolve(Path.join(__dirname, "../../tmp"));
  extensions = ["coffee", "js", "map"];
  while (true) {
    id = randomString(6);
    if (!syncFs.exists(Path.join(outputDir, id + ".coffee"))) {
      break;
    }
  }
  paths = {};
  paths.relative = sync.reduce(extensions, {}, function(paths, extension) {
    paths[extension] = id + "." + extension;
    return paths;
  });
  paths.absolute = sync.map(paths.relative, function(path) {
    return Path.join(outputDir, path);
  });
  mapRef = log.ln + "//# sourceMappingURL=" + paths.relative.map + log.ln;
  try {
    output = coffee.compile(input, {
      bare: true,
      sourceMap: true,
      sourceRoot: ".",
      sourceFiles: [paths.relative.coffee],
      generatedFile: paths.relative.js,
      filename: paths.absolute.coffee
    });
  } catch (error1) {
    error = error1;
    _logSyntaxError(error, entry);
    return false;
  }
  syncFs.makeDir(outputDir);
  syncFs.write(paths.absolute.coffee, input);
  syncFs.write(paths.absolute.js, output.js + mapRef);
  syncFs.write(paths.absolute.map, output.v3SourceMap);
  if (options.preservePaths == null) {
    options.preservePaths = false;
  }
  if (!options.preservePaths) {
    didExit(function() {
      return sync.each(paths.absolute, function(path) {
        return syncFs.remove(path);
      });
    });
  }
  log.pushIndent(2);
  log.moat(1);
  log.white("lotus-lab ");
  log.green(id);
  log.moat(0);
  log.yellow(Path.relative(lotus.path, entry));
  log.moat(1);
  log.popIndent();
  combine(global, {
    isDev: isDev,
    isNodeJS: isNodeJS,
    process: process,
    lotus: lotus,
    log: log,
    sync: sync,
    Promise: Promise
  });
  global.__module = new Module(entry, module);
  __module.filename = entry;
  __module.dirname = Path.dirname(entry);
  VM.runInThisContext("global.__module.require('" + paths.absolute.js + "')");
  return true;
};

_logSyntaxError = function(error, filename) {
  var code, column, label, line, message;
  label = log.color.red(error.constructor.name);
  message = error.message;
  line = error.location.first_line;
  code = error.code.split(log.ln);
  column = error.location.first_column;
  log.pushIndent(2);
  log.moat(1);
  log.withLabel(label, message);
  log.moat(1);
  log.stack._logLocation(line - 1, filename);
  log.moat(1);
  log.stack._logOffender(code[line], column);
  log.popIndent();
  return repl.sync({
    error: error
  });
};

//# sourceMappingURL=../../map/src/runLab.map
