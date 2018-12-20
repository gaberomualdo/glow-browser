const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

const appMenu = electron.Menu;
const ipc = require('electron').ipcMain;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 800,'minWidth': 700,'minHeight': 700,webPreferences: {webSecurity: false}})

  // Remove Menu Bar
  mainWindow.setMenu(null);

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'offline.html'),
    protocol: 'file:',
    slashes: true
  }))

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
app.on('ready', function(){
  createWindow();

  const template = [
    {
      label: "Grace",
      submenu: [
        {
          label: "About Grace",
          selector: "orderFrontStandardAboutPanel:"
        },
        {
          type: "separator"
        },
        {
          label: "Preferences",
          accelerator: "CmdOrCtrl+,",
          click: function(){
            mainWindow.webContents.send('menuFunction', 'preferences');
          }
        },
        {
          type: "separator"
        },
        {
          label: "Reload Grace",
          accelerator: "CmdOrCtrl+Option+R",
          click: function(){
            mainWindow.reload();
          }
        },
        {
          label: "Open Dev Tools",
          accelerator: "CmdOrCtrl+Option+E",
          click: function(){
            mainWindow.toggleDevTools();
          }
        },
        {
          label: "Quit Grace",
          accelerator: "CmdOrCtrl+Q",
          click: function(){
            app.quit();
          }
        }
      ]
    },
    {
      label: "File",
      submenu: [
        {
          label: "New Tab",
          accelerator: "CmdOrCtrl+T",
          click: function(){
            mainWindow.webContents.send('menuFunction', 'newtab');
          }
        },
        {
          label: "Close Tab",
          accelerator: "CmdOrCtrl+W",
          click: function(){
            mainWindow.webContents.send('menuFunction', 'closetab');
          }
        },
        {
          label: "Reload Tab",
          accelerator: "CmdOrCtrl+R",
          click: function(){
            mainWindow.webContents.send('menuFunction', 'reload');
          }
        },
        {
          type: "separator"
        },
        {
          label: "Print",
          accelerator: "CmdOrCtrl+P",
          click: function(){
            mainWindow.webContents.send('menuFunction', 'print');
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        {
          label: "Undo",
          accelerator: "CmdOrCtrl+Z",
          selector: "undo:"
        },
        {
          label: "Redo",
          accelerator: "Shift+CmdOrCtrl+Z",
          selector: "redo:"
        },
        {
          type: "separator"
        },
        {
          label: "Cut",
          accelerator: "CmdOrCtrl+X",
          selector: "cut:"
        },
        {
          label: "Copy",
          accelerator: "CmdOrCtrl+C",
          selector: "copy:"
        },
        {
          label: "Paste",
          accelerator: "CmdOrCtrl+V",
          selector: "paste:"
        },
        {
          label: "Select All",
          accelerator: "CmdOrCtrl+A",
          selector: "selectAll:"
        }
      ]
    },
    {
      label: "Developer",
      submenu: [
        {
          label: "Open Dev Tools",
          accelerator: "CmdOrCtrl+Shift+C",
          click: function(){
            mainWindow.webContents.send('menuFunction', 'devtools');
          }
        }
      ]
    }/*,
    {
      label: "Sites",
      submenu: [
        {
          label: "browser.grace",
          click: function(){
            mainWindow.webContents.send('openSite', 'browser.grace');
          }
        }
      ]
    }*/
  ]

  const menu = appMenu.buildFromTemplate(template);
  appMenu.setApplicationMenu(menu);
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});
