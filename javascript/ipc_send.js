const glb = require('./global');
const icd = require('./icd')

function SendAuthCode(data) {
    const response = JSON.parse(data);
    console.log(response);
    if (response.qrcode_url) {
        icd.ipcPanStatusResult.result = "true";
        icd.ipcPanStatusResult.QRCodeUrl = response.qrcode_url;
        glb.device_code = response.device_code;
    }
    else {
        icd.ipcPanStatusResult.result = "false";
        icd.ipcPanStatusResult.QRCodeUrl = "";
    }

    glb.authWindow.webContents.send("qrcode-url", JSON.stringify(icd.ipcPanStatusResult));
}

function SendAuthStatus(data) {
    const response = JSON.parse(data);
    console.log(response);
    if(response.error){
        icd.ipcPanStatusResult.PanAuthLoginResult = "false";
    }
    else{
        icd.ipcPanStatusResult.PanAuthLoginResult = "true";
    }
    glb.authWindow.webContents.send("pan-auth-result", JSON.stringify(icd.ipcPanStatusResult));
    glb.mainWindow.webContents.send("pan-auth-result", JSON.stringify(icd.ipcPanStatusResult));
}

module.exports = {
    SendAuthCode,
    SendAuthStatus
}