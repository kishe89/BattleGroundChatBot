'use strict';

function MessageListView(document) {
  if(!(this instanceof MessageListView)){
    throw new TypeError('MessageListView must be created with new keyword');
  }
  this.view = document.getElementById('message-area');
}

MessageListView.prototype.SwitchRoom = function () {
  this.RemoveAllMessages();
};
MessageListView.prototype.RemoveAllMessages = function () {
  while (this.view.firstChild) {
    this.view.removeChild(this.view.firstChild);
  }
};

module.exports = MessageListView;
