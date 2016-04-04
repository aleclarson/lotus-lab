
module.exports = ->

  @commands.lab = -> require "./cli"

  @commands.repl = -> require "./repl"

  return null
