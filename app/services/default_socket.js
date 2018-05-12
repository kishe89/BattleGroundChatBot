'use strict';

function connectToDefault(args,token,url,renderer) {
  let agoConnected = false;
  let roomInitialized = false;
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
    // from : sender, to : others
    renderer.renderMessage(data.message,renderer.messageType.ANOTHER_MESSAGE,data.user.nickName,socket.args.picture);
  });

  //방 생성 '성공' Event - 2018.04.30 추가
  socket.on('createRoom_Success', function(result){
    // 방 성공 후 처리
    renderer.addClickEventListener(result);
  });

  // 방 생성 '실패' Event - 2018.04.30 추가
  socket.on('createRoom_Fail', function(e){
    console.log(e);
  });

  socket.on('createdToken',(access_token)=>{
    socket.user = access_token.user;
    socket.access_token = access_token.access_token;
    token = access_token.access_token;
    if(!roomInitialized) {
      renderer.loadRoomList('room-area', socket);
      roomInitialized = true;
    }
  });

  // 방 로드 -> 해당 방 메세지 로드
  socket.on('message-get-in-room-success',(room)=>{
    console.log(room);
    renderer.loadParticipant(socket,room)
      .then((result)=>{
        console.log(result);
      })
      .catch((e)=>{
        console.log(e);
      });
    renderer.loadMessage(socket,room.messages)
      .then(renderer.agoLoadMessageIsResolve)
      .catch(renderer.agoLoadMessageIsReject);
  });

  socket.on('message-get-in-room-fail',(e)=>{
    console.log(e);
  });

  socket.on('message-privacy', function (data) {
    console.log(data);
    renderer.renderMessage(
      data.createdMessage,
      renderer.messageType.ANOTHER_MESSAGE,
      socket.args.picture
    );

    // data.length만큼 해당 방에 출력
  });

  socket.on('message-privacy-fail',(e)=>{
    console.log(e);
    renderer.addChangeMessageSendFailListener('my-message-block-info-sendStatus sending');
  });

  socket.on('connect',()=>{
    if(!agoConnected){
      agoConnected = true;
      // 서버 연결 시 첫 번째 방으로 채팅 접속
      renderer.addPrivacyMessageSendListener('messageSend', 'click', socket);
      renderer.addCreateRoomListener('createRoom','click',socket);
    }
  });
  return socket;
}

module.exports = connectToDefault;