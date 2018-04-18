'use strict';
(()=>{
  const electron = require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const url = 'http://192.168.0.22:3000';
  const nsp = '/bot';
  const boturl = url+nsp;
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
  function toggleClass(elementId,className){
    const element = document.getElementById(elementId);

    if (element.classList) {
      console.log('toggled : '+element.classList.toggle(className));
    } else {
      // For IE9
      const classes = element.className.split(" ");
      const i = classes.indexOf(className);

      if (i >= 0)
        classes.splice(i, 1);
      else
        classes.push(className);
      element.className = classes.join(" ");
    }
  };
  function rotate(li,d) {
    console.log(d);
    li.style.webkitTransform = 'rotate('+d+'deg)';
    li.style.mozTransform    = 'rotate('+d+'deg)';
    li.style.msTransform     = 'rotate('+d+'deg)';
    li.style.oTransform      = 'rotate('+d+'deg)';
    li.style.transform       = 'rotate('+d+'deg)';
    d = -1*d;
    console.log(d);
    li.style.webkitTransform = 'rotate('+d+'deg)';
    li.style.mozTransform    = 'rotate('+d+'deg)';
    li.style.msTransform     = 'rotate('+d+'deg)';
    li.style.oTransform      = 'rotate('+d+'deg)';
    li.style.transform       = 'rotate('+d+'deg)';
  };
  function toggleOptions(elementId) {
    const angleStart = 360;
    const element = document.getElementById(elementId);
    const ratingDiv = document.getElementById('modal-input-rating');
    toggleClass('modal-input-rating','open');
    const liList = [];
    element.childNodes.forEach((item,index)=>{
      if(index%2){
        liList.push(item);
      }
    });
    const classes = ratingDiv.className.split(" ");
    const deg = -360/liList.length;
    for(let index = 0; index<liList.length; index++){
      const d = index*deg;
      classes.indexOf('open') ? rotate(liList[index],d) : rotate(liList[index],angleStart);
    }
  };
  function createRoom() {
    const modal = document.getElementById('myModal');
    const modal_input_rating = document.getElementById('rating-ul').childNodes;
    modal.style.display = 'block';
    document.addEventListener('keydown',(event)=>{
      const keyName = event.key;
      if(keyName === 'Escape' && modal !== null){
        modal.style.display = 'none';
        toggleClass('modal-input-rating','open');
        modal_input_rating.forEach((node,index)=>{
          if(index%2 !== 0){
            node.style.transform = 'none';
          }
        });
      }
    });
    window.onclick = (event)=>{
      if (event.target === modal) {
        modal.style.display = "none";
        toggleClass('modal-input-rating','open');
        modal_input_rating.forEach((node,index)=>{
          if(index%2 !== 0){
            node.style.transform = 'none';

          }
        });
      }
    };
    setTimeout(function() { toggleOptions('rating-ul'); }, 100);
    const roomList = document.getElementById('room-area');
    const createRoomButton = roomList.lastElementChild;
    const room_item_text_p = document.createElement('p');
    const room_item_div = document.createElement('div');
    room_item_text_p.innerText='room';
    room_item_div.className = 'room-item';
    room_item_div.id='room';
    room_item_div.appendChild(room_item_text_p);
    roomList.insertBefore(room_item_div,createRoomButton);
    scrollToBottom('room-area');
  };
  function sendMessage(socket) {
    const message = document.getElementById('messageInput').value;
    renderMessage(message,MY_MESSAGE);
    socket.emit('message-public',{token:token,message:message});
  };

  function renderMessage(message,mode) {
    const messageList = document.getElementById('message-area');
    const message_row = document.createElement('div');
    const message_content = document.createElement('div');
    const profile_img = document.createElement('img');
    switch (mode){
      case MY_MESSAGE:
        message_row.className = 'my-message-block';
        message_content.innerText = message;
        message_content.className = 'my-message-block-message';
        profile_img.className = 'my-message-block-profile';
        break;
      case ANOTHER_MESSAGE:
        message_row.className = 'another-message-block';
        message_row.innerText = message;
        break;
    }
    message_row.appendChild(message_content);
    message_row.appendChild(profile_img);
    messageList.appendChild(message_row);
    scrollToBottom('message-area');
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
    const socket = require('socket.io-client')(url,{
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
      document.getElementById('messageSend').addEventListener('click', ()=>{
        sendMessage(socket);
      });
      document.getElementById('createRoom').addEventListener('click',()=>{
        createRoom();
      });
    });
  }
  function connectToBotSocket(id) {
    const socket = require('socket.io-client')(boturl,{
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
