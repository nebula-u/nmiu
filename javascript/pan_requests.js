const https = require('https');
const is    = require('./ipc_send')
const glb = require("./global")


function BaiDuGetUserInfo() {

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

function BaiDuGetFileList() {

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