
module.exports = (options) ->
  repl.transform = options.transform ?= process.env.REPL or "js"
  repl.loopMode = options.loopMode ?= "nextTick"
  repl.didClose.once ->
    log.it "repl.didClose()"
    process.exit()
  repl.sync()
