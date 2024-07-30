const { remote, ipcRenderer} = require('electron')

const { createApp } = Vue;

const app = createApp({
    data(){
        return{

        }
    },

    methods: {
        closeWin(){
            const loginWin = remote.getCurrentWindow();
            loginWin.close();
        },

        login(){
            loginPassword()
        }
    }
});

app.mount("#app");

// 通过账号密码登录
async function loginPassword() {
    
    const idpw = {
        uid : document.getElementById('uid').value,
        password : document.getElementById('password').value
    }
    const result = await ipcRenderer.invoke('login-password', JSON.stringify(idpw));
}