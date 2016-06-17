
module = global.__module
require = module.require.bind module

__keepAlive = setInterval (->), Infinity

Promise.try ->
  __lab()

.then ->
  log.moat 1
  log.green "Lab finished!"
  log.moat 1

.fail (error) ->
  log.moat 1
  log.red "Lab failed!"
  log.moat 0
  log.gray.dim error.stack.trim()
  log.white " "
  log.moat 1
  repl.sync { error, failure: global.failure }

.always ->
  clearInterval __keepAlive

.done()
