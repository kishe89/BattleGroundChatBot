/**
 * Created by kishe56@gmail.com on 2018. 6. 17.
 * Blog : https://kishe89.github.io
 * Github : https://github.com/kishe89
 */
'use strict';

function InviteDialog(document) {
  if(!(this instanceof InviteDialog)){
    throw new TypeError('InviteDialog must be created with new keyword');
  }
  this.view = document.getElementById('invite-user-modal');
  this.SHOW_STATUS = 'show';
};

InviteDialog.prototype.getView = function () {
  return this.view;
};
InviteDialog.prototype.showDialog = function () {
  const ClassManager = require('./cssHandler/ClassManager');
  const classManager = new ClassManager();

  classManager.toggleClass(this.view,this.SHOW_STATUS);
};

module.exports = InviteDialog;