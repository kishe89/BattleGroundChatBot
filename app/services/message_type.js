'use strict';

function MessageType() {
  if(!(this instanceof MessageType)){
    throw new TypeError('MessageType must be created with new keyword');
  }
};

MessageType.prototype.MY_MESSAGE = 1;
MessageType.prototype.MY_WHISPER = 11;
MessageType.prototype.ANOTHER_MESSAGE = 2;
MessageType.prototype.ANOTHER_WHISPER = 22;
MessageType.prototype.BOT_MESSAGE = 3;
MessageType.prototype.BOT_WHISPER = 33;

module.exports = new MessageType();