import Debug from 'debug'

import path from 'path'
import xtend from 'xtend'
import { spawn } from 'child_process'
import { parse } from 'shell-quote'

let logger = console.log.bind(console)
let quarkWindowVisible = false

const debug = Debug('quark-logger:stream')

const { platform, env } = process

const PATH_SEP = platform === 'win32' ? ';' : ':'
const PATH_KEY = platform === 'win32' && !(env.PATH && !env.Path) ? 'Path' : 'PATH'
const ESCAPE_CHAR = platform === 'win32' ? '^' : '\\'
const ELECTRON_LIB = `electron ${path.join(__dirname, 'electron.bundle.js')}`

const commandToString = (cmd) => cmd.pattern || cmd.op || handleQuotes(cmd)

const handleQuotes = (s) => {
  if (/["'\s]/.test(s)) return '"' + s.replace(/(["\\$`!])/g, '\\$1') + '"'
  if (/["\s]/.test(s) && !/'/.test(s)) return "'" + s.replace(/(['\\])/g, '\\$1') + "'"
  return String(s).replace(/([\\$`()!#&*|])/g, '\\$1')
}

const getNewPathVariable = () => {
  let PATH = env[PATH_KEY]
  let result = []
  let cwd = process.cwd()
  let parent

  while (true) {
    parent = path.join(cwd, '..')
    result.push(path.join(cwd, 'node_modules/.bin'))
    if (parent === cwd) return result.concat(PATH).join(PATH_SEP)
    cwd = parent
  }
}

const formatAndSpawn = (command, opts) => {
  const options = xtend({}, opts)
  let file
  let args

  if (platform === 'win32') {
    file = env.comspec || 'cmd.exe'
    args = [ '/s', '/c', '"' + command + '"' ]
    options.windowsVerbatimArguments = true
  } else {
    file = '/bin/sh'
    args = [ '-c', command ]
    options.windowsVerbatimArguments = false
  }

  if (options && options.shell) {
    file = options.shell
    delete options.shell
  }

  debug('Spawning electron', file, args, options)

  return spawn(file, args, options)
}

const handleSpawningInMainProcess = () => {
  function Out (logs) {
    logger(logs)
  }

  Out.showWindow = function () {
    if (quarkWindowVisible) return

    const parsed = parse(ELECTRON_LIB, xtend({ '': '$' }), { escape: ESCAPE_CHAR }).map(commandToString).join(' ')

    const overridePATH = {
      [ PATH_KEY ]: getNewPathVariable()
    }

    const child = formatAndSpawn(parsed, { env: xtend(env, overridePATH) })
    logger = child.stdin.write.bind(child.stdin)

    child.stdin.setEncoding('utf-8')
    child.stdout.pipe(process.stdout)

    quarkWindowVisible = true

    child.on('exit', () => {
      logger = console.log.bind(console)
    })
  }

  return Out
}

module.exports = () => {
  if (typeof process === 'undefined') {
    // Web browser
    debug('Web browser')

    return console.log.bind(console)
  } else {
    if (process.type === 'renderer') {
      // Renderer process
      debug('Electron renderer process')

      const { ipcRenderer } = require('electron')

      const Out = function (logs) {
        console.log(logs)
        ipcRenderer.send('quark-logger:ipc', logs)
      }

      Out.showWindow = function () {
        ipcRenderer.send('quark-logger:show-quark-window')
      }

      return Out
    } else {
      // Electron
      debug('Electron main process')

      const { ipcMain } = require('electron')

      let logger = handleSpawningInMainProcess()

      ipcMain.on('quark-logger:show-quark-window', (event, arg) => {
        logger.showWindow()
      })

      ipcMain.on('quark-logger:ipc', (event, arg) => logger(arg))

      return logger
    }
  }
}
