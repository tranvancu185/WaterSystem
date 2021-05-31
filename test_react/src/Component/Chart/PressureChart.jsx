

import React, { useEffect, useState,useRef } from "react";
import {
  Bar, BarChart,
  CartesianGrid,
  Legend, Tooltip, XAxis,Label,Area,AreaChart,
  YAxis
} from "recharts";
import './PressureChart.css'
import io from "socket.io-client";

let socket;
const CONNECTION_PORT = "localhost:5000/";

const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100
    }
  ];

  
export default function App() {

//    function usePrevious(value) {
//      const ref =useRef();
//      useEffect(()=>{
//        ref.current=value;
//      })
//      return ref.current;
// }

useEffect(() => {
  socket = io(CONNECTION_PORT);
}, [CONNECTION_PORT]);

  // const [data, setData] = useState([]);

  // // 1. listen for a cpu event and update the state
  // useEffect(() => {
  //   socket.on('powermeter', cpuPercent => {
     
  //     setData(currentData => [...currentData,cpuPercent]);
      
  //   });
  // }, []);
  




  return (
    <div className="pressure-chart-container">
        <h2 className='label-level-chart'>Pressure Value</h2>
    <AreaChart width={730} height={250} data={data}
  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
  <defs>
    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
    </linearGradient>
    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
      <stop offset="10%" stopColor="#bb371a" stopOpacity={2.2}/>
      <stop offset="90%" stopColor="#8884d8" stopOpacity={0.8}/>
      
    </linearGradient>
  </defs>
  <XAxis  />
  <YAxis />
  <CartesianGrid strokeDasharray="3 3" />
  <Tooltip />
  <Area type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
</AreaChart>
    </div>
  
    
  );
}