const { createApp } = Vue;
const { remote, ipcRenderer } = require('electron');

var isLoggedIn = false;

const app = createApp({
    data(){
        return {
            uname_: "登录"
        }
    },
    methods:{
        closeWin(){
            const mainWin = remote.getCurrentWindow();
            mainWin.close();
        },

        openUserInfo(){
            // 已登录，打开用户信息
            console.log("AAAAA: " + isLoggedIn);
            if(isLoggedIn){

            }
            // 未登录，打开登录窗口
            else
            {
                createLoginWindow();
            }
        },

        minWin(){
            const mainWin = remote.getCurrentWindow();
            mainWin.minimize();
        },

        maxWin(){
            const mainWin = remote.getCurrentWindow();
            if (mainWin.isMaximized()) {
                mainWin.unmaximize();
              } else {
                mainWin.maximize();
              }
        },

        closeWin(){
            const mainWin = remote.getCurrentWindow();
            mainWin.close();
        }
    }
});
const vm = app.mount("#app");

async function loginSessionid() {
    const result = await ipcRenderer.invoke('login-sessionid');
}

function createLoginWindow(){
    ipcRenderer.invoke('create-login-window');
}

ipcRenderer.on('response', (event, data)=>{
    const response = JSON.parse(data);
    if("login-status" == response.type){
        if("success" == response.result){
            vm.uname_ = response.username;
            isLoggedIn = true;
        }
        else{
            vm.uname_ = "登录";
        }
    }
})

loginSessionid();