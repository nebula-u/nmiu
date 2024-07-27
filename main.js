const {app, BrowserWindow} = require('electron')
const net = require('net')
const config = require('./config.json')

const serverHost = config['server-host'];
const serverPort = config['server-port'];
const client = new net.Socket();

let clientToServer001 = {
    operation : 0,      // 0=无效；1=请求登录状态；2=获取登录二维码；
    param1: "value1",
    param2: "value2",
    param3: "value3",
    param4: "value4",
}

client.connect(serverPort, serverHost, ()=>{
    clientToServer001.operation = 1;
    let jsonData = JSON.stringify(clientToServer001);
    client.write(jsonData);
})

client.on('data', (data) => {
    console.log(data)
})

function createLoginWindow(params) {
    let mainWin = new BrowserWindow({
        show: false,
        width: 320,
        height: 450,
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

app.on('ready', createLoginWindow);