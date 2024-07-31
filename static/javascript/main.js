const { createApp } = Vue;
const { remote, ipcRenderer } = require('electron');

var isLoggedIn = false;
var isAuthed = false;

const app = createApp({
    data() {
        return {
            uname_: "登录",
            cloudStatus_: "未授权"
        }
    },
    methods: {
        closeWin() {
            const mainWin = remote.getCurrentWindow();
            mainWin.close();
        },

        openUserInfo() {
            // 已登录，打开用户信息
            if (isLoggedIn) {

            }
            // 未登录，打开登录窗口
            else {
                createLoginWindow();
            }
        },

        openAuthInfo() {
            // 已授权，打授权信息
            if (isAuthed) {

            }
            // 未授权，打开授权窗口
            else {
                createAuthWindow();
            }
        },

        minWin() {
            const mainWin = remote.getCurrentWindow();
            mainWin.minimize();
        },

        maxWin() {
            const mainWin = remote.getCurrentWindow();
            if (mainWin.isMaximized()) {
                mainWin.unmaximize();
            } else {
                mainWin.maximize();
            }
        },

        closeWin() {
            const mainWin = remote.getCurrentWindow();
            mainWin.close();
        }
    }
});
const vm = app.mount("#app");

async function loginSessionid() {
    const result = await ipcRenderer.invoke('login-sessionid');
}

function createLoginWindow() {
    ipcRenderer.invoke('create-login-window');
}

function createAuthWindow() {
    ipcRenderer.invoke('create-auth-window');
}

ipcRenderer.on('loginStatus', (event, data) => {
    const response = JSON.parse(data);
    if ("success" == response.result) {
        vm.uname_ = response.username;
        isLoggedIn = true;
        ipcRenderer.invoke('auth-status-request');
    }
    else {
        vm.uname_ = "登录";
    }
})

loginSessionid();