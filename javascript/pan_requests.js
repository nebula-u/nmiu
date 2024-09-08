const https = require('https');
const is    = require('./ipc_send')
const glb   = require("./global")


function BaiDuGetUserInfo() {
    url = "https://pan.baidu.com/rest/2.0/xpan/nas?access_token=" + glb.user_data.access_token + "&method=uinfo";
    https.get(url, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {            
            is.SendUserInfo(data);
        });
    }).on('error', (err) => {
        console.error('请求遇到问题:', err.message);
    });
}

function BaiDuAuthQrcodeRequest() {
    const url = "https://openapi.baidu.com/oauth/2.0/device/code?response_type=device_code&client_id=" + "rjpBaSYz5ED6dUuOhwuQ2LN1vC54DfWB" + "&scope=basic,netdisk";
    const options = {
        headers: {
            'User-Agent': 'pan.baidu.com'
        }
    }
    https.get(url, options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {            
            is.SendAuthCode(data);
        });
    }).on('error', (err) => {
        console.error('请求遇到问题:', err.message);
    });
}

function BaiDuAuthStatusConfirm() {
    const url = "https://openapi.baidu.com/oauth/2.0/token?grant_type=device_token&code=" + glb.device_code + "&client_id=" + "rjpBaSYz5ED6dUuOhwuQ2LN1vC54DfWB" + "&client_secret=" + "F7l7Ikn5UjDpHqzfasImUGwEUTGb0km6";
    const options = {
        headers: {
            'User-Agent': 'pan.baidu.com'
        }
    }
    https.get(url, options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            is.SendAuthStatus(data);
        });
    }).on('error', (err) => {
        console.error('请求遇到问题:', err.message);
    });
}

function BaiDuGetFileList(request_path) {
    url = "https://pan.baidu.com/rest/2.0/xpan/file?method=list&dir=" + request_path + "&order=time&start=0&limit=100&web=web&folder=0&access_token=" + glb.user_data.access_token + "&desc=1"
    const options = {
        headers: {
            'User-Agent': 'pan.baidu.com'
        }
    }
    https.get(url, options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            is.SendFileList(data);
        });
    }).on('error', (err) => {
        console.error('请求遇到问题:', err.message);
    });
}

function BaiDuGetFileDlink() {

}

module.exports = {
    BaiDuGetUserInfo,
    BaiDuAuthQrcodeRequest,
    BaiDuAuthStatusConfirm,
    BaiDuGetFileList,
    BaiDuGetFileDlink
}