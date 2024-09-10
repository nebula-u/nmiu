const { BrowserWindow } = require('electron')
const glb = require('./global');

function createAuthWindow() {
    let authWin = new BrowserWindow({
        show: false,
        width: 300,
        height: 400,
        resizable: false,
        parent: global.mainWindow,
        modal: true,
        frame: false,
        webPreferences:{
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            devTools: false,
        }
    });
    authWin.once('ready-to-show', () => {
        authWin.show();
    });
    authWin.loadFile('./front-end/html/auth.html');
    glb.authWindow = authWin;
}

function createMainWindow() {
    let mainWin = new BrowserWindow({
        show: false,
        width: 1000,
        height: 700,
        minWidth: 800,
        minHeight: 600,
        frame: false,
        webPreferences:{
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            devTools: false,
        }
    });
    mainWin.once('ready-to-show', () => {
        mainWin.show();
    });
    mainWin.loadFile('./front-end/html/main.html');
    glb.mainWindow = mainWin;
}

module.exports = {
    createAuthWindow,
    createMainWindow
}