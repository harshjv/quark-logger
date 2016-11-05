import path from 'path'
import xtend from 'xtend'
import { spawn } from 'child_process'
import { parse } from 'shell-quote'

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

const pathToNPMBinDirectory = () => path.resolve(__dirname, '..', 'node_modules/.bin')

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

  return spawn(file, args, options)
}

const handleSpawningInMainProcess = () => {
  let out
  const parsed = parse(ELECTRON_LIB, xtend({ '': '$' }), { escape: ESCAPE_CHAR }).map(commandToString).join(' ')

  const overridePATH = {
    [ PATH_KEY ]: [ pathToNPMBinDirectory(), env[PATH_KEY] ].join(PATH_SEP)
  }

  const child = formatAndSpawn(parsed, { env: xtend(env, overridePATH) })
  out = child.stdin.write.bind(child.stdin)

  child.stdin.setEncoding('utf-8')
  child.stdout.pipe(process.stdout)

  child.on('exit', () => {
    out = console.log.bind(console)
  })

  return (log) => out(log)
}

module.exports = () => {
  if (typeof process === 'undefined') {
    // Web browser

    return console.log.bind(console)
  } else {
    if (process.type === 'renderer') {
      // Renderer process
      const { ipcRenderer } = require('electron')

      return (log) => ipcRenderer.send('quark-logger:ipc', log)
    } else {
      if (process.versions.electron) {
        // Electron
        const { ipcMain } = require('electron')

        let logger = handleSpawningInMainProcess()

        ipcMain.on('quark-logger:ipc', (event, arg) => {
          logger(arg)
        })

        return logger
      } else {
        // Node.js

        return handleSpawningInMainProcess()
      }
    }
  }
}
