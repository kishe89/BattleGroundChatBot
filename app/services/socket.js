'use strict';
(()=>{
  const electron = require("electron");
  const ipcRenderer = electron.ipcRenderer;

  //mode value
  const MY_MESSAGE = 1;
  const MY_WHISPER = 11;
  const ANOTHER_MESSAGE = 2;
  const ANOTHER_WHISPER = 22;
  const BOT_MESSAGE = 3;
  const BOT_WHISPER = 33;

  let token = undefined;
  ipcRenderer.on('connect',(event,args)=>{
    console.log('receive event from ipcMain');
    connectToDefaultSocket(args);
    connectToBotSocket(args);
  });
  function createRoom() {
    console.log('create room');
    ipcRenderer.send('createRoom_modal_view');
    const roomList = document.getElementById("room-area");
    const createRoomButton = roomList.lastElementChild;
    const room_item_text_p = document.createElement('p');
    const room_item_div = document.createElement('div');
    room_item_text_p.innerText="room";
    room_item_div.className = "room-item";
    room_item_div.id="room";
    room_item_div.appendChild(room_item_text_p);
    roomList.insertBefore(room_item_div,createRoomButton);
    scrollToBottom('room-area');
  };
  function sendMessage(socket) {
    const message = document.getElementById("messageInput").value;
    renderMessage(message,MY_MESSAGE);
    socket.emit('message-public',{token:token,message:message});
  };

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
    scrollToBottom("message-area");
  };
  function scrollToBottom(elementId) {
    const messageArea = document.getElementById(elementId);
    messageArea.scrollTop = messageArea.scrollHeight;
  };
  function scrollToTop(elementId) {
    const messageArea = document.getElementById(elementId);
    messageArea.scrollTop = messageArea.scrollHeight-messageArea.scrollHeight;
  };

  function connectToDefaultSocket(id) {
    const socket = require('socket.io-client')('http://192.168.0.2:3000',{
      transports: ['websocket'],
      query:{
        id:id.id,
        nickName:'kjw',
        authOrg:'facebook',
        token:token
      }
    });

    socket.on('error',(message)=>{
      console.log(message.statusCode);
      console.log(message);
    });
    socket.on('news',(message)=>{
      console.log(message);
    });
    socket.on('message-public', function (data) {
      renderMessage(data.message,ANOTHER_MESSAGE);
    });
    socket.on('createdToken',(acceess_token)=>{
      socket.access_token = acceess_token;
      token = acceess_token;
    });
    socket.on('connect',()=>{
      document.getElementById("messageSend").addEventListener("click", ()=>{
        sendMessage(socket);
      });
      document.getElementById("createRoom").addEventListener("click",()=>{
        createRoom();
      });
    });
  }
  function connectToBotSocket(id) {
    const socket = require('socket.io-client')('http://192.168.0.2:3000/bot',{
      transports: ['websocket'],
      query:{
        id:id,
        nickName:'kjw',
        authOrg:'facebook',
        token:token
      }
    });
    socket.on('connect',()=>{
      socket.on('error',(message)=>{
        console.log(message.statusCode);
        console.log(message);
      });
      socket.on('news-bot',(message)=>{
        console.log(message);
        renderMessage(message.message,ANOTHER_MESSAGE);
      });
      socket.on('message-public', function (data) {
        renderMessage(data.message,ANOTHER_MESSAGE);
      });
    });
  }
})();
