
isNodeJS = require "isNodeJS"
didExit = require "didExit"
coffee = require "coffee-script"
rimraf = require "rimraf"
isDev = require "isDev"
path = require "path"
sync = require "sync"
fs = require "fsx"
vm = require "vm"

template = fs.readFile path.resolve __dirname + "/../src/template.coffee"

module.exports = (entry, options = {}) ->

  unless fs.isFile entry
    throw Error "Must provide a file path: '#{entry}'"

  #
  # Resolve the script path
  #

  entryDir = path.dirname entry
  outDir = path.resolve entryDir, "tmp"

  loop
    id = Random.id 6
    break unless fs.exists path.join outDir, id + ".coffee"

  relatives = {}
  sync.each ["coffee", "js", "map"], (ext) ->
    relatives[ext] = id + "." + ext

  absolutes = sync.map relatives, (filePath) ->
    path.join outDir, filePath

  mapRef = log.ln + "//# sourceMappingURL=" + relatives.map + log.ln

  #
  # Build the script
  #

  script =
    fs.readFile entry
    .trim()
    .split log.ln
    .join log.ln + "    "

  script = [
    "__dirname = \"#{path.dirname absolutes.js}\""
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

  fs.writeDir outDir
  fs.writeFile absolutes.coffee, script
  fs.writeFile absolutes.js, output.js + mapRef
  fs.writeFile absolutes.map, output.v3SourceMap

  didExit ->
    log.moat 1
    log.red "EXIT"
    log.moat 1
    if options.preservePaths isnt yes
      sync.each absolutes, (path) ->
        rimraf.sync path
    return

  log.pushIndent 2
  log.moat 1
  log.white "lotus-lab "
  log.green id
  log.moat 0
  log.yellow path.relative lotus.path, entry
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
  vm.runInThisContext "try { global.__module.require('#{absolutes.js}') } catch(error) { console.log('caught error!'); process.exit(0) }"
  return yes

createModule = do ->
  Module = require "module"
  return (modPath, parent) ->
    mod = new Module modPath, parent
    mod.filename = modPath
    mod.dirname = path.dirname modPath
    return mod
