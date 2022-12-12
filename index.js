const http = require("http");
http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(a(req));
  })
  .listen(1337, "127.0.0.1");
console.log("Server running at hhtp://127.0.0.1:1337/");

function a(num) {
  console.log(num);
}
