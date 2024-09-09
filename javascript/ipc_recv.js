const { ipcMain }   = require('electron');
const cw            = require("./create_windows");
const pr            = require('./pan_requests');

function IpcMainHandle() {
    ipcMain.handle('get-user-info', (event) => {        
        pr.BaiDuGetUserInfo();
    });
    
    ipcMain.handle('auth-qrcode-request', (event, args) => {
        pr.BaiDuAuthQrcodeRequest();
    });
    
    ipcMain.handle('auth-status-request', (event, args) => {
        pr.BaiDuAuthStatusConfirm();
    })
    
    ipcMain.handle('get-file-list', (event, requestPath) => {
        pr.BaiDuGetFileList(requestPath);
    });
    
    ipcMain.handle('download-file', (event, fid) => {
        pr.DownloadFile(fid);
    });
    
    ipcMain.handle('create-auth-window', cw.createAuthWindow);
}

module.exports = {
    IpcMainHandle
}