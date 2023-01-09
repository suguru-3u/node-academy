const EventEmitter = require("events");
const myEventter = new EventEmitter();

// イベントの登録＆処理
myEventter.on("event", () => {
  console.log("B");
});

// イベントの発火
console.log("A");
myEventter.emit("event");
console.log("C");
