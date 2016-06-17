
immediate = require "immediate"
Promise = require "Promise"
log = require "log"

module.exports = (options) ->

  repl.transform = options.transform ?= process.env.REPL or "js"
  repl.loopMode = options.loopMode ?= "nextTick"

  deferred = Promise.defer()

  prompt.didClose -> log.moat 0

  repl.didClose.once -> deferred.resolve()

  # When 'options.loopMode' equals "nextTick",
  # we cannot rely on 'repl.sync()' to block the
  # thread. Thus, we must create a Promise that
  # is resolved when 'repl.didClose' emits.
  # That's the only reliable way to know when
  # the 'repl' is actually finished.
  immediate -> repl.sync()

  return deferred.promise
