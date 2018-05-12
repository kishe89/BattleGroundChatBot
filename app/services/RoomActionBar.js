'use strict'

function RoomActionBar(document) {
  if(!(this instanceof RoomActionBar)){
    throw new TypeError('RoomActionBar must be created with new keyword');
  }
  const MemberListView = require('../services/MemberListView');
  const RoomActionBarFoldButton = require('../services/RoomActionBarFoldButton');
  this.ActionBar = document.getElementById('RoomActionBar');
  this.MemberListView = new MemberListView(document);
  this.RoomActionBarFoldButton = new RoomActionBarFoldButton(document);
  this.EVENT = 'click';
};

RoomActionBar.prototype.InitializeActionBar = function () {
  this.removeAction().addEventListener(this.EVENT,this.ActionBarEventHandller)
};
RoomActionBar.prototype.removeAction = function () {
  this.ActionBar.removeEventListener(this.EVENT,this.ActionBarEventHandller);
  return this.ActionBar;
};
RoomActionBar.prototype.ActionBarEventHandller = function (event) {
  const view = event.srcElement;

};
module.exports = RoomActionBar;