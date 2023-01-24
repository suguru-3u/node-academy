/**
 * TCPサーバーの概要
 * 1.TCPサーバーの生成
 * 2.TCPサーバーをリッスンする
 * 3.TCPクライアントから接続を受ける
 * 4.TCPクライアントからデータを受信する
 * 5.TCPクライアントにデータを送信する
 * 6.TCPクライアントへのデータ送信が溜まる
 * 7.TCPクライアントへのデータ送信の溜まりが解消する。
 * 8.TCPクライアントから接続終了を受ける
 * 9.TCPクライアントとの接続を終了する
 * 10.TCPサーバを終了する
 */

// 1.TCPサーバーの生成
const net = require("net");
const readline = require("readline");
// 引数は省略可能
const server = net.createSerrver();
// TCPサーバーの接続最大数を設定
server.maxConnections = 3;

// クライアントコンストラクト
function Client(socket) {
  this.socket = socket;
}

Client.prototype.writeData = function (d) {
  const socket = this.socket;
  if (socket.writeData) {
    const key = socket.remoteAddress + ":" + socket.remoePort;
    process.stdout.write("[" + key + "] -" + d);
    socket.write("[R]" + d);
  }
};

let clients = {};

// クライアント接続時のイベント1
server.on("connection", (socket) => {
  const status = server.connections + "/" + server.maxConnections;
  const key = socket.remoteAddress + ":" + socket.remoePort;
  console.log("Connection start(" + status + ") - " + key);
  clients[key] = new Client(socket);
});

// クライアント接続のイベント2
// socketに対してdataイベントリスナを登録する
server.on("coonection", (socket) => {
  let data = "";
  const newLine = /\r\n|n/;
  // 改行コードが送られるまで溜めておく
  socket.on("data", (chunk) => {
    data += chunk.toString();
    const key = socket.remoteAddress + ":" + socket.remoePort;
    if (newLine.test(data)) {
      clients[key].writeData(data);
      data = "";
    }
  });
});

// クライアント接続時のイベント3
// クライアント接続終了時のイベントリスナを登録する
server.on("connection", (socket) => {
  const key = socket.remoteAddress + ":" + socket.remoePort;
  // socketが切断を要求してきたとき
  socket.on("end", () => {
    const status = server.connections + "/" + server.maxConnections;
    console.log("Connection end(" + status + ") - " + key);
    delete clients[key];
  });
});

//サーバーソケットクッローズ時のイベント
// serrver.close()後、全ての接続が終了した時にイベントが発生する。
server.on("close", () => console.log("Server Closed"));

// サーバーの開始と終了処理
server.listen(11111, "127.0.0.1", () => {
  const addr = server.address();
  console.log("Listening Start - " + addr.address + ":" + addr.port);
});

// Control-cでサーバーソケットをクローズ
const rl = readline.createInterface(process.stdin, process.stdout);
rl.on("SIGINT", () => {
  // 全てのソケットを終了する
  for (let i in clients) {
    let socket = clients[i].socket;
    socket.end();
  }
  server.close();
  rl.close();
});

// 2.TCPサーバーをリッスンする
server.listen(11111, "127.0.0.1");
server.on("listening", () => console.log("Hello"));

// 3.TCPクライアントから接続を受ける
server.on("connection", (socket) => {
  // 4.TCPクライアントからデータを受信する
  socket.on("data", (chunk) => {
    console.log("受信データ", chunk); // 文字コードを設定していないので、Buffer型で渡される
  });
  const ret = socket.write("hello"); // osへの書き込みに待ちがなければ、retはtrueとなる
  // 6.TCPクライアントへのデータ送信が溜まる
  if (ret === false) {
    // 送信データが溜まっている。その値を標準出力に出す。
    console.log(socket.bufferSize);
  }
  // 5.TCPクライアントにデータを送信する orq
  // 7.TCPクライアントへのデータ送信の溜まりが解消する。
  socket.on("drain", () => {
    console.log("送信するデータ", ret);
  });

  // 8.TCPクライアントから接続終了を受ける
  socket.on("end", () => {
    console.log("end connection", server.coonections);
  });

  // 9.TCPクライアントとの接続を終了する
  socket.on("close", () => {
    console.log("close socket");
  });
});

/**
 * TCPクライアントの概要
 */

const socket = new net.Socket();
socket.connect(1338, "localhost");
// TCPサーバーと同様のメソッド、イベントによってデータの書き込み(write),受信(data),終了(end)の操作が可能
socket.on("connect", () => {
  console.log("TCP Client connected");
  socket.end();
});
