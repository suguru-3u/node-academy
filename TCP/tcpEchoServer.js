// 1.TCPサーバーの生成
const net = require("net");
const readline = require("readline");

const server = net.createServer();
// TCPサーバーの接続最大数を設定
server.maxConnections = 3;

// クライアントコンストラクト
function Client(socket) {
  this.socket = socket;
}

Client.prototype.writeData = function (d) {
  const socket = this.socket;
  if (socket.writable) {
    const key = socket.remoteAddress + ":" + socket.remoePort;
    process.stdout.write("[" + key + "] -" + d);
    socket.write("[R]" + d);
  }
};

let clients = {};

// クライアント接続時のイベント1
server.on("connection", (socket) => {
  const status = server.getConnections + "/" + server.maxConnections;
  const key = socket.remoteAddress + ":" + socket.remotePort;
  console.log("Connection start(" + status + ") - " + key);
  clients[key] = new Client(socket);
  //   console.log("データの確認", clients[key]);
});

// クライアント接続のイベント2
// socketに対してdataイベントリスナを登録する
server.on("connection", (socket) => {
  let data = "";
  const newLine = /\r\n|\n/;
  // 改行コードが送られるまで溜めておく
  socket.on("data", (chunk) => {
    data += chunk.toString();
    const key = socket.remoteAddress + ":" + socket.remotePort;
    if (newLine.test(data)) {
      clients[key].writeData(data);
      data = "";
    }
  });
});

// クライアント接続時のイベント3
// クライアント接続終了時のイベントリスナを登録する
server.on("connection", (socket) => {
  const key = socket.remoteAddress + ":" + socket.remotePort;
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
