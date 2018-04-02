'use strict';
(()=>{
  const electron = require("electron");
  const ipcRenderer = electron.ipcRenderer;
  ipcRenderer.on('login_success',(event,args)=>{
    /**
     * Receive events from ipcMain
     *
     * @param {Object} event - Event Sender Object
     * @param {Object} args - Data Object
     */

    changeView(args);
  });

  function changeView(id) {
    ipcRenderer.send('changeView',id);
  };
  if(document.getElementById("loginButton")){
    document.getElementById("loginButton").addEventListener("click", function(){
      const id = document.getElementById("nickInput").value;
      console.log(id);
      ipcRenderer.send('login',{id:id});
    });
  }
})();
