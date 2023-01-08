/**
 * メインファイル。
 * 下記サイトを参考にし、HTTPサーバーを構築
 * ルーティング、レスポンス機能を搭載
 * https://www.nodebeginner.org/index-jp.html
 */
const server = require("./server.js");
const router = require("./router.js");
const requestHandlers = require("./requestHandlers.js");

// ルーティングの判定を行うため、パス名に関数を代入している
const handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;

server.start(router.route, handle);
