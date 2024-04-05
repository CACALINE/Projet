const fs = require("fs");
const http = require("http");
const host = 'localhost';
const port = 8080;
const server = http.createServer();

server.on('request', (req, res) => {
  if (req.url.startsWith("/public/")) {
    res.end(fs.readFileSync('.' + req.url));
  } else if (req.url === "/louna.html") {
    res.end(fs.readFileSync("./public/louna.html"));
  } else if (req.url === "/tigrou.html") {
    res.end(fs.readFileSync("./public/tigrou.html"));
  } else if (req.url === "/caillou.html") {
    res.end(fs.readFileSync("./public/caillou.html"));
  } else {
    res.end(fs.readFileSync("./public/index.html"));
  }
});
  
  server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});