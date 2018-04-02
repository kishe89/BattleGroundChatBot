const electron = require('electron');
const {app, net,BrowserWindow,ipcMain} = electron;
const path = require('path');
const url = require('url');
let win;
let chatWin;
function createLoginWindow() {
  const {width,height}= electron.screen.getPrimaryDisplay().workAreaSize;

  /**
   * @TODO mobile, desktop 별 modal 화면 크기 조정 별도 로직 필요
   */

  const webPreference = {
    affinity:true
  };

  // Create the browser window.
  win = new BrowserWindow({width: width/2, height: height/2,modal:true,webPreferences:webPreference});

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'login.html'),
    protocol: 'file:',
    slashes: true
  }));
  // Open the DevTools.
  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    console.log('window closed');
    win = null;
    app.quit();
  });
}
function createWindow () {

    const {width,height}= electron.screen.getPrimaryDisplay().workAreaSize;
    // Create the browser window.
    win = new BrowserWindow({width: width, height: height});

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Open the DevTools.
    win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        console.log('window closed');
        win = null;
    });
};

app.on('ready', createLoginWindow);
// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    console.log('All Closed');
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    console.log('activate');
    if (win === null) {
        createWindow()
    }
})

ipcMain.on('login',(event,args)=>{
  /**
   * @TODO validation logic
   */
  console.log(args);
  win.webContents.send('login_success',args);
});
ipcMain.on('changeView',(event,id)=>{
  console.log(id);
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  // Open the DevTools.
  win.webContents.openDevTools();
  win.webContents.on('did-finish-load',()=>{
    console.log(id);
    win.webContents.send('connect',id);
  });
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.