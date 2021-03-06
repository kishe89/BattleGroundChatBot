'use strict';

function CreateRoomModal(document) {
  if(!(this instanceof CreateRoomModal)){
    throw new TypeError('CreateRoomModal must be created with new keyword');
  }
  const modal = document.getElementById('myModal');
  const rating_ul = document.getElementById('rating-ul');
  const modal_input_rating = rating_ul.childNodes;
  const ratingDiv = document.getElementById('modal-input-rating');

  const getter = {
    getRoomName:()=>{
      return document.getElementById('modal-input-roomName').value;
    },
    getRating:()=>{
      return document.getElementsByClassName('liselected')[1].innerText.split('점')[0] * 1;
    }
  };
  const showModal = this.showModal;
  const dismissModal = this.dismissModal;
  const toggleOptions = this.toggleOptions;
  const rotate = this.rotate;
  const ratingClickEventHandler = this.ratingClickEventHandler;
  const inputCreateButton = document.getElementById('modal-input-create');
  return {
    modal:modal,
    rating_ul:rating_ul,
    modal_input_rating:modal_input_rating,
    ratingDiv:ratingDiv,
    inputCreateButton: inputCreateButton,
    toggleOptions:toggleOptions,
    rotate:rotate,
    ratingClickEventHandler:ratingClickEventHandler,
    RatingIsSelected:()=>{
      const ratingInput = document.getElementsByClassName('liselected');
      return ratingInput.length !== 0;
    },
    getRoomName:getter.getRoomName,
    getRating:getter.getRating,
    RoomNameIsValid:()=>{
      const roomNameInput = document.getElementById('modal-input-roomName');
      return !(roomNameInput.value === '' || roomNameInput.value === undefined);
    },
    initRoomName:()=>{
      document.getElementById('modal-input-roomName').value= '';
    },
    showModal:showModal,
    dismissModal:dismissModal
  };
}

CreateRoomModal.prototype.showModal = function () {
  const self = this;
  this.modal.style.display = 'block';
  setTimeout(function() { self.toggleOptions(); }, 100);
};
CreateRoomModal.prototype.dismissModal = function () {
  const self = this;
  this.initRoomName();
  this.modal.style.display = 'none';
  this.ratingDiv.classList.remove('open');
  this.modal_input_rating.forEach((node, index) => {
    if (index % 2 !== 0) {
      node.style.transform = 'none';
      node.childNodes[3].removeEventListener('click', self.ratingClickEventHandler);
      node.childNodes[1].classList.remove('liselected');
      node.childNodes[3].classList.remove('liselected');
    }
  });
};
CreateRoomModal.prototype.ratingClickEventHandler = function(item) {
  const ClassManager = require('../services/cssHandler/ClassManager');
  const classManager = new ClassManager();
  const string = item.srcElement.childNodes[0].data;
  console.log(string.split('점')[0]);
  classManager.toggleClass(item.srcElement.childNodes[0].parentNode.control,'liselected');
  classManager.toggleClass(item.srcElement.childNodes[0].parentNode,'liselected');
};
CreateRoomModal.prototype.toggleOptions = function() {
  const self = this;
  const angleStart = 360;
  const element = this.rating_ul;
  const ratingDiv = this.ratingDiv;
  const ClassManager = require('../services/cssHandler/ClassManager');
  const classManager = new ClassManager();
  classManager.toggleClass(ratingDiv,'open');
  const liList = [];
  element.childNodes.forEach((item,index)=>{
    if(index%2){
      liList.push(item);
      item.childNodes[3].addEventListener('click',self.ratingClickEventHandler);
    }
  });
  const classes = ratingDiv.className.split(" ");
  const deg = -360/liList.length;
  for(let index = 0; index<liList.length; index++){
    const d = index*deg;
    classes.indexOf('open') ? this.rotate(liList[index],d) : this.rotate(liList[index],angleStart);
  }
};
CreateRoomModal.prototype.rotate = function (li,d) {
  li.style.webkitTransform = 'rotate('+d+'deg)';
  li.style.mozTransform    = 'rotate('+d+'deg)';
  li.style.msTransform     = 'rotate('+d+'deg)';
  li.style.oTransform      = 'rotate('+d+'deg)';
  li.style.transform       = 'rotate('+d+'deg)';
  d = -1*d;
  li.style.webkitTransform = 'rotate('+d+'deg)';
  li.style.mozTransform    = 'rotate('+d+'deg)';
  li.style.msTransform     = 'rotate('+d+'deg)';
  li.style.oTransform      = 'rotate('+d+'deg)';
  li.style.transform       = 'rotate('+d+'deg)';
};
module.exports = CreateRoomModal;