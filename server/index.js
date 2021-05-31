require("dotenv").config();
const express = require("express");
const app = express();
const socket = require("socket.io");
const cors = require("cors");
const chalk = require("chalk");
const path = require('path')
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const mqttRouter = require("./routes/mqtt");


const PORT = process.env.PORT || 5000;
const server = app.listen(PORT);
const db = require("./config/db");
db.connect();
////////////////////////////////
require('events').EventEmitter.defaultMaxListeners = 2000;
var mqtt = require("mqtt");
var settings = {
  mqttServerUrl: "192.168.100.5",
  port: 1884,
  topic: "ModbusDaTa",
};
////////////////////////////////////////////////////////////////
const {
  AttributeIds,
  OPCUAClient,
  TimestampsToReturn,
  DataType,
} = require("node-opcua");

const endpointUrl = "opc.tcp://192.168.2.3:4840";


let a = 0;
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
//Connection
io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("send_sys_state", (data) => {
  socket.emit("receive_sys_state", data);
  });
  /// MQTT Power metter
  var clientMQTT = mqtt.connect(
    "mqtt://" + settings.mqttServerUrl + ":" + settings.port
  );
  clientMQTT.on("connect", function () {
    clientMQTT.subscribe(settings.topic);
   
  });

  clientMQTT.on("message", function (topic, message) {
    let data = JSON.parse(message);

    let simeas = data.S;
    let temperature = data.T;
    socket.emit("temperature", temperature);
    socket.emit("powermeter", simeas);
    let I3 = data.S.IL3/10;
    let IL3 ={IL3:I3}
    a = a + 1;
    if (a == 100) {
     
      a = 0;
      socket.emit("IL3",IL3);
    }
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

    clientMQTT.publish("R350TSTAT", tem);
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
});

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
    //--------Emit DATA------------------------------////
    io.on("connection", (socket) => {
      console.log(socket.id);
        // /--------------------------------------------------------------------------------------
           
        // ---------SYS State----////
        readnode("ns=3;s=\"MODE\"", (dataValue) => {
        
          socket.emit('MODE',dataValue.value.value);
         })
         readnode("ns=3;s=\"System_Status\"", (dataValue) => {
        
          socket.emit('System_Status',dataValue.value.value);
         })
        
        
        //// Emit Pump State////


      // Pump1
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
      //  Pump2
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
      //  Pump3

       readnode("ns=3;s=\"Pump_3\".\"MODE\"", (dataValue) => {
        
        socket.emit('Pump_3_MODE',dataValue.value.value);
       })
       readnode("ns=3;s=\"Pump_3\".\"FEEDBACK\"", (dataValue) => {
        
        socket.emit('Pump_3_FEEDBACK',dataValue.value.value);
       })
       readnode("ns=3;s=\"Pump_3\".\"FAULT\"", (dataValue) => {
        
        socket.emit('Pump_3_FAULT',dataValue.value.value);
       })
       readnode("ns=3;s=\"Pump_3\".\"Speed\"", (dataValue) => {
        
        socket.emit('Pump_3_Speed',dataValue.value.value);
       })

        //  Pump4

        readnode("ns=3;s=\"Pump_4\".\"MODE\"", (dataValue) => {
        
          socket.emit('Pump_4_MODE',dataValue.value.value);
         })
         readnode("ns=3;s=\"Pump_4\".\"FEEDBACK\"", (dataValue) => {
          
          socket.emit('Pump_4_FEEDBACK',dataValue.value.value);
         })
         readnode("ns=3;s=\"Pump_4\".\"FAULT\"", (dataValue) => {
          
          socket.emit('Pump_4_FAULT',dataValue.value.value);
         })
         readnode("ns=3;s=\"Pump_4\".\"Speed\"", (dataValue) => {
          
          socket.emit('Pump_4_Speed',dataValue.value.value);
         })
         //  Pump2
       readnode("ns=3;s=\"Pump_5\".\"MODE\"", (dataValue) => {
        
        socket.emit('Pump_5_MODE',dataValue.value.value);
       })
       readnode("ns=3;s=\"Pump_5\".\"FEEDBACK\"", (dataValue) => {
        
        socket.emit('Pump_5_FEEDBACK',dataValue.value.value);
       })
       readnode("ns=3;s=\"Pump_5\".\"FAULT\"", (dataValue) => {
        
        socket.emit('Pump_5_FAULT',dataValue.value.value);
       })
       readnode("ns=3;s=\"Pump_5\".\"Speed\"", (dataValue) => {
        
        socket.emit('Pump_5_Speed',dataValue.value.value);
       })




      //// Emit VALVE State//////




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

       /////Valve A1
       
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
        /////Valve A2

        readnode("ns=3;s=\"VA2\".\"MODE\"", (dataValue) => {
        
          socket.emit('VA2_MODE',dataValue.value.value);
         })
   
         readnode("ns=3;s=\"VA2\".\"OPENED\"", (dataValue) => {
           
           socket.emit('VA2_OPENED',dataValue.value.value);
          })
          readnode("ns=3;s=\"VA2\".\"CLOSED\"", (dataValue) => {
           
           socket.emit('VA2_CLOSED',dataValue.value.value);
          })
          readnode("ns=3;s=\"VA2\".\"FAULT\"", (dataValue) => {
           
           socket.emit('VA2_FAULT',dataValue.value.value);
          })

          /////Valve A3

        readnode("ns=3;s=\"VA3\".\"MODE\"", (dataValue) => {
        
          socket.emit('VA3_MODE',dataValue.value.value);
         })
   
         readnode("ns=3;s=\"VA3\".\"OPENED\"", (dataValue) => {
           
           socket.emit('VA3_OPENED',dataValue.value.value);
          })
          readnode("ns=3;s=\"VA3\".\"CLOSED\"", (dataValue) => {
           
           socket.emit('VA3_CLOSED',dataValue.value.value);
          })
          readnode("ns=3;s=\"VA3\".\"FAULT\"", (dataValue) => {
           
           socket.emit('VA3_FAULT',dataValue.value.value);
          })

          /////Valve A4

        readnode("ns=3;s=\"VA4\".\"MODE\"", (dataValue) => {
        
          socket.emit('VA4_MODE',dataValue.value.value);
         })
   
         readnode("ns=3;s=\"VA4\".\"OPENED\"", (dataValue) => {
           
           socket.emit('VA4_OPENED',dataValue.value.value);
          })
          readnode("ns=3;s=\"VA4\".\"CLOSED\"", (dataValue) => {
           
           socket.emit('VA4_CLOSED',dataValue.value.value);
          })
          readnode("ns=3;s=\"VA4\".\"FAULT\"", (dataValue) => {
           
           socket.emit('VA4_FAULT',dataValue.value.value);
          })

      /////Valve A5

        readnode("ns=3;s=\"VA5\".\"MODE\"", (dataValue) => {
        
          socket.emit('VA5_MODE',dataValue.value.value);
         })
   
         readnode("ns=3;s=\"VA5\".\"OPENED\"", (dataValue) => {
           
           socket.emit('VA5_OPENED',dataValue.value.value);
          })
          readnode("ns=3;s=\"VA5\".\"CLOSED\"", (dataValue) => {
           
           socket.emit('VA5_CLOSED',dataValue.value.value);
          })
          readnode("ns=3;s=\"VA5\".\"FAULT\"", (dataValue) => {
           
           socket.emit('VA5_FAULT',dataValue.value.value);
          })
            /////Valve B1

            readnode("ns=3;s=\"VB1\".\"MODE\"", (dataValue) => {
        
              socket.emit('VB1_MODE',dataValue.value.value);
             })
       
             readnode("ns=3;s=\"VB1\".\"OPENED\"", (dataValue) => {
               
               socket.emit('VB1_OPENED',dataValue.value.value);
              })
              readnode("ns=3;s=\"VB1\".\"CLOSED\"", (dataValue) => {
               
               socket.emit('VB1_CLOSED',dataValue.value.value);
              })
              readnode("ns=3;s=\"VB1\".\"FAULT\"", (dataValue) => {
               
               socket.emit('VB1_FAULT',dataValue.value.value);
              })
               /////Valve B2

            readnode("ns=3;s=\"VB2\".\"MODE\"", (dataValue) => {
        
              socket.emit('VB2_MODE',dataValue.value.value);
             })
       
             readnode("ns=3;s=\"VB2\".\"OPENED\"", (dataValue) => {
               
               socket.emit('VB2_OPENED',dataValue.value.value);
              })
              readnode("ns=3;s=\"VB2\".\"CLOSED\"", (dataValue) => {
               
               socket.emit('VB2_CLOSED',dataValue.value.value);
              })
              readnode("ns=3;s=\"VB2\".\"FAULT\"", (dataValue) => {
               
               socket.emit('VB2_FAULT',dataValue.value.value);
              })
               /////Valve B3

            readnode("ns=3;s=\"VB3\".\"MODE\"", (dataValue) => {
        
              socket.emit('VB3_MODE',dataValue.value.value);
             })
       
             readnode("ns=3;s=\"VB3\".\"OPENED\"", (dataValue) => {
               
               socket.emit('VB3_OPENED',dataValue.value.value);
              })
              readnode("ns=3;s=\"VB3\".\"CLOSED\"", (dataValue) => {
               
               socket.emit('VB3_CLOSED',dataValue.value.value);
              })
              readnode("ns=3;s=\"VB3\".\"FAULT\"", (dataValue) => {
               
               socket.emit('VB3_FAULT',dataValue.value.value);
              })

               /////Valve B4

            readnode("ns=3;s=\"VB4\".\"MODE\"", (dataValue) => {
        
              socket.emit('VB4_MODE',dataValue.value.value);
             })
       
             readnode("ns=3;s=\"VB4\".\"OPENED\"", (dataValue) => {
               
               socket.emit('VB4_OPENED',dataValue.value.value);
              })
              readnode("ns=3;s=\"VB4\".\"CLOSED\"", (dataValue) => {
               
               socket.emit('VB4_CLOSED',dataValue.value.value);
              })
              readnode("ns=3;s=\"VB4\".\"FAULT\"", (dataValue) => {
               
               socket.emit('VB4_FAULT',dataValue.value.value);
              })
               /////Valve B5

            readnode("ns=3;s=\"VB5\".\"MODE\"", (dataValue) => {
        
              socket.emit('VB5_MODE',dataValue.value.value);
             })
       
             readnode("ns=3;s=\"VB5\".\"OPENED\"", (dataValue) => {
               
               socket.emit('VB5_OPENED',dataValue.value.value);
              })
              readnode("ns=3;s=\"VB5\".\"CLOSED\"", (dataValue) => {
               
               socket.emit('VB5_CLOSED',dataValue.value.value);
              })
              readnode("ns=3;s=\"VB5\".\"FAULT\"", (dataValue) => {
               
               socket.emit('VB5_FAULT',dataValue.value.value);
              })
              
               /////Valve C1

            readnode("ns=3;s=\"VC1\".\"MODE\"", (dataValue) => {
        
              socket.emit('VC1_MODE',dataValue.value.value);
             })
       
             readnode("ns=3;s=\"VC1\".\"OPENED\"", (dataValue) => {
               
               socket.emit('VC1_OPENED',dataValue.value.value);
              })
              readnode("ns=3;s=\"VC1\".\"CLOSED\"", (dataValue) => {
               
               socket.emit('VC1_CLOSED',dataValue.value.value);
              })
              readnode("ns=3;s=\"VC1\".\"FAULT\"", (dataValue) => {
               
               socket.emit('VC1_FAULT',dataValue.value.value);
              })
               /////Valve C2

            readnode("ns=3;s=\"VC2\".\"MODE\"", (dataValue) => {
        
              socket.emit('VC2_MODE',dataValue.value.value);
             })
       
             readnode("ns=3;s=\"VC2\".\"OPENED\"", (dataValue) => {
               
               socket.emit('VC2_OPENED',dataValue.value.value);
              })
              readnode("ns=3;s=\"VC2\".\"CLOSED\"", (dataValue) => {
               
               socket.emit('VC2_CLOSED',dataValue.value.value);
              })
              readnode("ns=3;s=\"VC2\".\"FAULT\"", (dataValue) => {
               
               socket.emit('VC2_FAULT',dataValue.value.value);
              })
    
    
    



              /////--------UV---------////

              readnode("ns=3;s=\"UV_CMD\"", (dataValue) => {
          
                socket.emit('UV_CMD',dataValue.value.value);
               })


        /////--------Level F Tank---------////
        readnode("ns=3;s=\"FTank_Level\"", (dataValue) => {
          
          socket.emit('FTank_Level',dataValue.value.value);
         })
          /////--------Level M Tank---------////
        readnode("ns=3;s=\"MTank_Level\"", (dataValue) => {
          
          socket.emit('MTank_Level',dataValue.value.value);
         })
          /////--------Level C Tank---------////
        readnode("ns=3;s=\"CTank_Level\"", (dataValue) => {
          
          socket.emit('CTank_Level',dataValue.value.value);
         })
         
         


        ////-------------------Speed----------//////

        readnode("ns=3;s=\"Pump_1\".\"Speed\"", (dataValue) => {
         
          socket.emit('Pump_1_SPEED',dataValue.value.value);
         })
         readnode("ns=3;s=\"Pump_2\".\"Speed\"", (dataValue) => {
         
          socket.emit('Pump_2_SPEED',dataValue.value.value);
         })
         readnode("ns=3;s=\"Pump_3\".\"Speed\"", (dataValue) => {
         
          socket.emit('Pump_3_SPEED',dataValue.value.value);
         })
         readnode("ns=3;s=\"Pump_4\".\"Speed\"", (dataValue) => {
         
          socket.emit('Pump_4_SPEED',dataValue.value.value);
         })
         readnode("ns=3;s=\"Pump_5\".\"Speed\"", (dataValue) => {
         
          socket.emit('Pump_5_SPEED',dataValue.value.value);
         })

        //  --------------------------------socket on-------

         socket.on("Button", (message) => {
            let node;
            /////SYSTEM
            if (message === "GAuto") {
             
              node = 'ns=3;s="GAuto"';
            }
            if (message === "StartSystem") {
             
              node = 'ns=3;s="StartSystem"';
            }
            if (message === "StopSystem") {
             
              node = 'ns=3;s="StopSystem"';
            }
            if (message === "Emergency") {
             
              node = 'ns=3;s="Emergency"';
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
      ////////////////////////////--------------------Setmode
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
          
        }
        if (message === "2") {
          PM = 2;
          
        }
        if (message === "1") {
          PM = 1;
         
        }
        console.log(PM);
        WriteNode('ns=3;s="Pump_1"."MODE"', DataType.Int16, PM);
      });
      socket.on("Pump2_MODE", (message) => {
        let PM = 5;
        console.log(typeof message);
        if (message === "0") {
          PM = 0;
          
        }
        if (message === "2") {
          PM = 2;
         
        }
        if (message === "1") {
          PM = 1;
          
        }
        console.log(PM);
        WriteNode('ns=3;s="Pump_2"."MODE"', DataType.Int16, PM);
      });



      /////--------SET SPEED-----------------------------//////////////




      socket.on("SetSpeed_Pump1", (message) => {
        
        WriteNode('ns=3;s="Pump_1"."SetSpeed"', DataType.Float,message);
      });
      socket.on("SetSpeed_Pump2", (message) => {
        
        WriteNode('ns=3;s="Pump_2"."SetSpeed"', DataType.Float,message);
      });
      socket.on("SetSpeed_Pump3", (message) => {
        
        WriteNode('ns=3;s="Pump_3"."SetSpeed"', DataType.Float,message);
      });
      socket.on("SetSpeed_Pump4", (message) => {
        
        WriteNode('ns=3;s="Pump_4"."SetSpeed"', DataType.Float,message);
      });
      socket.on("SetSpeed_Pump5", (message) => {
        
        WriteNode('ns=3;s="Pump_5"."SetSpeed"', DataType.Float,message);
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


app.use(express.json());
app.use(cors());
/// khai bao ham se thuc hien khi den url 
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/mqtts", mqttRouter);
app.use("/", express.static(path.join(__dirname, '/public')))