'use strict';

function MessageRenderer(document,window) {
  if(!(this instanceof MessageRenderer)){
    throw new TypeError('MessageRenderer must be created with new keyword');
  }
  this.document = document;
  this.window = window;
  this.messageType = require('../services/message_type');
};

MessageRenderer.prototype.addMessageSendListener = function(id,event,socket){
  this.document.getElementById(id).addEventListener(event, ()=>{
    this.sendMessage(socket);
  });
};
MessageRenderer.prototype.addCreateRoomListener = function (id, event) {
  this.document.getElementById(id).addEventListener(event,()=>{
    this.createRoom();
  });
};
MessageRenderer.prototype.createRoom = function () {
  const self = this;
  const modal = this.document.getElementById('myModal');
  const modal_input_rating = this.document.getElementById('rating-ul').childNodes;
  const ratingDiv = this.document.getElementById('modal-input-rating');
  modal.style.display = 'block';
  this.document.addEventListener('keydown',(event)=>{
    const keyName = event.key;
    if(keyName === 'Escape' && modal !== null){
      modal.style.display = 'none';
      ratingDiv.classList.remove('open');
      modal_input_rating.forEach((node,index)=>{
        if(index%2 !== 0){
          node.style.transform = 'none';
        }
      });
    }
  });
  this.window.onclick = (event)=>{
    if (event.target === modal) {
      modal.style.display = "none";
      ratingDiv.classList.remove('open');
      modal_input_rating.forEach((node,index)=>{
        if(index%2 !== 0){
          node.style.transform = 'none';

        }
      });
    }
  };
  setTimeout(function() { self.toggleOptions('rating-ul'); }, 100);
  const roomList = document.getElementById('room-area');
  const createRoomButton = roomList.lastElementChild;
  const room_item_text_p = document.createElement('p');
  const room_item_div = document.createElement('div');
  room_item_text_p.innerText='room';
  room_item_div.className = 'room-item';
  room_item_div.id='room';
  room_item_div.appendChild(room_item_text_p);
  roomList.insertBefore(room_item_div,createRoomButton);
  this.scrollToBottom('room-area');
};

MessageRenderer.prototype.toggleOptions = function(elementId) {
  const angleStart = 360;
  const element = this.document.getElementById(elementId);
  const ratingDiv = this.document.getElementById('modal-input-rating');
  this.toggleClass('modal-input-rating','open');
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
  const messageList = this.document.getElementById('message-area');
  const message_info_row = this.document.createElement('div');
  const message_info_nick = this.document.createElement('div');
  const message_info_timestamp = this.document.createElement('div');
  const message_row = this.document.createElement('div');
  const message_content = this.document.createElement('div');
  const profile_img = this.document.createElement('img');
  switch (type){
    case this.messageType.MY_MESSAGE:
      message_row.className = 'my-message-block';
      message_info_row.className = 'my-message-block-info';
      message_info_nick.innerText = name;
      message_info_nick.className = 'my-message-block-info-nick';
      message_info_timestamp.innerText = new Date(Date.now()).toLocaleString();
      message_info_timestamp.className = 'my-message-block-info-timestamp';
      message_content.innerText = message;
      message_content.className = 'my-message-block-message';
      profile_img.className = 'my-message-block-profile';
      profile_img.style.background = "url('"+image+"')no-repeat right top";
      break;
    case this.messageType.ANOTHER_MESSAGE:
      message_row.className = 'another-message-block';
      message_info_row.className = 'another-message-block-info';
      message_info_nick.innerText = name;
      message_info_nick.className = 'another-message-block-info-nick';
      message_info_timestamp.innerText = new Date(Date.now()).toLocaleString();
      message_info_timestamp.className = 'another-message-block-info-timestamp';
      message_content.innerText = message;
      message_content.className = 'another-message-block-message';
      profile_img.className = 'another-message-block-profile';
      break;
    case this.messageType.BOT_MESSAGE:
      message_row.className = 'another-message-block';
      message_info_row.className = 'another-message-block-info';
      message_info_nick.innerText = name;
      message_info_nick.className = 'another-message-block-info-nick';
      message_info_timestamp.innerText = new Date(Date.now()).toLocaleString();
      message_info_timestamp.className = 'another-message-block-info-timestamp';
      message_content.innerText = message;
      message_content.className = 'another-message-block-message';
      profile_img.className = 'another-message-block-profile';
  }
  message_info_row.appendChild(message_info_nick);
  message_info_row.appendChild(message_info_timestamp);
  message_row.appendChild(message_info_row);
  message_row.appendChild(message_content);
  message_row.appendChild(profile_img);
  messageList.appendChild(message_row);
  this.scrollToBottom('message-area');
};
MessageRenderer.prototype.scrollToBottom = function (elementId) {
  const messageArea = this.document.getElementById(elementId);
  messageArea.scrollTop = messageArea.scrollHeight;
}
MessageRenderer.prototype.scrollToTop = function (elementId) {
  const messageArea = this.document.getElementById(elementId);
  messageArea.scrollTop = messageArea.scrollHeight-messageArea.scrollHeight;
};

module.exports = MessageRenderer;