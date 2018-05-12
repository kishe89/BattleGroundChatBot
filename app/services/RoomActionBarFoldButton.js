'use strict';

function RoomActionBarFoldButton(document) {
  if(!(this instanceof RoomActionBarFoldButton)){
    throw new TypeError('RoomActionBarFoldButton must be created with new keyword');
  }
  this.view = document.getElementById('RoomActionBar-fold-button');
  this.EVENT = 'click';
  this.Initialize();
}

RoomActionBarFoldButton.prototype.Initialize = function () {
  this.removeEventHandler().addEventListener(this.EVENT,this.ButtonClickEventHandler);
};

RoomActionBarFoldButton.prototype.removeEventHandler = function () {
  this.view.removeEventListener(this.EVENT,this.ButtonClickEventHandler);
  return this.view;
};
RoomActionBarFoldButton.prototype.ButtonClickEventHandler = function (event) {
  const ClassManager = require('../services/cssHandler/ClassManager');
  const manager = new ClassManager();
  manager.toggleClass(event.srcElement,'unfold');
};
module.exports = RoomActionBarFoldButton;