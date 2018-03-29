(()=>{
  const socket = io.connect('http://192.168.0.2:3000',{
    transports: ['websocket']
  });
  let MY_MESSAGE = 1;
  let ANOTHER_MESSAGE = 2;
  socket.on('message-public', function (data) {
    renderMessage(data.message,ANOTHER_MESSAGE);
  });
  function sendMessage() {
    const message = document.getElementById("messageInput").value;
    renderMessage(message,MY_MESSAGE);
    socket.emit('message-public',message);
  };
  function renderMessage(message,mode) {
    const messageList = document.getElementById("message-area");
    const message_row = document.createElement("div");
    switch (mode){
      case MY_MESSAGE:
        message_row.className = "my-message-block";
        message_row.innerText = message;
        break;
      case ANOTHER_MESSAGE:
        message_row.className = "another-message-block";
        message_row.innerText = message;
        break;
    }

    messageList.appendChild(message_row);
  }
  document.getElementById("messageSend").addEventListener("click", function(){
    sendMessage();
  });
})();
