'use strict';

'use strict';

function RoomItemFactory() {
  if(!(this instanceof RoomItemFactory)){
    throw new TypeError('RoomItemFactory must be created with new keyword');
  }
  const ClassManager = require('../services/cssHandler/ClassManager');
  this.classManager = new ClassManager();
  this.STATUS = 'selected';
}

RoomItemFactory.prototype.createRoomItem = function (document) {
  this.RoomItemList = document.getElementById('room-area');
  return {
    room_item_text_p : document.createElement('p'),
    room_item_div : document.createElement('div')
  };
};
RoomItemFactory.prototype.prepareRoomItem = (roomItem,room)=>{
  roomItem.room_item_text_p.innerText = room.roomName;
  roomItem.room_item_text_p.id = room._id;
  roomItem.room_item_div.className = 'room-item';
  roomItem.room_item_div.id=room._id;
  return roomItem;
};
RoomItemFactory.prototype.toggleSelected = function(roomItem){
  this.classManager.toggleClass(roomItem,this.STATUS);
};
RoomItemFactory.prototype.render = (roomItem)=>{
  roomItem.room_item_div.appendChild(roomItem.room_item_text_p);
  return roomItem;
};


module.exports = RoomItemFactory;