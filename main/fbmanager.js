'use strict';

function FBManager(app,axios,path,fs,FB) {
  if(!(this instanceof FBManager)){
    throw new TypeError('FBManager must be created with new keyword');
  }
  this.FB = FB;
  this.axios = axios;
  this.fs = fs;
  this.userProfilePath = path.join(app.getPath('userData'), 'profile.jpeg');
  this.options ={
    client_id: '197934537654217',
    scopes: "public_profile",
    redirect_uri: "https://www.facebook.com/connect/login_success.html"
  };
  this.facebookAuthURL = "https://www.facebook.com/v2.8/dialog/oauth?client_id=" + this.options.client_id + "&redirect_uri=" + this.options.redirect_uri + "&response_type=token,granted_scopes&scope=" + this.options.scopes + "&display=popup";
}

/***
 * facebook oauth dialog create function
 * @param parentWindow
 * @param BrowserWindow
 */
FBManager.prototype.login = function (parentWindow,BrowserWindow) {
  const self = this;
  let authwin = new BrowserWindow({ width: 450, height: 300, show: false,
    parent: parentWindow, modal: true, webPreferences: {nodeIntegration:false} });
  authwin.loadURL(this.facebookAuthURL);
  authwin.show();
  authwin.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
    const raw_code = /access_token=([^&]*)/.exec(newUrl) || null;
    const access_token = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
    const error = /\?error=(.+)$/.exec(newUrl);
    if(access_token) {
      self.FB.setAccessToken(access_token);
      self.FB.api('/me', { fields: ['id', 'name', 'picture.width(64).height(64)'] }, function (res) {
        console.log(res.name);
        console.log(res.id);
        console.log(res.picture.data.url);
        self.axios({
          method:'get',
          url:res.picture.data.url,
          responseType:'stream'
        }).then(function(response) {
          response.data.pipe(self.fs.createWriteStream(self.userProfilePath));
          const args = {
            id:res.id,
            name:res.name,
            picture:self.userProfilePath
          };
          authwin.close();
          parentWindow.webContents.send('login_success',args);
        }).catch((e)=>{
          console.log(e);
          authwin.close();
        });
      });
    }
  });
  authwin.on('enter-full-screen',(event)=>{
    console.log('win : enter-full-screen');
  });
  authwin.on('maximize',(event)=>{
    console.log('win : maximize');
  });
  authwin.on('enter-html-full-screen',(event)=>{
    console.log('win : enter-html-full-screen');
  });
  // Emitted when the window is closed.
  authwin.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    console.log('window closed');
    authwin = null;
  });
};


/***
 * facebook permission deny request
 * /DELETE /{user-id}/permissions
 * @type {string}
 */
FBManager.prototype.logout = function (userId) {
  const logoutPath = '/'+userId+'/permissions';
  this.FB.api(logoutPath,'delete',(response)=>{
    console.log(response);
  });
};



module.exports = FBManager;