'use strict';
(()=>{
  const electron = require("electron");
  const connectToDefault = require('./app/services/default_socket');
  const connectToBot = require('./app/services/bot_socket');
  const MessageRenderer = require('./app/services/message_renderer');
  const Channel = require('./app/services/channel');
  const channel = new Channel();
  let renderer;
  const ipcRenderer = electron.ipcRenderer;
  let token = undefined;
  let defaultSocket;
  let botSocket;
  ipcRenderer.on('connect',(event,args,locale)=>{
    console.log(locale);
    console.log('receive event from ipcMain');
    renderer = new MessageRenderer(document,window,locale);
    defaultSocket = connectToDefault(args, token, channel.DEVELOPMENT_HOST(), renderer);
    botSocket = connectToBot(args, token, channel.DEVELOPMENT_BOT_CHANNEL(), renderer);
  });
})();
