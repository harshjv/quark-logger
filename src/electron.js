import path from 'path'
import { app, BrowserWindow } from 'electron'

import HTML_FILE from './index.html'

process.stdin.resume()
process.stdin.setEncoding('utf8')

app.on('ready', () => {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: false,
    fullscreenable: true,
    resizable: true
  })

  win.on('closed', () => {
    win = null
  })

  win.loadURL(`file://${path.join(__dirname, HTML_FILE)}`)

  win.webContents.once('did-finish-load', () => {
    process.stdin.on('data', (data) => {
      try {
        const parsedData = JSON.parse(data)
        win.webContents.send('log', parsedData)
      } catch (e) {
        console.error(data)
      }
    })
  })
})
