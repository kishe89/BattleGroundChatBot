'use strict';

function MemberView(document,participant, img) {
  if(!(this instanceof MemberView)){
    throw new TypeError('MemberView must be created with new keyword');
  }
  this.view = document.createElement('div');
  this.ImageView = document.createElement('img');
  this.NickNameView = document.createElement('div');
  this.Initialize(participant,img);
}

MemberView.prototype.Initialize = function (participant,img) {
  return new Promise((resolve,reject)=>{
    if(!img){
      return reject(new Error('MemberView Initialize required img'))
    }
    this.view.className = 'MemberView';
    this.view.id = participant._id;
    this.NickNameView.className = 'MemberView-NickNameView';
    this.NickNameView.innerText = participant.nickName;
    this.ImageView.className = 'MemberView-ImageView';
    this.ImageView.style.background = "url('"+img+"')no-repeat right top";
    this.view.appendChild(this.ImageView);
    this.view.appendChild(this.NickNameView);
    return resolve();
  });
};
module.exports = MemberView;