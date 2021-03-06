'use strict';

function connectToDefault(args,token,url,renderer) {
  let agoConnected = false;
  let roomInitialized = false;
  let agoTask = undefined;
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

  //Create room 'success' Event - 2018.04.30 add.
  socket.on('createRoom_Success', function(result){
    console.log(result);
    // 방 성공 후 처리
    if(renderer.agoLoadMessageTargetRoom !== result.room._id) {
      const roomItem = renderer.renderRoomItem(renderer.RoomItemFactory.RoomItemList,result.room);

      renderer.MessageListView.SwitchRoomAfterCreated(renderer,roomItem.room_item_div);
    }
    renderer.addClickEventListener(socket);
  });

  // Create room 'fail' Event - 2018.04.30 add.
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

  // Load message in selected room.
  socket.on('message-get-in-room-success',(room)=>{
    if(renderer.agoLoadMessageTargetRoom !== room._id) {
      renderer.MessageListView.SwitchRoom(renderer,room);

    }
    if(agoTask&&!agoTask.isExcuted){
      agoTask.reject('cancel room load message ');
    }
    renderer.loadParticipant(socket,room)
      .then((result)=>{
        console.log(result);
      })
      .catch((e)=>{
        console.log(e);
      });

    // renderer.loadMessage(socket,room)
    //   .then(renderer.agoLoadMessageIsResolve)
    //   .catch(renderer.agoLoadMessageIsReject);

    /**
     * Cancelable Promise Test
     * @type {{isExcuted, reject, promise}}
     */
    agoTask = renderer.loadMessageCancelablePromise(socket,room);
    agoTask.promise.then(renderer.agoLoadMessageIsResolve).catch(renderer.agoLoadMessageIsReject);
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

  socket.on('leaveRoom_Success', (result)=>{
    console.log('leaveroom success!!');
    renderer.addLeaveRoomListener(result, socket);
  });

  socket.on('leaveRoom_Fail', (e) => {
    console.log(e);
  });
  return socket;
}

module.exports = connectToDefault;