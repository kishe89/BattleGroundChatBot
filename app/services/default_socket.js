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
    console.log(data);
    renderer.renderMessage(data.message,renderer.messageType.ANOTHER_MESSAGE,data.user.nickName,socket.args.picture);
  });

  //방 생성 '성공' Event - 2018.04.30 추가
  socket.on('createRoom_Success', function(result){
    console.log(result);
    // 방 성공 후 처리
    renderer.setRoomInfoListener(result);

    // 방 별 메세지 보내기 이벤트
    renderer.addPrivacyMessageSendListener('messageSend', 'click', socket, result);
  });

  // 방 생성 '실패' Event - 2018.04.30 추가
  socket.on('createRoom_Fail', function(e){
    console.log(e);
  });

  socket.on('createdToken',(access_token)=>{
    console.log(access_token);
    socket.user = access_token.user;
    socket.access_token = access_token.access_token;
    token = access_token.access_token;
    console.log(socket);
    renderer.loadRoomList('room-area', socket);
  });
  socket.on('message-get-in-room-success',(room)=>{
    console.log('message-get-in-room-success');
    console.log(room);
  });

  socket.on('connect',()=>{
    if(!agoConnected){
      agoConnected = true;
      renderer.addMessageSendListener('messageSend','click',socket);
      renderer.addCreateRoomListener('createRoom','click',socket);
    }
  });
  return socket;
}

module.exports = connectToDefault;