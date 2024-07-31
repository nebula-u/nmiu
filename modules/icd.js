var clientToServer001 = {
    operation : "",      // 操作指令
    sessionId: "",
    uid: "",
    username: "",
    password: "",
}

var serverToclient001 = {
    type : "",
    result: "",
    username: "",
    newSessionid: "",
}

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
}

module.exports = {
    clientToServer001,
    serverToclient001,
    ipcLoginResult,
    ipcPanStatusResult
}