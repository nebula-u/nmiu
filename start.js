const { app } = require('electron');
const ic        = require('./javascript/ipc_recv');
const cw        = require("./javascript/create_windows");
const bsf       = require("./javascript/base_function");

// app.disableHardwareAcceleration();
app.on('ready', cw.createMainWindow);

bsf.init();

ic.IpcMainHandle();