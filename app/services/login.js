'use strict';
(()=>{
  const electron = require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const bodymovin = require('bodymovin');
  ipcRenderer.on('login_success',(event,args)=>{
    /**
     * Receive events from ipcMain
     *
     * @param {Object} event - Event Sender Object
     * @param {Object} args - Data Object
     */

    changeView(args);
  });
  const animation = bodymovin.loadAnimation({
    container: document.getElementById('lottie'), // Required
    path: './public/lottie/test.json', // Required
    renderer: 'svg', // Required
    loop: true, // Optional
    autoplay: true, // Optional
    name: "Hello World", // Name for future reference. Optional.
  });
  function changeView(id) {
    ipcRenderer.send('changeView',id);
  };
  if(document.getElementById("SignInButton")){
    document.getElementById("SignInButton").addEventListener("click", function(){
      /**
       * @TODO Oauth 로 전달받은 AppId 로 변경해야함 그전까진 임의값세팅
       */
      // const id = document.getElementById("nickInput").value;
      // console.log(id);
      ipcRenderer.send('login',{id:'1234'});
    });
  }
})();
