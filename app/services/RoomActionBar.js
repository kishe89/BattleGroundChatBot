'use strict'

function RoomActionBar(document) {
  if(!(this instanceof RoomActionBar)){
    throw new TypeError('RoomActionBar must be created with new keyword');
  }
  const MemberListView = require('../services/MemberListView');
  this.ActionBar = document.getElementById('RoomActionBar');
  this.MemberListView = new MemberListView(document);
  this.RoomActionBarFoldButton = document.getElementById('RoomActionBar-fold-button');
  this.ActionLeaveRoomButton = document.getElementById('action-leave-room');
  this.EVENT = 'click';
};

RoomActionBar.prototype.InitializeActionBar = function (socket,MessageListView) {
  const self = this;
  this.removeAction().addEventListener(this.EVENT,this.ActionBarEventHandller);
  removeEventHandler().addEventListener(this.EVENT,ButtonClickEventHandler.bind(null,MessageListView));
  self.ActionLeaveRoomButton.addEventListener(self.EVENT, removeRoomInfo);
  function removeEventHandler() {
    self.RoomActionBarFoldButton.removeEventListener(self.EVENT,ButtonClickEventHandler);
    return self.RoomActionBarFoldButton;
  };
  function ButtonClickEventHandler(MessageListView,event) {
    const ClassManager = require('../services/cssHandler/ClassManager');
    const manager = new ClassManager();
    manager.toggleClass(self.ActionBar,'unfold');
    manager.toggleClass(event.srcElement,'unfold');
    manager.toggleClass(MessageListView.view,'unfold');
  };
  function removeRoomInfo(){
    const selectRoom = document.getElementsByClassName('room-item selected');
    console.log(socket);
    console.log(selectRoom[0].id);
    socket.emit('leaveRoom', {
      token:socket.access_token,
      room_id:selectRoom[0].id
    });
  };
};
RoomActionBar.prototype.removeAction = function () {
  this.ActionBar.removeEventListener(this.EVENT,this.ActionBarEventHandller);
  return this.ActionBar;
};
RoomActionBar.prototype.ActionBarEventHandller = function (event) {
  const view = event.srcElement;
};
module.exports = RoomActionBar;