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
  if(agoSelectedItem){
    this.classManager.toggleClass(agoSelectedItem,this.STATUS);
  }
  if(roomItem){
    this.classManager.toggleClass(roomItem,this.STATUS);
  }
};
RoomItemFactory.prototype.render = (roomItem)=>{
  roomItem.room_item_div.appendChild(roomItem.room_item_text_p);
  return roomItem;
};
RoomItemFactory.prototype.removeRoomItem = function(result){
  this.RoomItemList.querySelector('.room-item.selected').remove();
};
RoomItemFactory.prototype.getRoomItemById = function (id) {
  const items = this.RoomItemList.querySelectorAll('.room-item');
  let item = undefined;
  Array.from(items).forEach((roomItem)=>{
    if(roomItem.id === id) {
      item = roomItem;
    }
  });
  console.log(item);
  return item;
};

module.exports = RoomItemFactory;