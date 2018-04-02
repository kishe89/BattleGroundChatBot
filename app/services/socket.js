'use strict';
(()=>{
  const electron = require("electron");
  const ipcRenderer = electron.ipcRenderer;
  ipcRenderer.on('connect',(event,args)=>{
    console.log('receive event from ipcMain');
    console.log(args);
    connectToSocket(args);
  });
  function connectToSocket(id) {
    const socket = io.connect('http://192.168.0.18:3000',{
      transports: ['websocket'],
      query:id
    });

    //mode value
    const MY_MESSAGE = 1;
    const MY_WHISPER = 11;
    const ANOTHER_MESSAGE = 2;
    const ANOTHER_WHISPER = 22;
    const BOT_MESSAGE = 3;
    const BOT_WHISPER = 33;




    socket.on('message-public', function (data) {
      renderMessage(data.message,ANOTHER_MESSAGE);
    });

    function sendMessage(socket) {
      const message = document.getElementById("messageInput").value;
      renderMessage(message,MY_MESSAGE);
      socket.emit('message-public',message);
    }

    function renderMessage(message,mode) {
      const messageList = document.getElementById("message-area");
      const message_row = document.createElement("div");
      switch (mode){
        case MY_MESSAGE:
          message_row.className = "my-message-block";
          message_row.innerText = message;
          break;
        case ANOTHER_MESSAGE:
          message_row.className = "another-message-block";
          message_row.innerText = message;
          break;
      }

      messageList.appendChild(message_row);
      scrollToBottom();
    }
    function scrollToBottom() {
      const messageArea = document.getElementById("message-area");
      messageArea.scrollTop = messageArea.scrollHeight;
    }
    socket.on('connect',()=>{
      if(document.getElementById("messageSend")){
        document.getElementById("messageSend").addEventListener("click", function(){
          sendMessage(socket);
        });
      }
    });
  }
})();
