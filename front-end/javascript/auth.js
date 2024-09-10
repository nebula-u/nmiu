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
            CloseAuthWindow();
        },

        GetAuthLoginStatus() {
            ipcRenderer.invoke('auth-status-request');
        }
    }
});

const vm = app.mount("#app");


function CloseAuthWindow(){
    ipcRenderer.invoke("close-auth-window");
}


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
            CloseAuthWindow();
        }, 1000);
    }
})