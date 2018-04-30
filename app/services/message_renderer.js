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

}

MessageRenderer.prototype.addMessageSendListener = function(id,event,socket){
  this.document.getElementById(id).addEventListener(event, ()=>{
    this.sendMessage(socket);
  });
};
MessageRenderer.prototype.addCreateRoomListener = function (id, event,socket) {
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
    if(!modal.RatingIsSelected()){
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


MessageRenderer.prototype.sendMessage = function(socket){
  const message = this.document.getElementById('messageInput').value;
  this.renderMessage(message,this.messageType.MY_MESSAGE,socket.user.nickName,socket.args.picture);
  socket.emit('message-public',{token:socket.access_token,message:message});
};

MessageRenderer.prototype.renderMessage = function (message, type, name, image) {
  const self = this;
  new Promise((resolve)=>{
    let messageRow = self.MessageFactory.createMessageRow(self.document);
    switch (type){
      case this.messageType.MY_MESSAGE:
        messageRow = self.MessageFactory.prepareMyMessageRow(messageRow,name,message,image);
        break;
      case this.messageType.ANOTHER_MESSAGE:
        messageRow = self.MessageFactory.prepareAnotherMessageRow(messageRow,name,message,image);
        break;
      case this.messageType.BOT_MESSAGE:
        messageRow = self.MessageFactory.prepareBotMessageRow(messageRow,name,message,image);
        break;
    }
    self.MessageFactory.render(messageRow);
    self.scrollToBottom('message-area');
    resolve(message);
  });
};
MessageRenderer.prototype.scrollToBottom = function (elementId) {
  const messageArea = this.document.getElementById(elementId);
  messageArea.scrollTop = messageArea.scrollHeight;
};


MessageRenderer.prototype.scrollToTop = function (elementId) {
  const messageArea = this.document.getElementById(elementId);
  messageArea.scrollTop = messageArea.scrollHeight-messageArea.scrollHeight;
};

module.exports = MessageRenderer;