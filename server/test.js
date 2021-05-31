require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const socket = require("socket.io");
const cors = require("cors");
const chalk = require("chalk");
require('events').EventEmitter.defaultMaxListeners = 2000;
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
//Connection


/////OPC UA Tests
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
      } catch (error) { }
    }

    //TEST WRITE------------------- 
    function WriteNode(setPointTemperatureId, Type, Wvalue) {
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
    // readnode('ns=3;s="Clock_0.5Hz"', (dataValue) => {
    // //   const PS = {
    // //     value: dataValue.value.value,
    // //     TimeStamp: JSON.stringify(dataValue.serverTimestamp),
    // //   };
    // //     socket.emit("MQTT", dataValue.value.value.toString());
    // //   if (dataValue.value.value > 5.5) {
    // //     //const data = new Data(PS);
    // //     //data.save();
    //   console.log("KQ: ", JSON.stringify(dataValue.value));
    //   // }
    //  });
    io.on("connection", (socket) => {
      console.log(socket.id);

            //// Emit Pump
      readnode("ns=3;s=\"Pump_1\".\"MODE\"", (dataValue) => {
        
        socket.emit('Pump_1_MODE',dataValue.value.value);
       })
       readnode("ns=3;s=\"Pump_1\".\"FEEDBACK\"", (dataValue) => {
        
        socket.emit('Pump_1_FEEDBACK',dataValue.value.value);
       })
       readnode("ns=3;s=\"Pump_1\".\"FAULT\"", (dataValue) => {
        
        socket.emit('Pump_1_FAULT',dataValue.value.value);
       })
       readnode("ns=3;s=\"Pump_1\".\"Speed\"", (dataValue) => {
        
        socket.emit('Pump_1_Speed',dataValue.value.value);
       })

       readnode("ns=3;s=\"Pump_2\".\"MODE\"", (dataValue) => {
        
        socket.emit('Pump_2_MODE',dataValue.value.value);
       })
       readnode("ns=3;s=\"Pump_2\".\"FEEDBACK\"", (dataValue) => {
        
        socket.emit('Pump_2_FEEDBACK',dataValue.value.value);
       })
       readnode("ns=3;s=\"Pump_2\".\"FAULT\"", (dataValue) => {
        
        socket.emit('Pump_2_FAULT',dataValue.value.value);
       })
       readnode("ns=3;s=\"Pump_2\".\"Speed\"", (dataValue) => {
        
        socket.emit('Pump_2_Speed',dataValue.value.value);
       })

      //// Emit VALVE
      readnode("ns=3;s=\"VF\".\"MODE\"", (dataValue) => {
       
       socket.emit('VF_MODE',dataValue.value.value);
      })

      readnode("ns=3;s=\"VF\".\"OPENED\"", (dataValue) => {
        
        socket.emit('VF_OPENED',dataValue.value.value);
       })
       readnode("ns=3;s=\"VF\".\"CLOSED\"", (dataValue) => {
        
        socket.emit('VF_CLOSED',dataValue.value.value);
       })
       readnode("ns=3;s=\"VF\".\"FAULT\"", (dataValue) => {
        
        socket.emit('VF_FAULT',dataValue.value.value);
       })

       /////

       readnode("ns=3;s=\"VA1\".\"MODE\"", (dataValue) => {
        
        socket.emit('VA1_MODE',dataValue.value.value);
       })
 
       readnode("ns=3;s=\"VA1\".\"OPENED\"", (dataValue) => {
         
         socket.emit('VA1_OPENED',dataValue.value.value);
        })
        readnode("ns=3;s=\"VA1\".\"CLOSED\"", (dataValue) => {
         
         socket.emit('VA1_CLOSED',dataValue.value.value);
        })
        readnode("ns=3;s=\"VA1\".\"FAULT\"", (dataValue) => {
         
         socket.emit('VA1_FAULT',dataValue.value.value);
        })
        /////Level
        readnode("ns=3;s=\"FTank_Level\"", (dataValue) => {
          
          socket.emit('FTank_Level',dataValue.value.value);
         }) 








         socket.on("Button", (message) => {
            let node;
            if (message === "Auto") {
              node = 'ns=3;s="GAuto"';
            }
            ////// Pump
            if (message === "Pump1_START") {
              node = 'ns=3;s="Pump_1"."START"';
              
            }
            if (message === "Pump1_STOP") {
              node = 'ns=3;s="Pump_1"."STOP"';
              
            }
            if (message === "Pump1_RESET") {
              node = 'ns=3;s="Pump_1"."RESET"';
              
            }
            if (message === "Pump2_START") {
              node = 'ns=3;s="Pump_2"."START"';
              
            }
            if (message === "Pump2_STOP") {
              node = 'ns=3;s="Pump_2"."STOP"';
              
            }
            if (message === "Pump2_RESET") {
              node = 'ns=3;s="Pump_2"."RESET"';
              
            }
            if (message === "Pump3_START") {
              node = 'ns=3;s="Pump_3"."START"';
              
            }
            if (message === "Pump3_STOP") {
              node = 'ns=3;s="Pump_3"."STOP"';
              
            }
            if (message === "Pump3_RESET") {
              node = 'ns=3;s="Pump_3"."RESET"';
              
            }
            if (message === "Pump4_START") {
              node = 'ns=3;s="Pump_4"."START"';
              
            }
            if (message === "Pump4_STOP") {
              node = 'ns=3;s="Pump_4"."STOP"';
              
            }
            if (message === "Pump4_RESET") {
              node = 'ns=3;s="Pump_4"."RESET"';
              
            }
            if (message === "Pump5_START") {
              node = 'ns=3;s="Pump_5"."START"';
              
            }
            if (message === "Pump5_STOP") {
              node = 'ns=3;s="Pump_5"."STOP"';
              
            }
            if (message === "Pump5_RESET") {
              node = 'ns=3;s="Pump_5"."RESET"';
              
            }

        ////// Valve
        else if (message === "VAF_OPEN") {
          node = 'ns=3;s="VF"."OPEN"';

        }
        else if (message === "VAF_CLOSE") {
          node = 'ns=3;s="VF"."CLOSE"';

        }
        else if (message === "VA1_OPEN") {
          node = 'ns=3;s="VA1"."OPEN"';

        }
        else if (message === "VA1_CLOSE") {
          node = 'ns=3;s="VA1"."CLOSE"';

        }
        else if (message === "VA2_OPEN") {
          node = 'ns=3;s="VA2"."OPEN"';

        }
        else if (message === "VA2_CLOSE") {
          node = 'ns=3;s="VA2"."CLOSE"';

        }
        else if (message === "VA3_OPEN") {
          node = 'ns=3;s="VA3"."OPEN"';

        }
        else if (message === "VA3_CLOSE") {
          node = 'ns=3;s="VA3"."CLOSE"';

        }
        else if (message === "VA4_OPEN") {
          node = 'ns=3;s="VA4"."OPEN"';

        }
        else if (message === "VA4_CLOSE") {
          node = 'ns=3;s="VA4"."CLOSE"';

        }
        else if (message === "VA5_OPEN") {
          node = 'ns=3;s="VA5"."OPEN"';

        }
        else if (message === "VA5_CLOSE") {
          node = 'ns=3;s="VA5"."CLOSE"';

        }
        else {}
        console.log(message);
        WriteNode(node, DataType.Boolean, true);
        WriteNode(node, DataType.Boolean, false);
      });
      socket.on("VAF_MODE", (message) => {
        let VM = 5;
        console.log(typeof message);
        if (message === "0") {
          VM = 0;
          console.log('0')
        }
        if (message === "2") {
          VM = 2;
          console.log('2')
        }
        if (message === "1") {
          VM = 1;
          console.log('2')
        }
        console.log(VM);
        WriteNode('ns=3;s="VF"."MODE"', DataType.Int16, VM);
      });
      socket.on("VA1_MODE", (message) => {
        let VM = 5;
        console.log(typeof message);
        if (message === "0") {
          VM = 0;
          console.log('0')
        }
        if (message === "2") {
          VM = 2;
          console.log('2')
        }
        if (message === "1") {
          VM = 1;
          console.log('2')
        }
        console.log(VM);
        WriteNode('ns=3;s="VA1"."MODE"', DataType.Int16, VM);
      });
      ////
      socket.on("Pump1_MODE", (message) => {
        let PM = 5;
        console.log(typeof message);
        if (message === "0") {
          PM = 0;
          console.log('0')
        }
        if (message === "2") {
          PM = 2;
          console.log('2')
        }
        if (message === "1") {
          PM = 1;
          console.log('2')
        }
        console.log(PM);
        WriteNode('ns=3;s="Pump_1"."MODE"', DataType.Int16, PM);
      });
      socket.on("Pump2_MODE", (message) => {
        let PM = 5;
        console.log(typeof message);
        if (message === "0") {
          PM = 0;
          console.log('0')
        }
        if (message === "2") {
          PM = 2;
          console.log('2')
        }
        if (message === "1") {
          PM = 1;
          console.log('2')
        }
        console.log(PM);
        WriteNode('ns=3;s="Pump_2"."MODE"', DataType.Int16, PM);
      });





      socket.on("disconnect", () => {
        console.log("USER DISCONNECTED");
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

//********** */


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