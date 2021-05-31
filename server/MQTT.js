require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const socket = require("socket.io");
const cors = require("cors");
const chalk = require("chalk");

var mqtt = require("mqtt");
var settings = {
  mqttServerUrl: "192.168.100.5",
  port: 1884,
  topic: "ModbusDaTa",
};

const {
  AttributeIds,
  OPCUAClient,
  TimestampsToReturn,
  DataType,
} = require("node-opcua");

const endpointUrl = "opc.tcp://192.168.2.3:4840";

const model = require("./models/Mqtt");
const db = require("./config/db");
db.connect();

const app = express();

const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const mqttRouter = require("./routes/mqtt");

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT);

// Socket.io server-side
//Setup
const io = require("socket.io")(server, {
  cors: {
    origin: PORT,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
let a = 0;
//Connection
io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("send_sys_state", (data) => {
    console.log(data);
    socket.emit("receive_sys_state", data);
  });
  /// MQTT Power metter
  var clientMQTT = mqtt.connect(
    "mqtt://" + settings.mqttServerUrl + ":" + settings.port
  );
  clientMQTT.on("connect", function () {
    clientMQTT.subscribe(settings.topic);
    //console.log("Subscribed topic " + settings.topic);
  });

  clientMQTT.on("message", function (topic, message) {
    let data = JSON.parse(message);
    a = a + 1;
    if (a == 500) {
      a = 0;
      const simdatatodb = {
        UL1: data.S.UL1 / 10,
        UL2: data.S.UL2 / 10,
        UL3: data.S.UL3 / 10,
        IL1: data.S.IL1,
        IL2: data.S.IL2,
        IL3: data.S.IL3,
        P: data.S.P,
        Q: data.S.Q,
        S: data.S.S,
        PF: data.S.PF / 1000,
        Phi: data.S.Phi,
        F: data.S.F / 100,
      };
      // const simdata = new model.SimData(simdatatodb);
      // //console.log(simdatatodb);
      // simdata.save();
      //--------------
      const tstatdatatodb = {
        CM: data.T.CM,
        MO: data.T.MO,
        Tp: data.T.Tp / 10,
        D: data.T.D / 10,
        N: data.T.N / 10,
      };
      //--------------
      // const tstatdata = new model.TSTATData(tstatdatatodb);
      // tstatdata.save();
    }
    // console.log(data)
    //
    // console.log(message);
    let simeas = data.S;
    let temperature = data.T;
    socket.emit("temperature", temperature);
    socket.emit("powermeter", simeas);
  });

  /// temperature
  socket.on("sysMode", (data) => {
    console.log(data);
    //  let sysMode= JSON.stringify(data);

    clientMQTT.publish("R101TSTAT", data);
    setTimeout(() => {
      clientMQTT.publish("NTS", 'D2D');
    }, 1500);
  });

  socket.on("temperatureSet", (data) => {
    console.log(data);
     let tem= JSON.stringify(data);

    clientMQTT.publish("R345TSTAT", tem);
    setTimeout(() => {
      clientMQTT.publish("NTS", 'D2D');
    }, 1500);
    
  });

  socket.on("lightSet", (data) => {
    console.log(data);
    //  let tem= JSON.stringify(data);
  
    clientMQTT.publish("LIGHT", data);
    setTimeout(() => {
      clientMQTT.publish("NTS", 'D2D');
    }, 1500);
    
  });
  

//   /////OPC UA Tests
//   (async () => {
//     try {
//       const client = OPCUAClient.create({
//         endpoint_must_exist: false,
//       });
//       client.on("backoff", (retry, delay) => {
//         console.log("Retrying to connect to ", endpointUrl, " attempt ", retry);
//       });
//       console.log(" connecting to ", chalk.cyan(endpointUrl));
//       await client.connect(endpointUrl);
//       console.log(" connected to ", chalk.cyan(endpointUrl));
  
//       const session = await client.createSession();
//       console.log(" session created");
  
//       const subscription = await session.createSubscription2({
//         requestedPublishingInterval: 1000,
//         requestedLifetimeCount: 1000,
//         requestedMaxKeepAliveCount: 20,
//         maxNotificationsPerPublish: 10,
//         publishingEnabled: true,
//         priority: 10,
//       });
  
//       subscription
//         .on("keepalive", function () {
//           console.log("keepalive");
//         })
//         .on("terminated", function () {
//           console.log(" TERMINATED ------------------------------>");
//         });
  
//       // --------------------------------------------------------
  
//       async function readnode(nodeIdToMonitor, callback) {
//         try {
//           const itemToMonitor = {
//             nodeId: nodeIdToMonitor,
//             attributeId: AttributeIds.Value,
//           };
//           const parameters = {
//             samplingInterval: 100,
//             discardOldest: true,
//             queueSize: 100,
//           };
//           const monitoredItem = await subscription.monitor(
//             itemToMonitor,
//             parameters,
//             TimestampsToReturn.Both
//           );
  
//           monitoredItem.on("changed", (dataValue) => {
//             return callback(dataValue);
//           });
//         } catch (error) {}
//       }
//       // readnode('ns=3;s="PS1_M"', (dataValue) => {
//       //   const PS = {
//       //     value: dataValue.value.value,
//       //     TimeStamp: JSON.stringify(dataValue.serverTimestamp),
//       //   };
//       //     socket.emit("MQTT", dataValue.value.value.toString());
//       //   if (dataValue.value.value > 5.5) {
//       //     //const data = new Data(PS);
//       //     //data.save();
//       //     console.log("KQ: ", JSON.stringify(dataValue.value));
//       //   }
//       // });
//       readnode("ns=3;s=\"VF\".\"MODE\"", (dataValue) => {
//        console.log(JSON.stringify(dataValue.value));
//       })
//       //TEST WRITE------------------- 
//       function WriteNode(setPointTemperatureId, Type, Wvalue) {
//         var nodesToWrite = [
//           {
//             nodeId: setPointTemperatureId,
//             attributeId: AttributeIds.Value,
//             value: {
//               value: {
//                 dataType: Type,
//                 value: Wvalue,
//               },
//             },
//           },
//         ];
  
//         session.write(nodesToWrite, function (err, statusCodes) {
//           if (!err) {
//           }
//         });
//       }
//         socket.on("Button", (message) => {
//           let node;
//           if (message === "Auto") {
//             node = 'ns=3;s="GAuto"';
//           }
//           ////// Pump
//           if (message === "Pump1_START") {
//             node = 'ns=3;s="Pump_1"   ."START"';
            
//           }
//           if (message === "Pump1_STOP") {
//             node = 'ns=3;s="Pump_1"."STOP"';
            
//           }
//           if (message === "Pump2_START") {
//             node = 'ns=3;s="Pump_2"   ."START"';
            
//           }
//           if (message === "Pump2_STOP") {
//             node = 'ns=3;s="Pump_2"."STOP"';
            
//           }
//           if (message === "Pump3_START") {
//             node = 'ns=3;s="Pump_3"   ."START"';
            
//           }
//           if (message === "Pump4_STOP") {
//             node = 'ns=3;s="Pump_3"."STOP"';
            
//           }
//           if (message === "Pump4_START") {
//             node = 'ns=3;s="Pump_4"   ."START"';
            
//           }
//           if (message === "Pump5_STOP") {
//             node = 'ns=3;s="Pump_4"."STOP"';
            
//           }
//           if (message === "Pump5_START") {
//             node = 'ns=3;s="Pump_5"   ."START"';
            
//           }
//           if (message === "VAF_CLOSE") {
//             node = 'ns=3;s="Pump_5"."STOP"';
            
//           }

//           ////// Valve
//           if (message === "VAF_OPEN") {
//             node = 'ns=3;s="VF"   ."OPEN"';
            
//           }
//           if (message === "VAF_CLOSE") {
//             node = 'ns=3;s="VF"."CLOSE"';
            
//           }
//           if (message === "VA1_OPEN") {
//             node = 'ns=3;s="VA1"   ."OPEN"';
            
//           }
//           if (message === "VA1_CLOSE") {
//             node = 'ns=3;s="VA1"."CLOSE"';
            
//           }
//           if (message === "VA2_OPEN") {
//             node = 'ns=3;s="VA2"   ."OPEN"';
            
//           }
//           if (message === "VA2_CLOSE") {
//             node = 'ns=3;s="VA2"."CLOSE"';
            
//           }
//           if (message === "VA3_OPEN") {
//             node = 'ns=3;s="VA3"   ."OPEN"';
            
//           }
//           if (message === "VA3_CLOSE") {
//             node = 'ns=3;s="VA3"."CLOSE"';
            
//           }
//           if (message === "VA4_OPEN") {
//             node = 'ns=3;s="VA4"   ."OPEN"';
            
//           }
//           if (message === "VA4_CLOSE") {
//             node = 'ns=3;s="VA4"."CLOSE"';
            
//           }
//           if (message === "VA5_OPEN") {
//             node = 'ns=3;s="VA5"   ."OPEN"';
            
//           }
//           if (message === "VA5_CLOSE") {
//             node = 'ns=3;s="VA5"."CLOSE"';
            
//           }
//           WriteNode(node, DataType.Boolean, true);
//           WriteNode(node, DataType.Boolean, false);
//         });
//         socket.on("VAF_Mode", (message) => {
//           let VA1M = 5;
//           console.log(typeof message);
//           if (message === "0") {
//             VA1M = 0;
//             console.log('0')
//           }
//           if (message === "2") {
//             VA1M = 2;
//             console.log('2')
//           }
//           if (message === "1") {
//             VA1M = 1;
//             console.log('2')
//           }
//           console.log(VA1M);
//           WriteNode('ns=3;s="VF"."MODE"', DataType.Int16, VA1M);
//         });
//       //ad(setPointTemperatureId, DataType.Int16, 22);
//       // ad("ns=3;s=\"GAuto\"", DataType.Boolean, true);
//       // detect CTRL+C and close
//       let running = true;
//       process.on("SIGINT", async () => {
//         if (!running) {
//           return; // avoid calling shutdown twice
//         }
//         console.log("shutting down client");
//         running = false;
  
//         await subscription.terminate();
  
//         await session.close();
//         await client.disconnect();
//         console.log("Done");
//         process.exit(0);
//       });
//     } catch (err) {
//       console.log(chalk.bgRed.white("Error" + err.message));
//       console.log(err);
//       process.exit(-1);
//     }
//   })();
  
  //********** */
  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });
});



// const connectDB = async () => {
//   try {
//     await mongoose.connect(
//       `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@login.ezfrs.mongodb.net/mythesis?retryWrites=true&w=majority`,
//       {
//         useCreateIndex: true,
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useFindAndModify: false,
//       }
//     );

//     console.log("MongoDB connected");
//   } catch (error) {
//     console.log(error.message);
//     process.exit(1);
//   }
// };

// connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/mqtts", mqttRouter);