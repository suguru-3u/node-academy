/**
 * WEBサーバーを構築している。
 * リクエストをルーティング設定をしているファイルに渡し、リクエストに応じたレスポンスを返している。
 */

const http = require("http");
const url = require("url");

function start(route, handle) {
  function onRequest(request, response) {
    const pathname = url.parse(request.url).pathname;

    const resContent = route(handle, pathname);

    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write(resContent);
    response.end();
  }

  // createServerでサーザーを立ち上げ、listenのメソッドでサーバーのポート番号を指定する。
  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;
