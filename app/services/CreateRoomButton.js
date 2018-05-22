'use strict';

function CreateRoomButton(document,window,socket,renderer) {
  if(!(this instanceof CreateRoomButton)){
    throw new TypeError('CreateRoomButton must be created with new keyword');
  }
  this.view = document.getElementById('createRoom');
  this.document = document;
  this.window = window;
  this.socket = socket;
  this.CreateRoomModal = require('../services/CreateRoomModal');
  this.renderer = renderer;
  this.modal = new this.CreateRoomModal(this.document);
  this.InputCreateButtonHandler = this.addInputCreateButtonHandler.bind(this,this.modal,this.socket);
}

CreateRoomButton.prototype.addClickEventListener = function () {
  this.view.addEventListener('click',this.CreateModal.bind(this));
};
CreateRoomButton.prototype.CreateModal = function () {
  this.modal.showModal();
  this.addDocumentClickListener(this.modal);
  this.addWindowClickListener(this.modal);
  this.addInputCreateButtonClickListener(this.modal)
};

CreateRoomButton.prototype.addDocumentClickListener = function (modal) {
  this.document.addEventListener('keydown',(event)=>{
    const keyName = event.key;
    if(keyName === 'Escape' && modal !== null){
      modal.dismissModal();
    }
  });
};
CreateRoomButton.prototype.addWindowClickListener = function (modal) {
  this.window.onclick = (event)=>{
    if (event.target === modal.modal) {
      modal.dismissModal();
    }
  };
};
CreateRoomButton.prototype.addInputCreateButtonClickListener = function (modal) {
  modal.inputCreateButton.removeEventListener('click',this.InputCreateButtonHandler);
  modal.inputCreateButton.addEventListener('click',this.InputCreateButtonHandler);
};
CreateRoomButton.prototype.addInputCreateButtonHandler = function (modal,socket) {
  console.log(modal);
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
  this.renderer.scrollToBottom('room-area');
  modal.dismissModal();
};

module.exports = CreateRoomButton;