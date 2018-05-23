'use strict';

function MessageListView(document) {
  if(!(this instanceof MessageListView)){
    throw new TypeError('MessageListView must be created with new keyword');
  }
  const RoomItemFactory = require('../services/RoomItemFactory');
  this.view = document.getElementById('message-area');
  this.RoomItemFactory = new RoomItemFactory(document);
}

MessageListView.prototype.SwitchRoom = function (renderer,room) {
  this.RemoveAllMessages();
  const roomItem = renderer.RoomItemFactory.getRoomItemById(room._id);
  renderer.RoomItemFactory.toggleSelected(roomItem);
};
MessageListView.prototype.SwitchRoomAfterCreated = function (renderer,roomItem) {
  this.RemoveAllMessages();
  renderer.agoLoadMessageTargetRoom = roomItem.id;
  renderer.RoomItemFactory.toggleSelected(roomItem);
};
MessageListView.prototype.RemoveAllMessages = function () {
  while (this.view.firstChild) {
    this.view.removeChild(this.view.firstChild);
  }
};
MessageListView.prototype.scrollToBottom = function () {
  this.view.scrollTop = this.view.scrollHeight;
};
MessageListView.prototype.scrollToTop = function () {
  this.view.scrollTop = this.view.scrollHeight-this.view.scrollHeight;
};
module.exports = MessageListView;
