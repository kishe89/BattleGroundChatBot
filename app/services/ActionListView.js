/**
 * Created by kishe56@gmail.com on 2018. 6. 17.
 * Blog : https://kishe89.github.io
 * Github : https://github.com/kishe89
 */
'use strict';

function ActionListView(document) {
  if(!(this instanceof ActionListView)){
    throw new TypeError('ActionListView must be created with new keyword');
  }
  this.view = document.getElementById('action-area');
}

ActionListView.prototype.getView = function () {
  return this.view;
};
ActionListView.prototype.Initialize = function () {
  this.view.removeEventListener('click',listener);
  this.view.addEventListener('click',listener);
  function listener(e) {
    const inviteActionButtonId = 'action-invite-room';
    const leaveActionButtonId = 'action-leave-room';
    const connectVoiceActionButtonId = 'action-other1-room';
    const configActionButtonId = 'action-other2-room';
    switch (e.target.id){
      case inviteActionButtonId:
        alert('초대하기');
        break;
      case leaveActionButtonId:
        alert('나가기');
        break;
      case connectVoiceActionButtonId:
        alert('음성채팅');
        break;
      case configActionButtonId:
        alert('환경설정');
        break;
    }
  }
};


module.exports = ActionListView;