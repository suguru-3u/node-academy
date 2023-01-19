/**
 * ストリーム
 * Nodeにおいて様々なオブジェクト内で、データの流れを扱う際に利用される抽象的なインターフェイス。
 * コンソールに出力、ネットワークに流れるデータ、ファイルの読み書きを行うデータなど、様々な利用用途が存在する。
 * ストリームにおいて入出力データはバファ単位で行い、データ全体をそのままやり取りするのではなく細切れで扱われる
 * またストリームは全てEventEmitterのインスタンスとなっており、状態の変更がイベントによって通知される。
 */

/**
 * 入力ストリーム
 * ネットワーク、キーボードのイベント、その他ストレージデバイスからのデータ読み込みを司る
 */

const path = require("path");
const fs = require("fs");

const filePath = path.join("./", "test.txt");

const readStream = fs.createReadStream(filePath, { bufferSize: 2 });
readStream.setEncoding("utf8");
readStream.on("data", (data) => {
  console.log(data);
});

readStream.on("end", () => {
  console.log("end");
});

readStream.on("error", (err) => {
  console.log("error", err);
});

/**
 * 出力ストリーム
 */

const writeFilePath = path.join(__dirname, "write.txt");
const writeStream = fs.createWriteStream(writeFilePath);

writeStream.write("Good Day!");
writeStream.end();

readStream.on("error", (err) => {
  console.log("error", err);
});

readStream.on("close", () => {
  console.log("writable stream closed");
});
