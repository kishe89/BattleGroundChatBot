'use strict';

function MessageRenderer(document,window) {
  if(!(this instanceof MessageRenderer)){
    throw new TypeError('MessageRenderer must be created with new keyword');
  }
  this.document = document;
  this.window = window;
  this.messageType = require('../services/message_type');
  const MessageFactory = require('../services/MessageFactory');
  this.MessageFactory = new MessageFactory();
};

MessageRenderer.prototype.loadRoomList = function(id, socket) {
  const roomList = document.getElementById(id);
  const createRoomButton = roomList.lastElementChild;
  const joinRoomList = socket.user.JoinRoomList;

  for(let i=0; i < joinRoomList.length; i++){
    const room_item = createRoomItem(joinRoomList[i]);
    room_item.room_item_div.addEventListener('click', loadRoomInfo);
    roomList.insertBefore(room_item.room_item_div,createRoomButton);
  }

  function createRoomItem(room) {
    const room_item_text_p = document.createElement('p');
    const room_item_div = document.createElement('div');
    room_item_text_p.innerText = room.roomName;
    room_item_text_p.id = room._id;
    room_item_div.className = 'room-item';
    room_item_div.id='room';
    room_item_div.appendChild(room_item_text_p);
    return {
      room_item_text_p:room_item_text_p,
      room_item_div:room_item_div
    };
  }

  function loadRoomInfo(event) {
    const selectedRoom = event.srcElement;
    console.log(selectedRoom.id);
    socket.emit('message-get-in-room', {token:socket.access_token,room_id:selectedRoom.id});
  }
};

MessageRenderer.prototype.loadMessage = function(socket,messages){
  console.log(messages);
  for (let i = 0; i < messages.length; i++) {
    let msg = messages[i];
    socket.user._id === msg.author._id? this.renderMessage(msg, this.messageType.MY_MESSAGE,socket.args.picture):this.renderMessage(msg, this.messageType.ANOTHER_MESSAGE);

  }
};

MessageRenderer.prototype.addMessageSendListener = function(id,event,socket){
  this.document.getElementById(id).addEventListener(event, ()=>{
    this.sendMessage(socket);
  });
};

MessageRenderer.prototype.addPrivacyMessageSendListener = function(id, event, socket){
  this.document.getElementById(id).addEventListener(event, ()=>{
    this.sendPrivacyMessage(socket);
  });
};

MessageRenderer.prototype.addCreateRoomListener = function (id, event, socket) {
  const self = this;
  let CreateRoomModal = require('../services/CreateRoomModal');
  this.document.getElementById(id).addEventListener(event,()=>{
    const modal = new CreateRoomModal(self.document);
    modal.showModal();
    this.document.addEventListener('keydown',(event)=>{
      const keyName = event.key;
      if(keyName === 'Escape' && modal !== null){
        modal.dismissModal();
      }
    });
    this.window.onclick = (event)=>{
      if (event.target === modal.modal) {
        modal.dismissModal();
      }
    };
  });
  this.document.getElementById('modal-input-create').addEventListener(event,createRoomButtonHandler);
  function createRoomButtonHandler () {
    const modal = new CreateRoomModal(self.document);
    if(!modal.RoomNameIsValid()){
      alert('방이름이 버어있습니다. 방이름은 필수입니다.');
      return;
    }
    if(!modal.RatingIsSelected()) {
      alert('레이팅선택은 필수입니다.');
      return;
    }

    const message = {
      roomName : modal.getRoomName(),
      rating : modal.getRating(),
      token : socket.access_token
    };

    socket.emit('createRoom',message );
    modal.createRoom();
    self.scrollToBottom('room-area');
    modal.dismissModal();
  };
};

// 방 생성 성공 후 버튼에 클릭 이벤트 추가
MessageRenderer.prototype.addClickEventListener = function(result) {
  // 생성 된 방 button List element
  let rooms = document.getElementsByClassName('room-item');
  // 마지막으로 생성 된 방
  let lastRoom = rooms.item(rooms.length - 1);

  // 방 button click시에 click 된 방의 id 및 접속 유저 정보(access_token) 전송
  lastRoom.addEventListener('click', function() {
    console.log(selectedRoom.room_id);
  });
};

MessageRenderer.prototype.sendMessage = function(socket){
  const message = this.document.getElementById('messageInput').value;
  this.renderMessage(message,this.messageType.MY_MESSAGE,socket.user.nickName,socket.args.picture);
  socket.emit('message-public',{token:socket.access_token,message:message});
};

MessageRenderer.prototype.sendPrivacyMessage = function(socket){
  const textBox = this.document.getElementById('messageInput');

  // textbox 공백 체크 후에 메세지 전송 및 render 처리
  if(textBox.value !== '') {
    let msg = textBox.value;
    const targetRoom = socket.user.JoinRoomList[0];
    const createdMessage = {
      CreatedAt:new Date(Date.now()).toLocaleString(),
      author:{
        nickName:socket.user.nickName
      },
      textMessage:msg
    };
    const messageRow = this.renderMessage(createdMessage, this.messageType.MY_MESSAGE, socket.args.picture);
    // send message to server
    socket.emit('message-privacy', {
      room_id: targetRoom._id,
      token: socket.access_token,
      textMessage: msg,
      urlMessage: "test"
    },(message)=>{
      messageRow.message_info_sendStatus.innerText = 'OK';
      messageRow.message_info_sendStatus.className = 'my-message-block-info-sendStatus success';
      messageRow.message_info_timestamp.innerText = message.createdMessage.CreatedAt.toLocaleString();
    });

    textBox.value = '';
  }
};

MessageRenderer.prototype.addChangeMessageSendFailListener = function () {
  let sendStatus = this.document.getElementsByClassName('my-message-block-info-sendStatus sending');
  sendStatus[0].innerText = '!';
  sendStatus[0].className = 'my-message-block-info-sendStatus fail';
};

MessageRenderer.prototype.renderMessage = function (message, type, image) {
  const self = this;

    let messageRow = self.MessageFactory.createMessageRow(self.document);
    let myMessageRow = self.MessageFactory.createMyMessageRow(self.document);

    switch (type){
      case this.messageType.MY_MESSAGE:
        myMessageRow = self.MessageFactory.prepareMyMessageRow(myMessageRow,message,image);
        self.MessageFactory.myRender(myMessageRow);
        break;
      case this.messageType.ANOTHER_MESSAGE:
        myMessageRow = self.MessageFactory.prepareAnotherMessageRow(messageRow,message,image);
        self.MessageFactory.render(messageRow);
        break;
      case this.messageType.BOT_MESSAGE:
        myMessageRow = self.MessageFactory.prepareBotMessageRow(messageRow,message,image);
        self.MessageFactory.render(messageRow);
        break;
    }

    self.scrollToBottom('message-area');
    return myMessageRow;
};

// 신규 메세지 수신 후 자동으로 스크롤을 화면 제일 하단으로 내림.
MessageRenderer.prototype.scrollToBottom = function (elementId) {
  const messageArea = this.document.getElementById(elementId);
  messageArea.scrollTop = messageArea.scrollHeight;
};


MessageRenderer.prototype.scrollToTop = function (elementId) {
  const messageArea = this.document.getElementById(elementId);
  messageArea.scrollTop = messageArea.scrollHeight-messageArea.scrollHeight;
};

module.exports = MessageRenderer;