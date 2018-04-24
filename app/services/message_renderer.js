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
  this.selectedRatingValue = 0;

}

MessageRenderer.prototype.addMessageSendListener = function(id,event,socket){
  this.document.getElementById(id).addEventListener(event, ()=>{
    this.sendMessage(socket);
  });
};
MessageRenderer.prototype.addCreateRoomListener = function (id, event,socket) {
  const self = this;
  this.document.getElementById(id).addEventListener(event,()=>{
    this.createRoom(socket);
  });
  this.document.getElementById('modal-input-create').addEventListener(event,createRoomButtonHandler);
  function createRoomButtonHandler () {
    console.log('click createRoom Button');
    const modal = self.document.getElementById('myModal');
    const modal_input_rating = self.document.getElementById('rating-ul').childNodes;
    const ratingDiv = self.document.getElementById('modal-input-rating');
    const modalCreateRoomButton = self.document.getElementById('modal-input-create');
    modal.style.display = 'block';
    const roomNameInput = self.document.getElementById('modal-input-roomName');
    const ratingInput = self.document.getElementsByClassName('selected');
    const roomList = document.getElementById('room-area');
    const createRoomButton = roomList.lastElementChild;
    const room_item_text_p = document.createElement('p');
    const room_item_div = document.createElement('div');
    console.log(ratingInput.length);
    if(roomNameInput.value === ''){
      alert('방이름이 버어있습니다. 방이름은 필수입니다.');
      return;
    }
    if(ratingInput.length === 0){
      alert('레이팅선택은 필수입니다.');
      return;
    }
    const rating = ratingInput[1].innerText.split('점')[0];
    console.log("rating : "+rating);
    const message = {
      roomName : roomNameInput.value,
      rating : rating,
      token : socket.access_token
    };

    socket.emit('createRoom',message );
    room_item_text_p.innerText=roomNameInput.value;
    room_item_div.className = 'room-item';
    room_item_div.id='room';
    room_item_div.appendChild(room_item_text_p);
    roomList.insertBefore(room_item_div,createRoomButton);
    self.scrollToBottom('room-area');
    self.ratingDialogReset(modal, ratingDiv, modal_input_rating, self);
  };
};

MessageRenderer.prototype.ratingDialogReset = function (modal, ratingDiv, modal_input_rating, self) {
  modal.style.display = 'none';
  ratingDiv.classList.remove('open');
  modal_input_rating.forEach((node, index) => {
    if (index % 2 !== 0) {
      node.style.transform = 'none';
      node.childNodes[3].removeEventListener('click', self.ratingClickEventHandler);
      node.childNodes[1].classList.remove('selected');
      node.childNodes[3].classList.remove('selected');
    }
  });
};

MessageRenderer.prototype.createRoom = function (socket) {
  const self = this;
  const modal = this.document.getElementById('myModal');
  const modal_input_rating = this.document.getElementById('rating-ul').childNodes;
  const ratingDiv = this.document.getElementById('modal-input-rating');
  const modalCreateRoomButton = this.document.getElementById('modal-input-create');
  modal.style.display = 'block';
  this.document.addEventListener('keydown',(event)=>{
    const keyName = event.key;
    if(keyName === 'Escape' && modal !== null){
      self.ratingDialogReset(modal, ratingDiv, modal_input_rating, self);

    }
  });
  this.window.onclick = (event)=>{
    if (event.target === modal) {
      self.ratingDialogReset(modal, ratingDiv, modal_input_rating, self);
    }
  };

  setTimeout(function() { self.toggleOptions('rating-ul'); }, 100);

};

MessageRenderer.prototype.ratingClickEventHandler = function(item) {
  const string = item.srcElement.childNodes[0].data;
  self.selectedRatingValue = string.split('점')[0];
  console.log(string.split('점')[0]);
  toggleClass(item.srcElement.childNodes[0].parentNode.control,'selected');
  toggleClass(item.srcElement.childNodes[0].parentNode,'selected');
  function toggleClass(element, className) {

    if (element.classList) {
      console.log('element toggled : '+element.classList.toggle(className));
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
  }
};
MessageRenderer.prototype.toggleOptions = function(elementId) {
  const self = this;
  const angleStart = 360;
  const element = this.document.getElementById(elementId);
  const ratingDiv = this.document.getElementById('modal-input-rating');
  this.toggleClass('modal-input-rating','open');
  const liList = [];
  element.childNodes.forEach((item,index)=>{
    if(index%2){
      liList.push(item);
      item.childNodes[3].addEventListener('click',self.ratingClickEventHandler);
    }
  });
  const classes = ratingDiv.className.split(" ");
  const deg = -360/liList.length;
  for(let index = 0; index<liList.length; index++){
    const d = index*deg;
    classes.indexOf('open') ? this.rotate(liList[index],d) : this.rotate(liList[index],angleStart);
  }

};

MessageRenderer.prototype.toggleClass = function (elementId,className){
  const element = this.document.getElementById(elementId);

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
MessageRenderer.prototype.rotate = function (li,d) {
  li.style.webkitTransform = 'rotate('+d+'deg)';
  li.style.mozTransform    = 'rotate('+d+'deg)';
  li.style.msTransform     = 'rotate('+d+'deg)';
  li.style.oTransform      = 'rotate('+d+'deg)';
  li.style.transform       = 'rotate('+d+'deg)';
  d = -1*d;
  li.style.webkitTransform = 'rotate('+d+'deg)';
  li.style.mozTransform    = 'rotate('+d+'deg)';
  li.style.msTransform     = 'rotate('+d+'deg)';
  li.style.oTransform      = 'rotate('+d+'deg)';
  li.style.transform       = 'rotate('+d+'deg)';
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