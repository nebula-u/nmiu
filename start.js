const { app } = require('electron')

const handler   = require('./javascript/dataHandler')
const global    = require('./javascript/global')
const icd       = require('./javascript/icd')
const ic        = require('./javascript/ipc_recv')
const pr        = require('./javascript/pan_requests');
const cw        = require("./javascript/create_windows");

const userData  = require('./userData/userData.json')
const config    = require('./config.json')

app.on('ready', cw.createMainWindow);

ic.IpcMainHandle();