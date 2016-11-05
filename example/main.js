const path = require('path')

const quark = require('../dist/quark.bundle.js')('example:main')
const { app, BrowserWindow } = require('electron')

const createAndLaunchWindow = () => {
  let win = new BrowserWindow({
    width: 300,
    height: 300
  })

  win.on('closed', () => {
    win = null
  })

  win.loadURL(path.join('file://', __dirname, 'index.html'))
}

app.on('ready', () => {
  setInterval(() => quark(`Hello from Electron main process #${process.pid}`), 1000)

  createAndLaunchWindow()
  createAndLaunchWindow()
})
