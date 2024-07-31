const { remote, ipcRenderer } = require('electron');
const { createApp } = Vue;

const app = createApp({
    data(){
        return{
            imageUrl_: "",
        }
    },
    methods:{
        closeWin(){
            const authWin = remote.getCurrentWindow();
            authWin.close();
        }
    }
});

const vm = app.mount("#app");

ipcRenderer.invoke('auth-qrcode-request');

ipcRenderer.on('qrcode-url', (event, data) => {
    const response = JSON.parse(data);
    vm.imageUrl_ = response.QRCodeUrl;
})