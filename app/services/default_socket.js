'use strict';

function connectToDefault(args,token,url,renderer) {
  let agoConnected = false;
  const socket = require('socket.io-client')(url,{
    transports: ['websocket'],
    query:{
      id:args.id,
      nickName:args.name,
      authOrg:'facebook',
      token:token
    }
  });
  socket.args = args;
  socket.on('error',(message)=>{
    console.log(message.statusCode);
    console.log(message);
  });
  socket.on('news',(message)=>{
    console.log(message);
  });
  socket.on('message-public', function (data) {
    renderer.renderMessage(data.message,renderer.messageType.ANOTHER_MESSAGE,socket.user.nickName,socket.args.picture);
  });
  socket.on('createdToken',(access_token)=>{
    console.log(access_token);
    socket.user = access_token.user;
    socket.access_token = access_token.access_token;
    token = access_token.access_token;
  });
  socket.on('connect',()=>{
    if(!agoConnected){
      agoConnected = true;
      renderer.addMessageSendListener('messageSend','click',socket);
      renderer.addCreateRoomListener('createRoom','click');
    }
  });
  return socket;

}

module.exports = connectToDefault;