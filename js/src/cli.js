var Path, base, base1, dir, filename, lab, minimist, parentDir, path, spawn, syncFs;

spawn = require("child_process").spawn;

minimist = require("minimist");

syncFs = require("io/sync");

Path = require("path");

dir = (base = process.options._)[1] != null ? base[1] : base[1] = ".";

filename = (base1 = process.options._)[2] != null ? base1[2] : base1[2] = "index";

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
  process.exit();
}

lab = require("./index");

lab(path, process.options);

//# sourceMappingURL=../../map/src/cli.map
