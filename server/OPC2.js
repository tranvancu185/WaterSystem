const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const chalk = require("chalk");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const {
  AttributeIds,
  OPCUAClient,
  TimestampsToReturn,
  DataType,
} = require("node-opcua");
//const Data = require('./app/models/Test1');
//const endpointUrl = "opc.tcp://Admin:53530/OPCUA/SimulationServer";
const endpointUrl = "opc.tcp://192.168.2.3:4840";
//const db = require('./config/db');
//db.connect();

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

server.listen(process.env.PORT || 5000, () =>
  console.log(`Server has started.`)
);

(async () => {
  try {
    const client = OPCUAClient.create({
      endpoint_must_exist: false,
    });
    client.on("backoff", (retry, delay) => {
      console.log("Retrying to connect to ", endpointUrl, " attempt ", retry);
    });
    console.log(" connecting to ", chalk.cyan(endpointUrl));
    await client.connect(endpointUrl);
    console.log(" connected to ", chalk.cyan(endpointUrl));

    const session = await client.createSession();
    console.log(" session created");

    const subscription = await session.createSubscription2({
      requestedPublishingInterval: 1000,
      requestedLifetimeCount: 1000,
      requestedMaxKeepAliveCount: 20,
      maxNotificationsPerPublish: 10,
      publishingEnabled: true,
      priority: 10,
    });

    subscription
      .on("keepalive", function () {
        console.log("keepalive");
      })
      .on("terminated", function () {
        console.log(" TERMINATED ------------------------------>");
      });

    // --------------------------------------------------------

    async function readnode(nodeIdToMonitor, callback) {
      try {
        const itemToMonitor = {
          nodeId: nodeIdToMonitor,
          attributeId: AttributeIds.Value,
        };
        const parameters = {
          samplingInterval: 100,
          discardOldest: true,
          queueSize: 100,
        };
        const monitoredItem = await subscription.monitor(
          itemToMonitor,
          parameters,
          TimestampsToReturn.Both
        );

        monitoredItem.on("changed", (dataValue) => {
          return callback(dataValue);
        });
      } catch (error) {}
    }
    readnode('ns=3;s="PS1_M"', (dataValue) => {
      const PS = {
        value: dataValue.value.value,
        TimeStamp: JSON.stringify(dataValue.serverTimestamp),
      };
      io.on("connection", (socket) => {
        socket.emit("MQTT", dataValue.value.value.toString());
      });
      if (dataValue.value.value > 5.5) {
        //const data = new Data(PS);
        //data.save();
        console.log("KQ: ", JSON.stringify(dataValue.value));
      }
    });
    readnode("ns=3;s=\"Clock_0.5Hz\"", (dataValue) => {
     console.log(JSON.stringify(dataValue.value));
    })
    //TEST WRITE
    var setPointTemperatureId = 'ns=3;s="Mode"';

    function ad(setPointTemperatureId, Type, Wvalue) {
      var nodesToWrite = [
        {
          nodeId: setPointTemperatureId,
          attributeId: AttributeIds.Value,
          value: {
            value: {
              dataType: Type,
              value: Wvalue,
            },
          },
        },
      ];

      session.write(nodesToWrite, function (err, statusCodes) {
        if (!err) {
        }
      });
    }
    io.on("connection", (socket) => {
      socket.on("Button", (message) => {
        let node;
        if (message === "Auto") {
          node = 'ns=3;s="GAuto"';
        }
        if (message === "OpenVA1") {
          node = 'ns=3;s="VF"."OPEN"';
          console.log('open')
        }
        if (message === "CloseVA1") {
          node = 'ns=3;s="VF"."CLOSE"';
          console.log('Close')
        }
        ad(node, DataType.Boolean, true);
        ad(node, DataType.Boolean, false);
      });
      socket.on("VA1Mode", (message) => {
        let VA1M = 5;
        console.log(typeof message);
        if (message === "0") {
          VA1M = 0;
        }
        if (message === "2") {
          VA1M = 2;
        }
        if (message === "1") {
          VA1M = 1;
        }
        console.log(VA1M);
        ad('ns=3;s="VF"."MODE"', DataType.Int16, VA1M);
      });
    });
    //ad(setPointTemperatureId, DataType.Int16, 22);
    // ad("ns=3;s=\"GAuto\"", DataType.Boolean, true);
    // detect CTRL+C and close
    let running = true;
    process.on("SIGINT", async () => {
      if (!running) {
        return; // avoid calling shutdown twice
      }
      console.log("shutting down client");
      running = false;

      await subscription.terminate();

      await session.close();
      await client.disconnect();
      console.log("Done");
      process.exit(0);
    });
  } catch (err) {
    console.log(chalk.bgRed.white("Error" + err.message));
    console.log(err);
    process.exit(-1);
  }
})();
