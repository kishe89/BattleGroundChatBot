'use strict';

function MemberView(document,nickName, img) {
  if(!(this instanceof MemberView)){
    throw new TypeError('MemberView must be created with new keyword');
  }
  const className = 'MemberView Init';
  this.view = document.createElement('div');
  this.ImageView = document.createElement('img');
  this.NickNameView = document.createElement('div');
  this.Initialize(className,nickName,img);
}

MemberView.prototype.Initialize = function (className,nickName,img) {
  return new Promise((resolve,reject)=>{
    if(!img){
      return reject(new Error('MemberView Initialize required img'))
    }
    this.view.className = className;
    this.NickNameView.innerText = nickName;
    this.ImageView.style.background = "url('"+img+"')no-repeat right top";
    this.view.appendChild(this.NickNameView);
    this.view.appendChild(this.ImageView);
    return resolve();
  });
};
module.exports = MemberView;