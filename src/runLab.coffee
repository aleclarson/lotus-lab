
printSyntaxError = require "printSyntaxError"
isNodeJS = require "isNodeJS"
didExit = require "didExit"
Random = require "random"
coffee = require "coffee-script"
define = require "define"
isDev = require "isDev"
Path = require "path"
sync = require "sync"
FS = require "io/sync"
VM = require "vm"

template = FS.read Path.resolve __dirname + "/../src/template.coffee"

module.exports = (entry, options = {}) ->

  if not FS.isFile entry
    throw Error "Must provide a file path: '#{entry}'"

  #
  # Resolve the script path
  #

  entryDir = Path.dirname entry
  outDir = Path.resolve entryDir, "tmp"

  loop
    id = Random.id 6
    break unless FS.exists Path.join outDir, id + ".coffee"

  relatives = {}
  sync.each ["coffee", "js", "map"], (ext) ->
    relatives[ext] = id + "." + ext

  absolutes = sync.map relatives, (filePath) ->
    Path.join outDir, filePath

  mapRef = log.ln + "//# sourceMappingURL=" + relatives.map + log.ln

  #
  # Build the script
  #

  script = FS
    .read entry
    .trim()
    .split log.ln
    .join log.ln + "    "

  script = [
    "__dirname = \"#{Path.dirname absolutes.js}\""
    "__filename = \"#{absolutes.js}\""
    template.replace /\$SCRIPT/g, script
  ].join log.ln

  log.cyan script

  #
  # Transpile the script
  #

  try
    output = coffee.compile script,
      bare: yes
      sourceMap: yes
      sourceRoot: "."
      sourceFiles: [relatives.coffee]
      generatedFile: relatives.js
      filename: absolutes.coffee

  catch error
    printSyntaxError error, entry
    log.moat 1
    return no

  FS.makeDir outDir
  FS.write absolutes.coffee, script
  FS.write absolutes.js, output.js + mapRef
  FS.write absolutes.map, output.v3SourceMap

  didExit ->
    log.moat 1
    log.red "EXIT"
    log.moat 1
    if options.preservePaths isnt yes
      sync.each absolutes, (path) -> FS.remove path
    return

  log.pushIndent 2
  log.moat 1
  log.white "lotus-lab "
  log.green id
  log.moat 0
  log.yellow Path.relative lotus.path, entry
  log.moat 1
  log.popIndent()

  global.lotus = lotus
  global.sync = sync
  define global, {
    isDev
    isNodeJS
    process
    log
    Promise
  }

  global.__module = makeModule entry, module
  VM.runInThisContext "try { global.__module.require('#{absolutes.js}') } catch(error) { console.log('caught error!'); process.exit(0) }"
  return yes

Module = require "module"
makeModule = (modulePath, parentModule) ->
  newModule = new Module modulePath, parentModule
  newModule.filename = modulePath
  newModule.dirname = Path.dirname modulePath
  return newModule
