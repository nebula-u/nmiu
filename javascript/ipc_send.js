const glb = require('./global');
const icd = require('./icd');
const iof = require('./io_function');

function SendAuthCode(data) {
    const response = JSON.parse(data);
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
    if(response.error){
        icd.ipcPanStatusResult.PanAuthLoginResult = "false";
    }
    else{
        icd.ipcPanStatusResult.PanAuthLoginResult = "true";
        glb.user_data.access_token = response.access_token;
        glb.user_data.refresh_token = response.refresh_token;
        iof.RefreshUserData(JSON.stringify(glb.user_data, null, 4));
    }
    glb.authWindow.webContents.send("pan-auth-result", JSON.stringify(icd.ipcPanStatusResult));
    glb.mainWindow.webContents.send("pan-auth-result", JSON.stringify(icd.ipcPanStatusResult));
}

function SendUserInfo(data) {
    const response = JSON.parse(data);
    if("0" == response.errno){
        icd.ipcPanUserInfo.headlink = response.avatar_url;
        icd.ipcPanUserInfo.username = response.netdisk_name;
        icd.ipcPanUserInfo.vip_type = response.vip_type;
        glb.mainWindow.webContents.send("pan-user-info", JSON.stringify(icd.ipcPanUserInfo));
    }
}

function SendFileList(data) {
    const response = JSON.parse(data);
    
    if("0" == response.errno){
        icd.ipcFileList.result = "true";
        for(var i = 0; i < response.list.length; i++){
            let item = {
                filename: "",
                isdir: "",
                size: "",
                path: "",
                mtime: "",
                category: "",
                fid: "",
            }
            item.filename = response.list[i].server_filename;
            item.isdir = response.list[i].isdir;
            item.size = response.list[i].size;
            item.path = response.list[i].path;
            item.mtime = response.list[i].server_mtime;
            item.category = response.list[i].category;
            item.fid = response.list[i].fs_id;
            
            icd.ipcFileList.filelist.push(item);
        }
        glb.mainWindow.webContents.send("file-list", JSON.stringify(icd.ipcFileList));
        icd.ipcFileList.filelist = [];
    }
}

function SendDlink(data) {
    const response = JSON.parse(data);
    if("succ" == response.errmsg){
        icd.ipcDLinkList.result = "true";
        icd.ipcDLinkList.access_token = glb.user_data.access_token;
        icd.ipcDLinkList.dlinklist = response.list;
        glb.mainWindow.webContents.send("dlink-list", JSON.stringify(icd.ipcDLinkList));
    }
}

module.exports = {
    SendAuthCode,
    SendAuthStatus,
    SendUserInfo,
    SendFileList,
    SendDlink
}