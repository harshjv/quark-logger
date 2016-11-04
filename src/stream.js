import path from 'path'
import xtend from 'xtend'
import { spawn } from 'child_process'
import { parse } from 'shell-quote'

const PATH_SEP = process.platform === 'win32' ? ';' : ':'
const PATH_KEY = process.platform === 'win32' && !(process.env.PATH && !process.env.Path) ? 'Path' : 'PATH'
const ESCAPE_CHAR = process.platform === 'win32' ? '^' : '\\'
const ELECTRON_LIB = `electron ${path.join(__dirname, 'electron.bundle.js')}`

const commandToString = (cmd) => cmd.pattern || cmd.op || handleQuotes(cmd)

const handleQuotes = (s) => {
  if (/["'\s]/.test(s)) return '"' + s.replace(/(["\\$`!])/g, '\\$1') + '"'
  if (/["\s]/.test(s) && !/'/.test(s)) return "'" + s.replace(/(['\\])/g, '\\$1') + "'"
  return String(s).replace(/([\\$`()!#&*|])/g, '\\$1')
}

const NPMBinPath = (cwd, PATH) => {
  const result = []
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

  if (process.platform === 'win32') {
    file = process.env.comspec || 'cmd.exe'
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

module.exports = () => {
  const cwd = process.cwd()
  const env = process.env
  const parsed = parse(ELECTRON_LIB, xtend({ '': '$' }), { escape: ESCAPE_CHAR }).map(commandToString).join(' ')

  const override = {
    [ PATH_KEY ]: NPMBinPath(path.resolve(cwd, '.'), env[PATH_KEY] || process.env[PATH_KEY])
  }

  const child = formatAndSpawn(parsed, { env: xtend(env, override) })
  let out = child.stdin.write.bind(child.stdin)

  child.stdin.setEncoding('utf-8')
  child.stdout.pipe(process.stdout)

  child.on('exit', () => {
    out = console.log.bind(console)
  })

  return (log) => out(log)
}
