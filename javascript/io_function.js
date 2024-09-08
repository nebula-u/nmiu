const fs    = require('fs');
const glb   = require('./global');

function LoadConfig() {
    fs.readFile("./user-data/ud.json", (err, data) => {
        if (err) {
            console.error("no user data");
            return;
        }
        glb.user_data = JSON.parse(data);
    })
}

function RefreshUserData(data) {
    if (!fs.existsSync("./user-data")) {        
        fs.mkdirSync("./user-data", { recursive: true });
    }
    fs.writeFile("./user-data/ud.json", data, (err) => {
        if(err){
            console.log(err);
        }
    })
}

module.exports = {
    LoadConfig,
    RefreshUserData
}