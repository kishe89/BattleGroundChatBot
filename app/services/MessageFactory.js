'use strict';

function MessageFactory() {
  if(!(this instanceof MessageFactory)){
    throw new TypeError('MessageFactory must be created with new keyword');
  }
  this.moment = require('moment');
  this.utcOffset = this.moment().utcOffset();
  this.moment.locale('ko');
}

MessageFactory.prototype.createMessageRow = function (document) {
  return {
    messageList : document.getElementById('message-area'),
    message_info_row : document.createElement('div'),
    message_info_nick : document.createElement('div'),
    message_info_timestamp : document.createElement('div'),
    message_row : document.createElement('div'),
    message_content : document.createElement('div'),
    profile_img : document.createElement('img')
  };
};
MessageFactory.prototype.createMyMessageRow = function (document) {
  return {
    messageList : document.getElementById('message-area'),
    message_info_row : document.createElement('div'),
    message_info_nick : document.createElement('div'),
    message_info_timestamp : document.createElement('div'),
    message_info_sendStatus : document.createElement('div'),
    message_row : document.createElement('div'),
    message_content : document.createElement('div'),
    profile_img : document.createElement('img')
  };
};

MessageFactory.prototype.prepareMyMessageRow = function(messageRow,message,image){
  messageRow.message_row.id = message._id;
  messageRow.message_row.className = 'my-message-block';
  messageRow.message_info_row.className = 'my-message-block-info';
  messageRow.message_info_nick.innerText = message.author.nickName;
  messageRow.message_info_nick.className = 'my-message-block-info-nick';

  //messageRow.message_info_timestamp.innerText = message.CreatedAt.toLocaleString();
  messageRow.message_info_timestamp.innerText = this.moment.utc(message.CreatedAt).utcOffset(this.utcOffset).format("LLL");
  messageRow.message_info_timestamp.className = 'my-message-block-info-timestamp';
  messageRow.message_info_sendStatus.innerText = ' ...';
  messageRow.message_info_sendStatus.className = 'my-message-block-info-sendStatus sending';
  messageRow.message_content.innerText = message.textMessage;
  messageRow.message_content.className = 'my-message-block-message';
  messageRow.profile_img.className = 'my-message-block-profile';
  messageRow.profile_img.style.background = "url('"+image+"')no-repeat right top";
  return messageRow;
};
MessageFactory.prototype.prepareAnotherMessageRow = function(messageRow,message,image){
  messageRow.message_row.id = message._id;
  messageRow.message_row.className = 'another-message-block';
  messageRow.message_info_row.className = 'another-message-block-info';
  messageRow.message_info_nick.innerText = message.author.nickName;
  messageRow.message_info_nick.className = 'another-message-block-info-nick';
  messageRow.message_info_timestamp.innerText = this.moment.utc(message.CreatedAt).utcOffset(this.utcOffset).format("LLL");
  messageRow.message_info_timestamp.className = 'another-message-block-info-timestamp';
  messageRow.message_content.innerText = message.textMessage;
  messageRow.message_content.className = 'another-message-block-message';
  messageRow.profile_img.className = 'another-message-block-profile';
  return messageRow;
};
MessageFactory.prototype.prepareBotMessageRow = function(messageRow,name,message,image){
  messageRow.message_row.className = 'another-message-block';
  messageRow.message_info_row.className = 'another-message-block-info';
  messageRow.message_info_nick.innerText = message.author.nickName;
  messageRow.message_info_nick.className = 'another-message-block-info-nick';
  messageRow.message_info_timestamp.innerText = this.moment.utc(message.CreatedAt).utcOffset(this.utcOffset).format("LLL");
  messageRow.message_info_timestamp.className = 'another-message-block-info-timestamp';
  messageRow.message_content.innerText = message.textMessage;
  messageRow.message_content.className = 'another-message-block-message';
  messageRow.profile_img.className = 'another-message-block-profile';
  return messageRow;
};

MessageFactory.prototype.render = (messageRow)=>{
  messageRow.message_info_row.appendChild(messageRow.message_info_nick);
  messageRow.message_info_row.appendChild(messageRow.message_info_timestamp);
  messageRow.message_row.appendChild(messageRow.message_info_row);
  messageRow.message_row.appendChild(messageRow.message_content);
  messageRow.message_row.appendChild(messageRow.profile_img);
  messageRow.messageList.appendChild(messageRow.message_row);
};

MessageFactory.prototype.myRender = (messageRow)=>{
  messageRow.message_info_row.appendChild(messageRow.message_info_nick);
  messageRow.message_info_row.appendChild(messageRow.message_info_timestamp);
  messageRow.message_info_row.appendChild(messageRow.message_info_sendStatus);
  messageRow.message_row.appendChild(messageRow.message_info_row);
  messageRow.message_row.appendChild(messageRow.message_content);
  messageRow.message_row.appendChild(messageRow.profile_img);
  messageRow.messageList.appendChild(messageRow.message_row);
};

module.exports = MessageFactory;