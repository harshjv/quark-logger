import stream from './stream'

let previousTime

const coerce = (val) => val instanceof Error ? val.stack || val.message : val
const log = stream()

const Quark = (tag) => {
  const { pid } = process

  return (...data) => {
    const time = new Date()
    const diff = time - (previousTime || time)
    previousTime = time

    data = data.map(arg => coerce(arg))

    log(JSON.stringify({
      pid, diff, time, tag, data
    }))
  }
}

Quark.quarkWindow = { show () { log.showWindow() } }

module.exports = Quark
