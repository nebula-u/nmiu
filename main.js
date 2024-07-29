const { app, BrowserWindow } = require('electron')
const config = require('./config.json')
const userData = require('./userData/userData.json')
const cli = require('./modules/client')
const icd = require('./modules/icd')
const status = require('./modules/status')

/********************* 全局变量 *********************/
const serverHost = config['server-host'];
const serverPort = config['server-port'];
const sessionId = userData['session-id'];



function createLoginWindow() {
    let loginWin = new BrowserWindow({
        show: false,
        width: 320,
        height: 450,
        frame: false,
        webPreerences: {
            nodeIntegration: true,
            enableRemoteModule: true
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
        webPreerences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    mainWin.once('ready-to-show', () => {
        mainWin.show();
    });

    mainWin.loadFile('./main.html');
}

async function login() {
    // 先请求会话状态
    icd.clientToServer001.operation = "get_session_status";
    icd.clientToServer001.sessionId = sessionId;
    const response = await cli.SendRequest(JSON.stringify(icd.clientToServer001));
    const res = JSON.parse(response);
    if ("loginStatus" === res.type) {
        if ("1" === res.result) {
            console.log("login success");
            console.log(res.newSessionid);
            createMainWindow();
        }
        else if ("0" === res.result) {
            console.log("relogin required");
            createLoginWindow();
        }
    }
}

async function start() {
    try {
        status.connectStatus = await cli.ConnectToServer(serverPort, serverHost);
        console.log('connection success!!');
    }
    catch (error) {
        console.log("reqest error: " + error)
    }
    login();
}


app.on('ready', start);