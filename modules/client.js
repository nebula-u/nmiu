const net = require('net')
const status = require('./status')

const client = new net.Socket();

async function ConnectToServer(port, host) {
    return new Promise((resolve, reject)=>{
        client.connect(port, host, ()=>{
            resolve(true);
        });
        client.on('error', (err)=>{
            reject(err);
        });
    });
}



async function SendRequest(requestData) {
    return new Promise((resolve, reject)=>{
        client.write(requestData);

        client.on('data', (data)=>{
            resolve(data.toString());
        });
        client.on('error', (err)=>{
            reject(err);
        });
        client.on('close', ()=>{
            console.log("connection closed!!!");
        });
    });
}

module.exports = {
    ConnectToServer,
    SendRequest,
    client
}