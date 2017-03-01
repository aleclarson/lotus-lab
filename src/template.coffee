
require process.env.LOTUS_PATH + "/lotus"

noop = ->
module = global.__module or global.module
require = module.require.bind module

$LAB = {}
$LAB.keepAlive = setInterval noop, Infinity
$LAB.run = ->

  try
    $SCRIPT

  catch error
    log.moat 1
    log.red error.stack
    log.moat 1
    repl.sync (script) -> eval script

Promise = require "Promise"
Promise.try $LAB.run

.then ->
  log.moat 1
  log.green "Lab finished!"
  log.moat 1
  clearInterval $LAB.keepAlive

.fail (error) ->
  log.moat 1
  log.red error.stack
  log.moat 1
  clearInterval $LAB.keepAlive
