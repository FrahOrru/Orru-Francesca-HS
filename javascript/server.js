const http = require("http");

const server = http.createServer((req, res) => {
  setTimeout(() => {
    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        console.log(body);
        res.end("Body received and logged to console\n");
      });
    } else {
      res.end("Hello World\n");
    }
  }, 100);
});

server.listen(8080, () => {
  console.log("Server listening on port 8080");
});
