'use strict';

function connectToBot(id, token, url, renderer) {
  const socket = require('socket.io-client')(url,{
    transports: ['websocket'],
    query:{
      id:id,
      nickName:'kjw',
      authOrg:'facebook',
      token:token
    }
  });
  socket.on('connect',()=>{
    console.log('bot socket connected');
  });
  // socket.on('error',(message)=>{
  //   console.log(message.statusCode);
  //   console.log(message);
  // });
  // socket.on('news-bot',(message)=>{
  //   console.log(message);
  //   renderer.renderMessage(message.message,renderer.messageType.ANOTHER_MESSAGE,socket.id);
  // });
  // socket.on('message-public', function (data) {
  //   renderer.renderMessage(data.message,renderer.messageType.ANOTHER_MESSAGE,socket.id);
  // });
  return socket;
};

module.exports = connectToBot;