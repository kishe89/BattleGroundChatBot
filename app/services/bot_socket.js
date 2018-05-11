'use strict';

function connectToBot(args, token, url, renderer) {
  const socket = require('socket.io-client')(url,{
    transports: ['websocket'],
    query:{
      id:args.id,
      nickName:args.name,
      authOrg:'facebook',
      token:token
    }
  });
  socket.on('connect',()=>{
    console.log('bot socket connected');
  });
  socket.on('error',(message)=>{
    console.log(message.statusCode);
    console.log(message);
  });
  socket.on('news-bot',(message)=>{
    console.log(message);
    //renderer.renderMessage(message.createdMessage,renderer.messageType.ANOTHER_MESSAGE,socket.id);
  });
  socket.on('message-public', function (message) {
    console.log(message);
    //renderer.renderMessage(message.createdMessage,renderer.messageType.ANOTHER_MESSAGE,socket.id);
  });
  return socket;
};

module.exports = connectToBot;