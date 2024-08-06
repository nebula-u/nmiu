const { createApp } = Vue;
const { remote, ipcRenderer } = require('electron');

var isLoggedIn = false;
var isAuthed = false;

const app = createApp({
    data() {
        return {
            uname_: "登录",
            cloudStatus_: "未授权",
            file_list_: [],
            test_: {}
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

        getFileList(){
            getFileList();
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

function getFileList() {
    ipcRenderer.invoke("get-file-list");
}

ipcRenderer.on('loginStatus', (event, data) => {
    const response = JSON.parse(data);
    if ("success" == response.result) {
        vm.uname_ = response.username;
        isLoggedIn = true;
    }
    else {
        vm.uname_ = "登录";
    }
});

loginSessionid();

ipcRenderer.on('pan-auth-status', (event, data) => {
    const response = JSON.parse(data);
    if ("true" == response.result) {
        vm.cloudStatus_ = "已授权";
        isAuthed = true;
    }
    else {
        vm.cloudStatus_ = "未授权";
        isAuthed = false;
    }
});

ipcRenderer.on('file-list', (event, data) => {
    const response = JSON.parse(data);
    if("true" == response.result){
        console.log("文件列表获取成功");
        let file_info_list =[];
        for(var i = 0; i < response.filelist.length; i++){
            let file_info = {
                m_file_name : "",
                m_file_time : "",
                m_file_size : "",
                m_file_type : "",   // 0=文件夹；1=图片；2=音频；3=视频；4=压缩文件；
                                    // 5=脚本文件；6=源文件； 7=头文件；8=库文件
                                    // 9=应用程序；10=配置文件
                m_file_path : "",
                m_file_thumbs: "",
                m_file_icon: "",
            }
            file_info.m_file_name = response.filelist[i].filename;
            if("1" == response.filelist[i].isdir){
                file_info.m_file_type = "文件夹";
            }
            else
            {

            }
            file_info.m_file_time = (new Date((response.filelist[i].mtime) * 1000)).toISOString().slice(0, 19).replace('T', ' ');
            file_info.m_file_size = "10MB";
            file_info_list.push(file_info);
            console.log(file_info_list[i]);
            vm.test_ = file_info;
        }
        vm.file_list_ = file_info_list;
        console.log(vm.file_list_[2].target);
    }
    else{
        console.log("文件列表获取失败");
    }
})