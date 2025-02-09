// const { app, BrowserWindow } = require('electron');
import { app, BrowserWindow } from 'electron';

function createWindow () {
  const win = new BrowserWindow({
    width: 2100,
    height: 1600,
    webPreferences: {
      nodeIntegration: true
    },
    icon: 'public/icons/Player.ico',
  })

  win.loadURL('http://localhost:5173')
  win.removeMenu() 
}

app.whenReady().then(createWindow)