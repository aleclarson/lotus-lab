
{ spawn } = require "child_process"

syncFs = require "io/sync"
Path = require "path"

dir = process.options._[1] ?= "."
filename = process.options._[2] ?= "index"

unless Path.isAbsolute dir
  parentDir = if dir[0] is "." then process.cwd() else lotus.path
  dir = Path.resolve parentDir, dir

path = dir
path += "/lab/" + filename + ".coffee" if syncFs.isDir dir

unless syncFs.isFile path
  log.moat 1
  log.red "Invalid file: "
  log.white path
  log.moat 1
  process.exit()

runLab = require "./runLab"
runLab path, process.options
