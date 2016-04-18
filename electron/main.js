var app = require('app'); // Module to control application life.
var BrowserWindow = require('browser-window'); // Module to create native browser window.
var open = require("open"); // Module to open external links in main broweser

// Report crashes to our server.
require('crash-reporter').start({
    productName: 'Buster',
    companyName: 'UTCS',
    submitURL: 'http://127.0.0.1'
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        titleBarStyle: 'hidden-inset',
        minWidth: 400,
        minHeight: 500
    });

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    mainWindow.webContents.on('new-window', function(event, url) {
        event.preventDefault();
        open(url);
    });

    mainWindow.on('app-command', function(e, cmd) {
        // Navigate the window back when the user hits their mouse back button
        if (cmd === 'browser-backward' && mainWindow.webContents.canGoBack()) {
            mainWindow.webContents.goBack();
        }
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);
