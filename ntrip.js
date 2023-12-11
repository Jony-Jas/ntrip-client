const net = require("net");

class NTRIPClient {
  constructor() {
    this.x = 1;
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
      ws.send(
        JSON.stringify({
          data: {
            latitude: parsedData.latitude,
            longitude: parsedData.longitude,
            height: parsedData.height,
          },
        })
      );
      console.log(`Received from caster: ${recData}`);
      this.x++;
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

  closeConnection() {
    this.clientSocket.destroy();
  }
}

module.exports = NTRIPClient;

// // Create Object:
// const ntripClient = new NTRIPClient();
// ntripClient.connectToCaster(null);

// //Sample Request Data
// const dataToSend = {
//   baseStation: "BS1",
//   mountPoint: "BS1-MP1",
// };

// //Send Rquest
// ntripClient.sendRequestToCaster(dataToSend);

// // Introduce a delay before closing the connection (in milliseconds)
// const delayBeforeClosing = 5000; // Adjust as needed
// setTimeout(() => {
//   console.log("Initiating connection closure.");
//   ntripClient.closeConnection();
// }, delayBeforeClosing);
