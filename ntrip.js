const net = require("net");

class NTRIPClient {
  constructor() {
    this.tcpCasterIp = "127.0.0.1";
    this.tcpCasterPort = 54321;
    this.clientSocket = null;
    this.ws = null;
  }

  connectToCaster(ws) {
    this.ws = ws;
    this.clientSocket = net.createConnection(
      { host: this.tcpCasterIp, port: this.tcpCasterPort },
      () => {
        console.log(
          `Connected to NTRIP caster at ${this.tcpCasterIp}:${this.tcpCasterPort}`
        );
      }
    );

    this.clientSocket.on("data", (recData) => {
      const parsedData = JSON.parse(recData);
      console.log(parsedData);
      ws.send(JSON.stringify({
        data: parsedData
      }));
      console.log(`Received from caster: ${recData}`);
    });

    this.clientSocket.on("end", () => {
      console.log("TCP Client shutting down.");
    });

    this.clientSocket.on("error", (err) => {
      console.error(`Error: ${err.message}`);
    });
  }

  sendRequestToCaster(RequestToSend) {
    this.clientSocket.write(JSON.stringify(RequestToSend));
  }

  stopStream() {
    this.clientSocket.write("STOP_STREAMING");
  }

  closeConnection() {
    this.clientSocket.write("CLOSE_CONNECTION");
  }
}

module.exports = NTRIPClient;

// // // Create Object:
// const ntripClient = new NTRIPClient();
// ntripClient.connectToCaster(null);

// // //Sample Request Data
// const dataToSend = {
//   username: "example@example.com",
//   passsword: "example",
//   mountPoint: "BS2",
//   delay: 2
// };

// // //Send Rquest
// ntripClient.sendRequestToCaster(dataToSend);

// // // Introduce a delay before closing the connection (in milliseconds)
// const delayBeforeClosing = 5000; // Adjust as needed
// setTimeout(() => {
//   console.log("Initiating connection closure.");
//   ntripClient.closeConnection();
// }, delayBeforeClosing);
