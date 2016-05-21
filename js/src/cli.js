var Path, log, spawn, syncFs;

spawn = require("child_process").spawn;

syncFs = require("io/sync");

Path = require("path");

log = require("log");

module.exports = function(options) {
  var dir, filename, parentDir, path, runLab;
  dir = options._.shift() || ".";
  filename = options._.shift() || "index";
  if (!Path.isAbsolute(dir)) {
    parentDir = dir[0] === "." ? process.cwd() : lotus.path;
    dir = Path.resolve(parentDir, dir);
  }
  path = dir;
  if (syncFs.isDir(dir)) {
    path += "/lab/" + filename + ".coffee";
  }
  if (!syncFs.isFile(path)) {
    log.moat(1);
    log.red("Invalid file: ");
    log.white(path);
    log.moat(1);
    return;
  }
  runLab = require("./runLab");
  return runLab(path, options);
};

//# sourceMappingURL=../../map/src/cli.map
