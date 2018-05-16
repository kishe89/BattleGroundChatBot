'use strict';

/**
 * @module MemberListView
 * @param {document} document
 * @constructor
 * @description MemberListView object
 */
function MemberListView(document) {
  if(!(this instanceof MemberListView)){
    throw new TypeError('MemberListView must be created with new keyword');
  }
  this.view = document.getElementById('MemberListView');
}

MemberListView.prototype.getRow = function (position) {
  if(isNaN(position)){
    throw new TypeError('getRow Function\'s position parameter should be Number Format');
  }
  const index = position*1;
  return this.view.children[index];
};
MemberListView.prototype.addRow = function (Row,position) {
  if(position){
    if(isNaN(position)){
      throw new TypeError('addRow Function\'s position parameter should be Number Format');
    }
    const index = position*1;
    if(this.getCount() <= index){
      this.view.appendChild(Row);
      return Row;
    }
    const prenode = this.view.children[index];
    this.view.insertBefore(Row,prenode);
    return Row;
  }
  this.view.appendChild(Row);
  return Row;
};
MemberListView.prototype.getCount = function () {
  return this.view.childElementCount;
};

MemberListView.prototype.clearRow = function () {
  // member list
  let mems = this.view;
  mems.innerHTML = '';
};

module.exports = MemberListView;