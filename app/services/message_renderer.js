'use strict';

function MessageRenderer(document,window,locale) {
  if(!(this instanceof MessageRenderer)){
    throw new TypeError('MessageRenderer must be created with new keyword');
  }
  const MessageFactory = require('../services/MessageFactory');
  const RoomItemFactory = require('../services/RoomItemFactory');
  const RoomActionBar = require('../services/RoomActionBar');
  const MessageListView = require('../services/MessageListView');
  this.document = document;
  this.window = window;
  this.locale = locale;
  this.messageType = require('../services/message_type');
  this.MessageFactory = new MessageFactory(locale);
  this.RoomItemFactory = new RoomItemFactory(document);
  this.RoomActionBar = new RoomActionBar(document);
  this.MessageListView = new MessageListView(document);
  this.agoLoadMessageTargetRoom = '';
  this.agoLoadMessageIsExcuted = true;
}

MessageRenderer.prototype.loadRoomList = function(id, socket) {
  const roomList = document.getElementById(id);
  const joinRoomList = socket.user.JoinRoomList;
  const roomActionBar = this.RoomActionBar;
  roomActionBar.InitializeActionBar(socket,this.MessageListView);
  /**
   * @description This condition explains that there is no need to reload.
   */
  if(roomList.childElementCount === joinRoomList.length+2)return;

  console.log(socket);

  for(let i=0; i < joinRoomList.length; i++){
    const roomItem= this.renderRoomItem(roomList,joinRoomList[i]);
    roomItem.room_item_div.addEventListener('click', this.loadRoomInfo.bind(this,socket));
  }
};
MessageRenderer.prototype.loadRoomInfo = function (socket, event) {
  if(this.agoLoadMessageIsExcuted){
    this.agoLoadMessageIsExcuted = false;
  }else{
    return;
  }
  const selectedRoom = event.srcElement.parentNode;
  socket.emit('message-get-in-room', {token:socket.access_token,room_id:selectedRoom.id});
};

MessageRenderer.prototype.loadMessageCancelablePromise = function(socket,room){
  let isExcuted = false;
  let reject = undefined;
  const promise = new Promise((resolve,PromiseReject)=>{
    reject = ()=>{
      isExcuted = true;
      return PromiseReject('cancle');
    };
    setTimeout(()=>{
      if(room.messages.length === 0){
        return PromiseReject({MessageRenderer:this,roomId:room._id});
      }
      if(this.agoLoadMessageTargetRoom === room.messages[0].roomId) {
        return PromiseReject({MessageRenderer:this,roomId:room.messages[0].roomId});
      }
      console.log('load Message : '+this.agoLoadMessageTargetRoom+'||'+room.messages[0].roomId);

      for (let i = 0; i < room.messages.length; i++) {
        let msg = room.messages[i];
        socket.user._id === msg.author._id? this.renderMessage(msg, this.messageType.MY_MESSAGE,socket.args.picture):this.renderMessage(msg, this.messageType.ANOTHER_MESSAGE);
      }

      return resolve({MessageRenderer:this,roomId:room._id});
    },50);
  });
  return {isExcuted,reject,promise};
};


MessageRenderer.prototype.loadParticipant = function (socket, room) {
  const MemberView = require('../services/MemberView');
  return new Promise((resolve,reject)=>{
    if(!room){
      return reject(new Error('loadParticipant need room parameter'));
    }
    this.RoomActionBar.MemberListView.clearRow();
    room.Participant.forEach((participant)=>{
      const memberView = new MemberView(this.document,participant,socket.args.picture);
      this.RoomActionBar.MemberListView.addRow(memberView.view);
    });
    return resolve(true);
  });
};
MessageRenderer.prototype.addPrivacyMessageSendListener = function(id, event, socket){
  this.document.getElementById(id).addEventListener(event, ()=>{
    this.sendPrivacyMessage(socket);
  });
};
MessageRenderer.prototype.addCreateRoomListener = function (id, event, socket) {
  const CreateRoomButton = require('../services/CreateRoomButton');
  const createRoomButton = new CreateRoomButton(this.document,this.window,socket);
  createRoomButton.addClickEventListener();
};
MessageRenderer.prototype.addClickEventListener = function(socket) {
  // 생성 된 방 button List element
  const rooms = document.getElementsByClassName('room-item');
  // 마지막으로 생성 된 방
  const lastRoom = rooms.item(rooms.length - 1);
  // 방 button click시에 click 된 방의 id 및 접속 유저 정보(access_token) 전송
  lastRoom.addEventListener('click', this.loadRoomInfo.bind(this,socket));
};

MessageRenderer.prototype.sendPrivacyMessage = function(socket){
  const textBox = this.document.getElementById('messageInput');
  const moment = require('moment');
  const utcOffset = moment().utcOffset();
  moment.locale(this.locale);
  // textbox 공백 체크 후에 메세지 전송 및 render 처리
  if(textBox.value !== '') {
    let msg = textBox.value;
    const targetRoom = this.agoLoadMessageTargetRoom;
    const createdMessage = {
      CreatedAt:new Date(Date.now()).toUTCString(),
      author:{
        nickName:socket.user.nickName
      },
      textMessage:msg
    };
    const messageRow = this.renderMessage(createdMessage, this.messageType.MY_MESSAGE, socket.args.picture);
    // send message to server
    socket.emit('message-privacy', {
      room_id: targetRoom,
      token: socket.access_token,
      textMessage: msg,
      urlMessage: "test"
    },(message)=>{
      messageRow.message_info_sendStatus.innerText = 'OK';
      messageRow.message_info_sendStatus.className = 'my-message-block-info-sendStatus success';
      messageRow.message_info_timestamp.innerText = moment.utc(message.CreatedAt).utcOffset(utcOffset).format("LLL");
    });

    textBox.value = '';
  }
};

MessageRenderer.prototype.addChangeMessageSendFailListener = function () {
  let sendStatus = this.document.getElementsByClassName('my-message-block-info-sendStatus sending');
  sendStatus[0].innerText = '!';
  sendStatus[0].className = 'my-message-block-info-sendStatus fail';
};

MessageRenderer.prototype.renderRoomItem = function (roomList,room) {
  const createRoomButton = roomList.lastElementChild;
  const room_item = this.RoomItemFactory.createRoomItem(this.document);
  this.RoomItemFactory.prepareRoomItem(room_item,room);
  this.RoomItemFactory.render(room_item);
  roomList.insertBefore(room_item.room_item_div,createRoomButton);
  return room_item;
};

MessageRenderer.prototype.addLeaveRoomListener = function (result, socket) {
  const ClassManager = require('../services/cssHandler/ClassManager');
  const manager = new ClassManager();
  const roomList = this.RoomItemFactory.RoomItemList.children;
  const selectRoom = Array.prototype.find.call(roomList, (roomItem, i) => {
    const removeRoomIndex = Array.prototype.findIndex.call(roomList, (roomItem) => {
      return roomItem.id === result._id;
    });
    return roomList.length - 2 > removeRoomIndex ? i === removeRoomIndex + 1 : i === removeRoomIndex - 1;
  });

  this.RoomItemFactory.removeRoomItem(result);
  socket.emit('message-get-in-room', {token:socket.access_token,room_id:selectRoom.id});
  manager.toggleClass(selectRoom, 'selected');
};

MessageRenderer.prototype.agoLoadMessageIsResolve = function(result){
  console.log(result.roomId+'\'s message was reloaded');
  result.MessageRenderer.agoLoadMessageTargetRoom = result.roomId;
  result.MessageRenderer.agoLoadMessageIsExcuted = true;
};
MessageRenderer.prototype.agoLoadMessageIsReject = function(result){
  console.log(result.roomId+'\'s message reload request rejected');
  result.MessageRenderer.agoLoadMessageTargetRoom = result.roomId;
  result.MessageRenderer.agoLoadMessageIsExcuted = true;
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

    this.MessageListView.scrollToBottom();
    return myMessageRow;
};


module.exports = MessageRenderer;