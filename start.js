const { app, BrowserWindow, ipcMain } = require('electron')
const userData  = require('./userData/userData.json')
const handler   = require('./modules/dataHandler')
const global    = require('./modules/global')
const config    = require('./config.json')
const icd       = require('./modules/icd')
const net       = require('net');

/********************* 变量 *********************/
const serverHost = config['server-host'];
const serverPort = config['server-port'];
const client = new net.Socket();

client.connect(serverPort, serverHost, ()=>{
    console.log('connect to server: success');
    global.connectStatus = "true";
});
client.on('error', (err)=>{
    console.log('connect to server: fail ' + err);
    global.connectStatus = "false";
});
client.on('data', (data)=>{
    handler.handleData(data.toString());
})

function createLoginWindow() {
    let loginWin = new BrowserWindow({
        show: false,
        width: 400,
        height: 320,
        resizable: false,
        parent: global.mainWindow,
        modal: true,
        frame: false,
        webPreferences:{
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        }
    });
    loginWin.once('ready-to-show', () => {
        loginWin.show();
    });

    loginWin.loadFile('./static/html/login.html');
}

function createMainWindow() {
    let mainWin = new BrowserWindow({
        show: false,
        width: 1000,
        height: 700,
        frame: false,
        webPreferences:{
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        }
    });
    mainWin.once('ready-to-show', () => {
        mainWin.show();
    });
    mainWin.loadFile('./static/html/main.html');
    global.mainWindow = mainWin;
}
app.on('ready', createMainWindow);

ipcMain.handle('net-status-request', async (event, args) => {
    return global.connectStatus;
});

ipcMain.handle('login-sessionid', async(event, args) => {
    icd.clientToServer001.operation = 'login-sessionid';
    icd.clientToServer001.sessionId = userData['session-id'];
    client.write(JSON.stringify(icd.clientToServer001));
});

ipcMain.handle('login-password', async(event, args) => {
    console.log(args);
    const idpw = JSON.parse(args);
    icd.clientToServer001.operation = 'login-password';
    icd.clientToServer001.uid = idpw.uid;
    icd.clientToServer001.password = idpw.password;
    icd.clientToServer001.sessionId="";
    console.log(JSON.stringify(icd.clientToServer001))
    client.write(JSON.stringify(icd.clientToServer001));
});

ipcMain.handle('create-login-window', createLoginWindow);