var CS, Module, Path, VM, _logSyntaxError, combine, exit, findPackage, gaze, isDev, isNodeJS, lab, randomString, repeatString, sync, syncFs;

findPackage = require("lotus-require/js/src/helpers").findPackage;

randomString = require("random-string");

repeatString = require("repeat-string");

isNodeJS = require("isNodeJS");

combine = require("combine");

syncFs = require("io/sync");

Module = require("module");

isDev = require("isDev");

Path = require("path");

sync = require("sync");

exit = require("exit");

gaze = require("gaze");

VM = require("vm");

CS = require("coffee-script");

lab = module.exports = function(entry, options) {
  var error, extensions, id, input, mapRef, output, outputDir, paths;
  if (options == null) {
    options = {};
  }
  lotus.dependers[findPackage(entry)] = true;
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
    output = CS.compile(input, {
      bare: true,
      sourceMap: true,
      sourceRoot: ".",
      sourceFiles: [paths.relative.coffee],
      generatedFile: paths.relative.js,
      filename: paths.absolute.coffee
    });
  } catch (_error) {
    error = _error;
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
    exit.on(function() {
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
    sync: sync
  });
  global.__module = new Module(entry, module);
  __module.filename = entry;
  __module.dirname = Path.dirname(entry);
  VM.runInThisContext("global.__module.require('" + paths.absolute.js + "')");
  return true;
};

_logSyntaxError = function(error, filename) {
  var code, column, label, line, message;
  label = log.color.bgRed(error.constructor.name);
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
  return log.repl.sync({
    error: error
  });
};

//# sourceMappingURL=../../map/src/index.map
