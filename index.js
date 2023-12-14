const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const NTRIPClient = require("./ntrip");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected to WebSocket");

  const ntripClient = new NTRIPClient();

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    console.log(data);
    if (data.action === "connectToCaster") {
      ntripClient.connectToCaster(ws);
    } else if (data.action === "closeConnection") {
      ntripClient.closeConnection();
    } else if (data.action === "sendRequest") {
      const sndData = {
        ...data
      };
      ntripClient.sendRequestToCaster(sndData);
    } else if (data.action === "stopStreaming") {
      ntripClient.stopStream();
    } 
  });

  ws.on("close", () => {
    console.log("Client disconnected from WebSocket");
  });
});

app.use(express.static("public"));

server.listen(8080, () => {
  console.log("Server is running on port 8080");
});
