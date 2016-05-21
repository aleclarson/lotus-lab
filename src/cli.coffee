
{ spawn } = require "child_process"

syncFs = require "io/sync"
Path = require "path"
log = require "log"

module.exports = (options) ->

  dir = options._.shift() or "."
  filename = options._.shift() or "index"

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
    return

  runLab = require "./runLab"
  runLab path, options
