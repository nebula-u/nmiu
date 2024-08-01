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
        getAuthLoginStatusTimer = setInterval(getAuthLoginStatus, 6000);
    }
    else
    {
        vm.imageUrl_ = "../img/QRCodeFail.png";
    }
    console.log(response);
})

function getAuthLoginStatus() {
    ipcRenderer.invoke('auth-login-status-resuest');
}

ipcRenderer.on('pan-auth-login-result', (event, data) => {
    const response = JSON.parse(data);
    if("true" == response.PanAuthLoginResult)
    {
        vm.imageUrl_ = "../img/QRAuthSuccess.svg";
        clearInterval(getAuthLoginStatusTimer);
    }
})