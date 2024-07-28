const {app, BrowserWindow} = require('electron')
const config = require('./config.json')
const userData = require('./userData/userData.json')
const cli = require('./modules/client')
const icd = require('./modules/icd')
const status = require('./modules/status')

/********************* 全局变量 *********************/
const serverHost = config['server-host'];
const serverPort = config['server-port'];
const sessionId = userData['session-id'];



function createLoginWindow(params) {
    let mainWin = new BrowserWindow({
        show: false,
        width: 1000,
        height: 700,
        webPreerences:{
            nodeIntegration:true,
            enableRemoteModule: true
        }
    });
    mainWin.once('ready-to-show', ()=>{
        mainWin.show();
    });

    mainWin.loadFile('./index.html');
}

function login() {
    // 先请求会话状态
    icd.clientToServer001.operation = "get_session_status";
    icd.clientToServer001.sessionId = sessionId;
    cli.client.write(JSON.stringify(icd.clientToServer001));
    status.isRequestLogin = true;
}

function start(){
    cli.connect(serverPort, serverHost);
    login();
}


app.on('ready', start);