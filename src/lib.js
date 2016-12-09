import stream from './stream'

let previousTime

const coerce = (val) => val instanceof Error ? val.stack || val.message : val
const log = stream()

const Quark = (namespace) => {
  return (...args) => {
    const currentTime = new Date()
    const diff = currentTime - (previousTime || currentTime)
    previousTime = currentTime

    args = args.map(arg => coerce(arg))

    log(JSON.stringify({
      diff: diff,
      time: currentTime,
      tag: namespace,
      data: args
    }))
  }
}

Quark.quarkWindow = { show () { log.showWindow() } }

module.exports = Quark
