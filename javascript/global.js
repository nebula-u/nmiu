var loginStatus = false;
var connectStatus = false;
var isRequestLogin = false;
var sessionId = "";
var mainWindow;
var authWindow;
var device_code;
var user_data = {
    access_token:"",
    refresh_token:""
};

module.exports = {
    loginStatus,
    connectStatus,
    isRequestLogin,
    sessionId,
    mainWindow,
    authWindow,
    device_code,
    user_data,
}