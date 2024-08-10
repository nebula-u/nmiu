const { createApp } = Vue;
const { remote, ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');

var isLoggedIn = false;
var isAuthed = false;

var currentDirectory = "";
var backStack = [];
var forwardStack = [];

const icon = [
    '../icon/file-type/folder.svg',         // 0：文件夹
    '../icon/file-type/jpg.svg',            // 1：图片
    '../icon/file-type/mp3.svg',            // 2：音频
    '../icon/file-type/mp4.svg',         // 3：视频
    '../icon/file-type/zip.svg',            // 4：压缩文件
    '../icon/file-type/file.svg',           // 5：脚本文件
    '../icon/file-type/file.svg',            // 6：源文件
    '../icon/file-type/file.svg',            // 7：头文件
    '../icon/file-type/file.svg',            // 8：库文件
    '../icon/file-type/file.svg',            // 9：应用程序
    '../icon/file-type/file.svg',            // 10：配置文件
    '../icon/file-type/txt.svg',            // 11：文本文件
    '../icon/file-type/doc.svg',            // 12：word文件
    '../icon/file-type/pdf.svg',            // 13：pdf文件
]

const type = [
    '文件夹',         // 0：文件夹
    '图像',            // 1：图片
    '音乐',            // 2：音频
    '视频',         // 3：视频
    '压缩文件',            // 4：压缩文件
    '脚本文件',           // 5：脚本文件
    '源文件',            // 6：源文件
    '头文件',            // 7：头文件
    '库文件',            // 8：库文件
    '应用程序',            // 9：应用程序
    '配置文件',            // 10：配置文件
    '文本文件',            // 11：文本文件
    '文档',            // 12：word文件
    '文档',            // 13：pdf文件
]

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

        OpenUserInfo_() {
            // 已登录，打开用户信息
            if (isLoggedIn) {

            }
            // 未登录，打开登录窗口
            else {
                createLoginWindow();
            }
        },

        OpenAuthInfo_() {
            // 已授权，打授权信息
            if (isAuthed) {

            }
            // 未授权，打开授权窗口
            else {
                createAuthWindow();
            }
        },

        GetFileList_(requestPath) {
            GetFileList(requestPath);
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
        },

        goBack(){
            console.log(currentDirectory);
            if(backStack.length>0){
                forwardStack.push(currentDirectory);
                currentDirectory = backStack.pop();
                GetFileList(currentDirectory);
            }
        },

        goForward(){
            console.log(currentDirectory);
            if(forwardStack.length>0){
                backStack.push(currentDirectory);
                currentDirectory = forwardStack.pop();
                GetFileList(currentDirectory);
            }
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

function GetFileList(requestPath) {
    ipcRenderer.invoke("get-file-list", requestPath);
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
    if ("true" == response.result) {
        console.log("文件列表获取成功");
        let file_info_list = [];
        for (var i = 0; i < response.filelist.length; i++) {
            let file_info = {
                m_file_name: "",
                m_file_time: "",
                m_file_size: "",
                m_file_type: "",   // 0=文件夹；1=图片；2=音频；3=视频；4=压缩文件；
                // 5=脚本文件；6=源文件；7=头文件；8=库文件
                // 9=应用程序；10=配置文件；11=文本文件；12=WORD文件；13=PDF文件
                m_file_path: "",
                m_file_thumbs: "",
                m_file_icon: "",
                m_file_fid: "",
            }

            /*文件名处理*/
            file_info.m_file_name = response.filelist[i].filename;

            /*文件类型处理*/
            const extname = path.extname(file_info.m_file_name).toLowerCase();
            var t = 0;
            switch (extname) {
                case '.jpg':
                case '.jpeg':
                case '.png':
                    t = 1;
                    break;
                case '.mp3':
                    t = 2;
                    break;
                case '.mp4':
                case '.mkv':
                    t = 3;
                    break;
                case '.zip':
                    t = 4;
                    break;
                case '.bat':
                    t = 5;
                    break;
                case '.cpp':
                    t = 6;
                    break;
                case '.h':
                    t = 7;
                    break;
                case '.lib':
                    t = 8;
                    break;
                case '.exe':
                    t = 9;
                    break;
                case '.ini':
                    t = 10;
                    break;
                case '.txt':
                    t = 11;
                    break;
                case '.docx':
                    t = 12;
                    break;
                case '.pdf':
                    t = 13;
                    break;
            }
            if ("1" == response.filelist[i].isdir) {
                t = 0;
            }

            file_info.m_file_type = type[t];

            /*文件时间处理*/
            file_info.m_file_time = (new Date((response.filelist[i].mtime) * 1000)).toISOString().slice(0, 19).replace('T', ' ');

            /*文件大小处理*/
            if (response.filelist[i].size < 1024) {
                file_info.m_file_size = response.filelist[i].size + ' B'
            }
            else if (response.filelist[i].size < 1024 * 1024) {
                file_info.m_file_size = (response.filelist[i].size / 1024).toFixed(2) + ' KB'
            }
            else if (response.filelist[i].size < 1024 * 1024 * 1024) {
                file_info.m_file_size = (response.filelist[i].size / (1024 * 1024)).toFixed(2) + ' MB'
            }
            else if (response.filelist[i].size < 1024 * 1024 * 1024 * 1024) {
                file_info.m_file_size = (response.filelist[i].size / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
            }
            if (1 == response.filelist[i].isdir) {
                file_info.m_file_size = "";
            }

            /*文件图标处理*/
            file_info.m_file_icon = icon[t];

            /*文件路径处理*/
            file_info.m_file_path = response.filelist[i].path;

            /*文件fid*/
            file_info.m_file_fid = response.filelist[i].fid;

            file_info_list.push(file_info);
            vm.test_ = file_info;
        }
        vm.file_list_ = file_info_list;
        console.log(vm.file_list_);
    }
    else {
        console.log("文件列表获取失败");
    }
})