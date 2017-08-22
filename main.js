const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 700, 
    height: 500, 
    resizable: false,
    icon: path.join(__dirname, 'src/assets/icons/png/icon-128x128.png'),
    titleBarStyle: 'hiddenInset',
    frame: false
  })

  // and load the index.html of the app.
  if(process.env.NODE_ENV === 'development'){

    mainWindow.loadURL('http://localhost:1234');
  }

  else{
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, './src/index.html'),
      protocol: 'file:',
      slashes: true
    }))
  }  

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)