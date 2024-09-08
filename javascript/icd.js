var ipcLoginResult = {
    result: "",
    uid: "",
    username: "",
    gender: "",
    area: "",
    headlink: "",
}

var ipcPanStatusResult = {
    result: "",
    username: "",
    headlink: "",
    QRCodeUrl: "",
    PanAuthLoginResult: "",
}

var ipcPanUserInfo = {
    username: "",
    headlink: "",
    vip_type: "",
}

var ipcFileList = {
    result: "",
    filelist: "",
}

var ipcDLinkList = {
    result: "",
    dlinklist: "",
}

module.exports = {
    ipcLoginResult,
    ipcPanStatusResult,
    ipcFileList,
    ipcDLinkList,
    ipcPanUserInfo
}