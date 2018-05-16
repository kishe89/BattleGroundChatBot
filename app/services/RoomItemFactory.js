'use strict';

function RoomItemFactory(document) {
  if(!(this instanceof RoomItemFactory)){
    throw new TypeError('RoomItemFactory must be created with new keyword');
  }
  const ClassManager = require('../services/cssHandler/ClassManager');
  this.classManager = new ClassManager();
  this.RoomItemList = document.getElementById('room-area');
  this.STATUS = 'selected';
}

RoomItemFactory.prototype.createRoomItem = function (document) {

  return {
    room_item_text_p : document.createElement('p'),
    room_item_div : document.createElement('div')
  };
};
RoomItemFactory.prototype.prepareRoomItem = (roomItem,room)=>{
  roomItem.room_item_text_p.innerText = room.roomName;
  roomItem.room_item_div.className = 'room-item';
  roomItem.room_item_div.id=room._id;
  return roomItem;
};
RoomItemFactory.prototype.toggleSelected = function(roomItem){
  const agoSelectedItem = this.RoomItemList.querySelector('.room-item.selected');
  this.classManager.toggleClass(agoSelectedItem,this.STATUS);
  this.classManager.toggleClass(roomItem,this.STATUS);
};
RoomItemFactory.prototype.render = (roomItem)=>{
  roomItem.room_item_div.appendChild(roomItem.room_item_text_p);
  return roomItem;
};
RoomItemFactory.prototype.removeRoomItem = function(result){
  this.RoomItemList.querySelector('.room-item.selected').remove();
};

module.exports = RoomItemFactory;