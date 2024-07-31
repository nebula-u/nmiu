const { remote, ipcRenderer} = require('electron')

const { createApp } = Vue;

const app = createApp({
    data(){
        return{
            loginResult_:""
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

const vm = app.mount("#app");

// 通过账号密码登录
async function loginPassword() {
    const idpw = {
        uid : document.getElementById('uid').value,
        password : document.getElementById('password').value
    }
    const result = await ipcRenderer.invoke('login-password', JSON.stringify(idpw));
}

ipcRenderer.on('loginStatus', (event, data) => {
    const response = JSON.parse(data);
    if ("success" == response.result) {
        vm.loginResult_ = "";
        const loginWin = remote.getCurrentWindow();
        loginWin.close();
    }
    else {
        vm.loginResult_ = "登录失败";
    }
})