const { remote, ipcRenderer } = require('electron');
const { createApp } = Vue;

var getAuthLoginStatusTimer;

const app = createApp({
    data(){
        return{
            imageUrl_: "../img/QRCodeLoading.png",
        }
    },
    methods:{
        closeWin(){
            clearInterval(getAuthLoginStatusTimer);
            const authWin = remote.getCurrentWindow();
            authWin.close();
        },

        GetAuthLoginStatus() {
            ipcRenderer.invoke('auth-status-request');
        }
    }
});

const vm = app.mount("#app");

ipcRenderer.invoke('auth-qrcode-request');

ipcRenderer.on('qrcode-url', (event, data) => {
    const response = JSON.parse(data);
    if("true" == response.result)
    {
        vm.imageUrl_ = response.QRCodeUrl;
    }
    else
    {
        vm.imageUrl_ = "../img/QRCodeFail.png";
    }
});

// 收到授权结果
ipcRenderer.on('pan-auth-result', (event, data) => {
    const response = JSON.parse(data);
    if("true" == response.PanAuthLoginResult)
    {
        vm.imageUrl_ = "../img/QRAuthSuccess.svg";
        setTimeout(() => {
            remote.getCurrentWindow().close();
        }, 1000);
        setTimeout(() => {
            ipcRenderer.invoke('get-user-info');
        }, 3000);
    }
})