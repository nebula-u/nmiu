const fs = require('fs');
const global = require('./global');
const icd = require('./icd');

function handleData(data) {
    fs.appendFile('./log.txt', "\n--------------------------------\n" + data, (err) => {
        // console.log("error:" + err);
    });
    const response = JSON.parse(data);
    if ("login-status-pw" == response.type) {
        if ("success" == response.result) {
            global.sessionId = response.newSessionid;
            var sessionidjson = "{\"session-id\" : \"" + response.newSessionid + "\"}";
            fs.writeFile('./userData/userData.json', sessionidjson, (err) => {
                console.log("error:" + err);
            });
            icd.ipcLoginResult.username = response.username;
            icd.ipcLoginResult.result = "success";
        }
        else if ("fail" == response.result) {
            icd.ipcLoginResult.result = "fail";
        }
        global.loginWindow.webContents.send("loginStatus", JSON.stringify(icd.ipcLoginResult));
        global.mainWindow.webContents.send("loginStatus", JSON.stringify(icd.ipcLoginResult));
    }

    if ("login-status-si" == response.type) {
        if ("success" == response.result) {
            global.sessionId = response.newSessionid;
            var sessionidjson = "{\"session-id\" : \"" + response.newSessionid + "\"}";
            fs.writeFile('./userData/userData.json', sessionidjson, (err) => {
                console.log("error:" + err);
            });
            icd.ipcLoginResult.username = response.username;
            icd.ipcLoginResult.result = "success";
        }
        else if ("fail" == response.result) {
            icd.ipcLoginResult.result = "fail";
        }
        global.mainWindow.webContents.send("loginStatus", JSON.stringify(icd.ipcLoginResult));
    }

    if ("pan-auth-status" == response.type) {
        
        if ("true" == response.result) {
            icd.ipcPanStatusResult.result = "true";
        }
        else if ("false" == response.result) {
            icd.ipcPanStatusResult.result = "false";
        }
        global.mainWindow.webContents.send("pan-auth-status", JSON.stringify(icd.ipcPanStatusResult));
    }
    if ("QRCode-url" == response.type) {
        if ("true" == response.result) {
            icd.ipcPanStatusResult.result = "true";
            icd.ipcPanStatusResult.QRCodeUrl = response.url;
        }
        else if ("false" == response.result) {
            icd.ipcPanStatusResult.result = "false";
            icd.ipcPanStatusResult.QRCodeUrl = "";
        }
        global.authWindow.webContents.send("qrcode-url", JSON.stringify(icd.ipcPanStatusResult));
    }
    if ("auth-login-status" == response.type){
        if("true" == response.result){
            icd.ipcPanStatusResult.PanAuthLoginResult = "true";
        }
        else
        {
            icd.ipcPanStatusResult.PanAuthLoginResult = "false";
        }
        global.authWindow.webContents.send("pan-auth-login-result", JSON.stringify(icd.ipcPanStatusResult));
    }
    if("file-list" == response.type){
        if("true" == response.result){
            icd.ipcFileList.result = "true",
            icd.ipcFileList.filelist = response.filelist;
        }
        else{
            icd.ipcFileList.result = "false";
        }
        global.mainWindow.webContents.send("file-list", JSON.stringify(icd.ipcFileList));
    }
    if("dlink-list" == response.type){
        if("true" == response.result){
            icd.ipcDLinkList.result = "true";
            icd.ipcDLinkList.dlinklist = response.dlinkList;
        }
        else{
            icd.ipcDLinkList.result = "false";
        }
        global.mainWindow.webContents.send("dlink-list", JSON.stringify(icd.ipcDLinkList));
        console.log(icd.ipcDLinkList);
    }
}

module.exports = {
    handleData
}