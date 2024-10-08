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
let   recvData = "";

client.connect(serverPort, serverHost, ()=>{
    console.log('connect to server: success');
    global.connectStatus = "true";
});
client.on('error', (err)=>{
    console.log('connect to server: fail ' + err);
    global.connectStatus = "false";
});
client.on('data', (data)=>{
    recvData += data;
    let packets = recvData.split('#end')
    recvData = packets.pop();
    packets.forEach(package => {
        handler.handleData(package);
    })
});

function createAuthWindow() {
    let authWin = new BrowserWindow({
        show: false,
        width: 350,
        height: 450,
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
    authWin.once('ready-to-show', () => {
        authWin.show();
    });
    authWin.loadFile('./static/html/auth.html');
    global.authWindow = authWin;
}

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
    global.loginWindow = loginWin;
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
    const idpw = JSON.parse(args);
    icd.clientToServer001.operation = 'login-password';
    icd.clientToServer001.uid = idpw.uid;
    icd.clientToServer001.password = idpw.password;
    icd.clientToServer001.sessionId="";
    client.write(JSON.stringify(icd.clientToServer001));
});

ipcMain.handle('auth-qrcode-request', async(event, args) => {
    icd.clientToServer001.operation = 'auth-qrcode-request';
    icd.clientToServer001.password = '';
    icd.clientToServer001.sessionId = userData['session-id'];
    icd.clientToServer001.uid = '';
    icd.clientToServer001.username = '';
    client.write(JSON.stringify(icd.clientToServer001));
});

// 获取网盘授权状态
ipcMain.handle('auth-status-request', async(event, args) => {
    icd.clientToServer001.operation = 'auth-status-request';
    icd.clientToServer001.password = '';
    icd.clientToServer001.sessionId = global.sessionId;
    icd.clientToServer001.uid = '';
    icd.clientToServer001.username = '';
    client.write(JSON.stringify(icd.clientToServer001));
});

// 获取二维码登陆授权状态
ipcMain.handle('auth-login-status-resuest', async(event, args) => {
    icd.clientToServer001.operation = 'auth-login-status-resuest';
    icd.clientToServer001.password = '';
    icd.clientToServer001.sessionId = global.sessionId;
    icd.clientToServer001.uid = '';
    icd.clientToServer001.username = '';
    client.write(JSON.stringify(icd.clientToServer001));
})

ipcMain.handle('get-file-list', async(event, requestPath) => {
    icd.clientToServer001.operation = 'get-file-list';
    icd.clientToServer001.password = '';
    icd.clientToServer001.sessionId = global.sessionId;
    icd.clientToServer001.uid = '';
    icd.clientToServer001.username = '';
    icd.clientToServer001.path = requestPath;
    client.write(JSON.stringify(icd.clientToServer001));
});

ipcMain.handle('get-file-dlink', async(event, fid) => {
    icd.clientToServer001.operation = 'get-file-dlink';
    icd.clientToServer001.password = '';
    icd.clientToServer001.sessionId = global.sessionId;
    icd.clientToServer001.uid = '';
    icd.clientToServer001.username = '';
    icd.clientToServer001.path = "";
    icd.clientToServer001.fid = fid;
    client.write(JSON.stringify(icd.clientToServer001));
});

ipcMain.handle('create-login-window', createLoginWindow);
ipcMain.handle('create-auth-window', createAuthWindow);