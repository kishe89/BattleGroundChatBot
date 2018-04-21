'use strict';

function Channel() {
  if(!(this instanceof Channel)){
    throw new TypeError('Channel must be created with new keyword');
  }
}


Channel.prototype.HOST = function () {
  return '';
}
Channel.prototype.DEVELOPMENT_HOST = ()=> {
  return 'http://192.168.0.3:3001';
};
Channel.prototype.BOT_NAMESPACE = ()=> {
  return '/bot';
};
Channel.prototype.BOT_CHANNEL = function(){
  return this.HOST()+this.BOT_NAMESPACE();
};
Channel.prototype.DEVELOPMENT_BOT_CHANNEL = function(){
  return this.DEVELOPMENT_HOST()+this.BOT_NAMESPACE();
};
module.exports = Channel;