const net = require('net')
const status = require('./status')

const client = new net.Socket();

function connect(port, host) {
    client.connect(port, host, ()=>{
        status.connectStatus = true;
        console.log('connect success')
    })
    
    client.on('data', (data) => {
        status.isRequestLogin = false;
        const root = JSON.parse(data.toString('utf-8'));
        if("loginStatus" === root.type)
        {
            if("1" === root.result)
            {
                console.log("login success");
                console.log(root.newSessionid);
            }
            else if("0" === root.result)
            {
                console.log("relogin required");
            }
        }
    })
    
    client.on('error', (error) => {
        console.log(error);
    })
}

module.exports = {
    connect,
    client
}