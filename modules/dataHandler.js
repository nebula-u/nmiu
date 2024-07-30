const global = require('./global')

function handleData(data){
    global.mainWindow.webContents.send("response", data);
}

module.exports = {
    handleData
}