
{ findPackage } = require "lotus-require/js/src/helpers"

randomString = require "random-string"
repeatString = require "repeat-string"
isNodeJS = require "isNodeJS"
combine = require "combine"
didExit = require "exit"
syncFs = require "io/sync"
Module = require "module"
isDev = require "isDev"
Path = require "path"
sync = require "sync"
gaze = require "gaze"
VM = require "vm"

CS = require "coffee-script"

module.exports = (entry, options = {}) ->

  lotus.dependers[findPackage entry] = yes

  input = syncFs.read entry
  input = input.split log.ln
  input = input.map (line) -> "  " + line
  input.unshift syncFs.read Path.resolve __dirname + "/../../lab/header.coffee"
  input.push syncFs.read Path.resolve __dirname + "/../../lab/footer.coffee"
  input = input.join log.ln

  outputDir = Path.resolve Path.join __dirname, "../../tmp"

  extensions = ["coffee", "js", "map"]

  loop
    id = randomString 6
    break unless syncFs.exists Path.join outputDir, id + ".coffee"

  paths = {}

  paths.relative = sync.reduce extensions, {}, (paths, extension) ->
    paths[extension] = id + "." + extension
    paths

  paths.absolute = sync.map paths.relative, (path) ->
    Path.join outputDir, path

  mapRef = log.ln + "//# sourceMappingURL=" + paths.relative.map + log.ln

  try
    output = CS.compile input,
      bare: yes
      sourceMap: yes
      sourceRoot: "."
      sourceFiles: [paths.relative.coffee]
      generatedFile: paths.relative.js
      filename: paths.absolute.coffee

  catch error
    _logSyntaxError error, entry
    return no

  syncFs.makeDir outputDir
  syncFs.write paths.absolute.coffee, input
  syncFs.write paths.absolute.js, output.js + mapRef
  syncFs.write paths.absolute.map, output.v3SourceMap

  options.preservePaths ?= no
  if !options.preservePaths
    didExit ->
      sync.each paths.absolute, (path) ->
        syncFs.remove path

  log.pushIndent 2
  log.moat 1
  log.white "lotus-lab "
  log.green id
  log.moat 0
  log.yellow Path.relative lotus.path, entry
  log.moat 1
  log.popIndent()

  combine global, { isDev, isNodeJS, process, lotus, log, sync }

  global.__module = new Module entry, module
  __module.filename = entry
  __module.dirname = Path.dirname entry

  VM.runInThisContext "global.__module.require('#{paths.absolute.js}')"

  yes

#
# Helpers
#

_logSyntaxError = (error, filename) ->

  label = log.color.bgRed error.constructor.name
  message = error.message
  line = error.location.first_line
  code = error.code.split log.ln
  column = error.location.first_column

  log.pushIndent 2
  log.moat 1
  log.withLabel label, message
  log.moat 1
  log.stack._logLocation line - 1, filename
  log.moat 1
  log.stack._logOffender code[line], column
  log.popIndent()

  log.repl.sync { error }
