
import { useEffect, useState } from "react";
import {
  Bar, BarChart,



  CartesianGrid,


  LabelList, Legend, Tooltip, YAxis
} from "recharts";

export default function App(props) {

  const [data,setData] =useState([]);

  useEffect(() => {
   
    setData([{pv:props.value}])
    
}, [props.value]);
  
function Convert (data) {
  var a ='url(#normalcolor)'
   
  

  if(data>=2)
  { a='url(#highcolor)'}
 else if (data <= 1)
 {a='url(#lowcolor)'}
return a;
}
 
 
  


  return (
    <div className='barContainer'>
    
    <BarChart
      width={100}
      height={props.height}
      data={data}
      color='black'
     > 
     <defs>
    
    <linearGradient id="highcolor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="35%" stopColor="#be0000" stopOpacity={0.9}/>
      <stop offset="65%" stopColor="#1597bb" stopOpacity={0.3}/>
   
    </linearGradient>
    <linearGradient id="normalcolor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="10%" stopColor="#1597bb" stopOpacity={0.8}/>
      <stop offset="80%" stopColor="#8fd6e1" stopOpacity={0.6}/>
      
    </linearGradient>
    <linearGradient id="lowcolor" x1="0" y1="0" x2="0" y2="1">
    <stop offset="10%" stopColor="#8fd6e1" stopOpacity={0.5}/>
      <stop offset="35%" stopColor="#6f0000" stopOpacity={1}/>
     
    </linearGradient>
  </defs>
      <CartesianGrid horizontal ={false} vertical={false} />
      {/* <XAxis  hide={true} /> */}
      <YAxis domain ={[0,props.maxValue]} unit ='m' fontSize ='12' />
      <Tooltip />
      <Legend  iconSize = '0' align='right' fontSize="5"/>
      
      <Bar   type="monotone" dataKey="pv" name=' ' fill={`${Convert(props.value)}`} background={{ fill: "#eee" }}>
      {/* <LabelList dataKey="pv" position="top" fontSize="13" fontWeight="bold"/> */}
      </Bar>
    </BarChart>
    </div>
  );
}
