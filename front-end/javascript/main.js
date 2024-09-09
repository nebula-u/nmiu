const { createApp } = Vue;
const { remote, ipcRenderer } = require('electron');
const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');

var isLoggedIn = false;
var isAuthed = false;
var cur_selected_file_or_dir;
var notify_timeout;

var currentDirectory = "";
var backStack = [];
var forwardStack = [];

const icon = [
    '../icon/file-type/folder.svg',         // 0：文件夹
    '../icon/file-type/jpg.svg',            // 1：图片
    '../icon/file-type/mp3.svg',            // 2：音频
    '../icon/file-type/mp4.svg',            // 3：视频
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
    '../icon/file-type/file.svg',            // 14：文件
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
    '文件',             // 14：文件
]

const app = createApp({
    data() {
        return {
            uname_: "登录",
            cloudStatus_: "未授权",
            file_list_: [],
            currentDisplay_: "netdiskPage",
            download_file_list_: [],
            menuVisible_: false,
            menuX_: 0,
            menuY_: 0,
            selectedFile_: null,
            notification_message_: "",
            notification_visible_: false,
            notification_background_: "",
            netdisk_current_display_: "netdisk-filelist",
            headlink_: "../icon/cloud.svg",
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

        OpenFileOrDir_(path, fid, isdir) {
            this.currentDisplay_ = 'netdiskPage';
            if (isdir == "1") {
                backStack.push(currentDirectory);
                currentDirectory = path;
                forwardStack = [];
                GetFileList(path);
            }
            else {
                Notify("暂不支持打开文件，请下载后查看", "error");
                // this.netdisk_current_display_ = "netdisk-fileinfo";
                // GetDlink(fid);
            }
        },
        NetdiskDisplay() {
            this.currentDisplay_ = 'netdiskPage';
        },

        DownloadDisplay() {
            this.currentDisplay_ = 'downloadPage';
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

        GoBack() {
            if (backStack.length > 0) {
                forwardStack.push(currentDirectory);
                currentDirectory = backStack.pop();
                console.log(currentDirectory);
                
                GetFileList(currentDirectory);
            }
        },

        GoForward() {
            if (forwardStack.length > 0) {
                backStack.push(currentDirectory);
                currentDirectory = forwardStack.pop();
                GetFileList(currentDirectory);
            }
        },

        Refresh() {
            GetFileList(currentDirectory);
        },

        showContextMenu(event, index) {
            this.menuVisible_ = true;
            this.SelectFile_(index);

            // 获取初始点击位置
            let x = event.clientX;
            let y = event.clientY;

            // 获取窗口的宽度和高度
            const winWidth = window.innerWidth;
            const winHeight = window.innerHeight;

            // 如果菜单的右边缘超出了窗口的右边缘，将菜单的X坐标向左调整
            if (x + 150 > winWidth) {
                x = winWidth - 155;
            }

            // 如果菜单的下边缘超出了窗口的下边缘，将菜单的Y坐标向上调整
            if (y + 233 > winHeight) {
                y = winHeight - 238;
            }

            // 设置最终的菜单位置
            this.menuX_ = x;
            this.menuY_ = y;
        },

        // 隐藏右键菜单
        hideContextMenu() {
            this.menuVisible_ = false; // 隐藏菜单
        },

        SelectFile_(index) {
            this.selectedFile_ = index;
            cur_selected_file_or_dir = this.file_list_[index];
        },

        DownloadFile_() {
            if ("1" == cur_selected_file_or_dir.m_file_isdir) {
                Notify("暂不支持文件夹下载", "error");
            }
            else {
                GetDlink(cur_selected_file_or_dir.m_file_fid);
            }
        }
    },
    mounted() {
        // 在组件挂载时添加全局点击事件监听器，用于隐藏右键菜单
        document.addEventListener('click', this.hideContextMenu);
    },
});
const vm = app.mount("#app");

function createAuthWindow() {
    ipcRenderer.invoke('create-auth-window');
}

function GetFileList(requestPath) {
    ipcRenderer.invoke("get-file-list", requestPath);
    vm.file_list_ = [];
}

function GetDlink(fid) {
    ipcRenderer.invoke("download-file", fid);
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

// 接收网盘的授权状态
ipcRenderer.on('pan-auth-result', (event, data) => {
    const response = JSON.parse(data);
    if ("true" == response.PanAuthLoginResult) {
        Notify("网盘已授权", "success");
        ipcRenderer.invoke('get-user-info');
    }
    else {
        vm.cloudStatus_ = "未授权";
        isAuthed = false;
    }
});

ipcRenderer.on('pan-user-info', (event, data) => {
    const response = JSON.parse(data);
    vm.cloudStatus_ = response.username;
    vm.headlink_ = response.headlink;
    isAuthed = true;

    // 后续可在此加上判断
    currentDirectory = "/";
    GetFileList("/");
});

ipcRenderer.on('file-list', (event, data) => {
    const response = JSON.parse(data);
    console.log(response);
    
    if ('filelist' in response) {
        if ("true" == response.result) {
            let file_info_list = [];
            
            for (var i = 0; i < response.filelist.length; i++) {
                let file_info = {
                    m_file_name: "",
                    m_file_time: "",
                    m_file_size: "",
                    m_file_type: "",   // 0=文件夹；1=图片；2=音频；3=视频；4=压缩文件；
                    // 5=脚本文件；6=源文件；7=头文件；8=库文件
                    // 9=应用程序；10=配置文件；11=文本文件；12=WORD文件；13=PDF文件；14=文件
                    m_file_path: "",
                    m_file_thumbs: "",
                    m_file_icon: "",
                    m_file_fid: "",
                    m_file_isdir: "",
                }

                /*文件名处理*/
                file_info.m_file_name = response.filelist[i].filename;

                /*文件类型处理*/
                const extname = path.extname(file_info.m_file_name).toLowerCase();
                var t = 0;
                file_info.m_file_isdir = "0";
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
                    case '.rar':
                    case '7z':
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
                    default:
                        t = 14;
                        break;
                }
                if ("1" == response.filelist[i].isdir) {
                    t = 0;
                    file_info.m_file_isdir = "1";
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
            }
            vm.file_list_ = file_info_list;
            if(0 == vm.file_list_.length){
                Notify("这是个空文件夹", "normal");
            }
        }
    }
    else {
        vm.file_list_ = [];
    }
})

ipcRenderer.on('dlink-list', (event, data) => {
    const response = JSON.parse(data);
    if ("true" == response.result) {
        for (var i = 0; i < response.dlinklist.length; i++) {
            let dlink_info = {
                m_file_name: "",
                m_file_status: "",
                m_file_size: "",
                m_file_dlink: "",
                m_file_process: "",
            }
            dlink_info.m_file_name = response.dlinklist[i].filename;
            dlink_info.m_file_dlink = response.dlinklist[i].dlink + "&access_token=" + response.access_token;
            dlink_info.m_file_size = response.dlinklist[i].size;
            if (response.dlinklist[i].size < 1024) {
                dlink_info.m_file_size = response.dlinklist[i].size + ' B'
            }
            else if (response.dlinklist[i].size < 1024 * 1024) {
                dlink_info.m_file_size = (response.dlinklist[i].size / 1024).toFixed(2) + ' KB'
            }
            else if (response.dlinklist[i].size < 1024 * 1024 * 1024) {
                dlink_info.m_file_size = (response.dlinklist[i].size / (1024 * 1024)).toFixed(2) + ' MB'
            }
            else if (response.dlinklist[i].size < 1024 * 1024 * 1024 * 1024) {
                dlink_info.m_file_size = (response.dlinklist[i].size / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
            }

            dlink_info.m_file_status = '等待下载';
            dlink_info.m_file_process = "";
            vm.download_file_list_.push(dlink_info);
            console.log(vm.download_file_list_[vm.download_file_list_.length - 1]);
            download(vm.download_file_list_[vm.download_file_list_.length - 1]);
        }
    }
});

const options = {
    headers: {
        'User-Agent': 'pan.baidu.com'
    }
};

function handleRedirect(response, item) {
    if (response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        http.get(redirectUrl, options, (response) => {
            handleRedirect(response, item);
        }).on('error', (err) => {
            console.error(err);
        });
    } else {
        if (!fs.existsSync("./download")) {        
            fs.mkdirSync("./download", { recursive: true });
        }
        const file = fs.createWriteStream("./download/" + item.m_file_name);
        let downloadedBytes = 0;
        const totalBytes = parseInt(response.headers['content-length'], 10);
        response.pipe(file);
        response.on('data', (chunk) => {
            downloadedBytes += chunk.length;
            item.m_file_process = `${((downloadedBytes / totalBytes) * 100).toFixed(2)}%`;
        });

        file.on('finish', () => {
            item.m_file_status = "下载完成";
            file.close();
        });
    }
}

function download(item) {
    let message = item.m_file_name.length > 20 ? (item.m_file_name.substring(0, 10) + "...") : item.m_file_name;
    Notify("文件 " + message + " 已开始下载", "normal")
    item.m_file_status = "下载中";
    https.get(item.m_file_dlink, options, (response) => {
        handleRedirect(response, item);
    }).on('error', (err) => {
        console.error(err);
    });
}

function Notify(message, type) {
    vm.notification_message_ = "";
    vm.notification_visible_ = false;
    vm.notification_background_ = "";
    clearTimeout(notify_timeout);
    vm.notification_message_ = message;
    vm.notification_visible_ = true;
    if (type == "success") {
        vm.notification_background_ = "#4CAF50";
    }

    else if (type == "error") {
        vm.notification_background_ = "#f44336";
    }

    else if (type == "normal") {
        vm.notification_background_ = "#2196F3";
    }

    notify_timeout = setTimeout(() => {
        vm.notification_message_ = "";
        vm.notification_visible_ = false;
        vm.notification_background_ = "";

    }, 4000);
}

ipcRenderer.invoke('get-user-info');