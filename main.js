// imports work like this
// const electron = require('electron')
// everything is available through namespaces.
// in our case, we import specific namespaces that we need
const { app, BrowserWindow } = require('electron')

// this file should handle "infrastructure"
// react to events, create windows, etc


//simple entrypoint for our app
function createWindow () {
    // win is a BrowserWindow object (default?) like GTKWindow?
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // in the BrowserWindow, open index.html
    win.loadFile('index.html')
}

// create the window after app is ready - what's happening here?
app.whenReady().then(createWindow)

// close out when all windows are gone
// .on() is an event handler, the () => looks like a lambda?
app.on('window-all-closed', () => {
    app.quit()
})