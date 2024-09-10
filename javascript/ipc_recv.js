const { ipcMain }   = require('electron');
const cw            = require("./create_windows");
const pr            = require('./pan_requests');
const glb = require("./global");

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

    ipcMain.handle("close-main-window", () => {
        glb.mainWindow.close();
    });

    ipcMain.handle("close-auth-window", () => {
        glb.authWindow.close();
    });

    ipcMain.handle("max-orunmax-main-window", () => {
        if(glb.mainWindow.isMaximized()){
            glb.mainWindow.unmaximize();
        }
        else{
            glb.mainWindow.maximize();
        }
    });

    ipcMain.handle("minimize-main-window", () => {
        glb.mainWindow.minimize();
    })
}

module.exports = {
    IpcMainHandle
}