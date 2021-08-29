mergeInto(LibraryManager.library, {

  createChannel: function (obj_name,channel_name) {
    window.console.log('From JsLib create channel')
    var obj_name = Pointer_stringify(obj_name);
    var channel_name = Pointer_stringify(channel_name);
    window.createChannel(obj_name,channel_name);
  },
  
  disableAudio: function () {
    window.disableAudio();
  },

  enableAudio: function () {
    window.enableAudio();
  },
  
  joinChannel: function (obj_name,channel_name) {
    window.console.log('From JsLib join channel')
    var obj_name = Pointer_stringify(obj_name);
    var channel_name = Pointer_stringify(channel_name);
    window.joinChannel(obj_name,channel_name);
  },
  leaveChannel: function (obj_name) {
    var obj_name = Pointer_stringify(obj_name);
    window.leaveChannel(obj_name);
  },
  setAudioLevel: function (obj_name,level) {
    var obj_name = Pointer_stringify(obj_name);
    window.setAudioLevel(obj_name,level);
  },
  join_presentation: function (channel_name, ptr) {
    window.console.log('From JsLib join presentation')
    var channel_name = Pointer_stringify(channel_name);
    window.join_presentation(channel_name, ptr);
  },
  do_presentation: function(){
    window.do_presentation()
  },
  stop_presenting: function(){
    window.stop_presenting()
  },
  circle_load_balance: function(){
    window.circle_load_balance()
  },
  circle_buy: function(nft,amount){
    var nft = Pointer_stringify(nft);
    var amount = Pointer_stringify(amount);
    window.circle_buy(nft,amount);
  },
  circle_payout: function(){
    window.circle_payout();
  },
  initial_contract: function () {
  var returnStr = window.config1.contract;
  var bufferSize = lengthBytesUTF8(returnStr) + 1;
  var buffer = _malloc(bufferSize);
  stringToUTF8(returnStr, buffer, bufferSize);
  return buffer;
  },
});