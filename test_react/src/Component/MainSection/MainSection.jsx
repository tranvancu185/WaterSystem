import React, { useEffect, useState } from 'react';
////io
import io from "socket.io-client";
// Level bar
import Level from '../Chart/LevelBar';
// Control
import Control from '../ControlSection/ControlSection';
// Clean
import Clean from '../img/Clean.svg';
// Valve
import Valve_on from '../img/Valve_on.png';
import Valve_hori from '../img/Hand valve 2.png';
import Pipe_alight from '../img/Pipes_alight.png';
// Pipes
import Pipe_hori from '../img/Pipes_horizontal.png';
import Pipe_LB from '../img/Pipes_LB.png';
import Pipe_LT from '../img/Pipes_LT.png';
import Pipe_RB from '../img/Pipes_RB.png';
import Pipe_RT from '../img/Pipes_RT.png';
import Pipe_angle from '../img/Pipe_angle.svg';
import Pipe_fork from '../img/Pipe_fork.png';
import Pipe_fork_alight_left from '../img/Pipe_fork_alight_left.png';
import Pipe_fork_alight_right from '../img/Pipe_fork_alight_right.svg';
import Pipe_fork_down from '../img/Pipe_fork_down.png';
import Pump_Pressure from '../img/pressurepump.svg';
import Pump_Pressure_2 from '../img/pressurepump2.svg';
// Sensor
import Sensor from '../img/PressureSensor.svg';
import Pump_Pressure_2_on from '../img/Pressure_pump2_on.svg';
import Pump_Pressure_on from '../img/Pressure_pump_on.svg';
// Pump
import Pump from '../img/Pump.png';
import Pump_alight from '../img/Pump_alight.svg';
import Pump_alight_on from '../img/Vertical_pump_on.svg';
import Pump_on from '../img/Pump_on.png';

//Tank
import FeedTank from '../img/Tank_1.png';
import PressureTank from '../img/Tank_2.svg';
import RawTank from '../img/Tank_4.svg';
import UVFilterRun from '../img/UV-Open.svg';
import UVFilter from '../img/UV.svg';
import ROFilter from '../img/RO.svg';
//Popup
import Popup from '../Popup/Popup';
import PumpPop from '../Popup/Pump1Pop';
import ValvePop from '../Popup/ValveFPop';
import CleanPop from '../Popup/CleanPop';
// Status
import Status from '../StatusSection/StatusForm';
import './MainSection2.css';


  let socket;
  const CONNECTION_PORT = "localhost:5000/";


function MainSection2() {

    // const [data,setData] =useState({});

    // PopUp
    const [popupPump1,setPopupPump1] = useState(false);
    const [popupPump2,setPopupPump2] = useState(false);
    const [popupPump3,setPopupPump3] = useState(false);
    const [popupPump4,setPopupPump4] = useState(false);
    const [popupPump5,setPopupPump5] = useState(false);
    //Valve
    const [popupValveF,setPopupValveF] = useState(false);
    const [popupValve1,setPopupValve1] = useState(false);
    const [popupValve2,setPopupValve2] = useState(false);
    const [popupValve3,setPopupValve3] = useState(false);
    const [popupValve4,setPopupValve4] = useState(false);
    const [popupValve5,setPopupValve5] = useState(false);
    const [popupValve6,setPopupValve6] = useState(false);
    const [popupValve7,setPopupValve7] = useState(false);
    const [popupValve8,setPopupValve8] = useState(false);
    const [popupValve9,setPopupValve9] = useState(false);
    const [popupValve10,setPopupValve10] = useState(false);
    const [popupValve11,setPopupValve11] = useState(false);
    const [popupValve12,setPopupValve12] = useState(false);
    //Clean
    const [popupClean,setPopupClean] = useState(false);
    // State
    const [statePump1,setStatePump1] = useState(false);
    const [statePump2,setStatePump2] = useState(false);
    const [statePump3,setStatePump3] = useState(false);
    const [statePump4,setStatePump4] = useState(false);
    const [statePump5,setStatePump5] = useState(false);
    

    const [stateValveF,setStateValveF] = useState(false);
    const [stateValveA1,setStateValveA1] = useState(false);
    const [stateValveA2,setStateValveA2] = useState(false);
    const [stateValveA3,setStateValveA3] = useState(false);
    const [stateValveA4,setStateValveA4] = useState(false);
    const [stateValveA5,setStateValveA5] = useState(false);
    const [stateValveB1,setStateValveB1] = useState(false);
    const [stateValveB2,setStateValveB2] = useState(false);
    const [stateValveB3,setStateValveB3] = useState(false);
    const [stateValveB4,setStateValveB4] = useState(false);
    const [stateValveB5,setStateValveB5] = useState(false);
    const [stateValveC1,setStateValveC1] = useState(false);
    const [stateValveC2,setStateValveC2] = useState(false);
    const [stateUV,setStateUV] = useState(false);
   
//// Level
const[levelTankF,setLevelTankF] = useState([])
const[levelTankM,setLevelTankM] = useState([])
const[levelTankC,setLevelTankC] = useState([])
const[levelTankFHigh,setlevelTankFHigh] = useState(false);
const[levelTankFLow,setlevelTankFLow] = useState(false);
const[levelTankMHigh,setlevelTankMHigh] = useState(false);
const[levelTankMLow,setlevelTankMLow] = useState(false);
const[levelTankCHigh,setlevelTankCHigh] = useState(false);
const[levelTankCLow,setlevelTankCLow] = useState(false);
//// Pressure
const[pressure1,setPressure1] = useState()
const[pressure2,setPressure2] = useState()
const[pressure3,setPressure3] = useState()


/////
/// Connect io
useEffect(() => {
    socket = io(CONNECTION_PORT);
}, [CONNECTION_PORT]);


  ///-----GET State------
useEffect(() => {

  ////-------Level----///
  socket.on("FTank_Level", (data) => {
    setLevelTankF(data)
             });   
             socket.on("MTank_Level", (data) => {
                setLevelTankM(data)
                         });   
                         socket.on("CTank_Level", (data) => {
                            setLevelTankC(data)
                                     });    
// ----------------Pump State--------///
    socket.on("Pump_1_FEEDBACK", (data) => {
        setStatePump1(data)
             }); 
             socket.on("Pump_2_FEEDBACK", (data) => {
                setStatePump2(data)
               
                     });    
                     socket.on("Pump_3_FEEDBACK", (data) => {
                        setStatePump3(data)
                        
                             });    
                             socket.on("Pump_4_FEEDBACK", (data) => {
                                setStatePump4(data)
                                     });    
                                     socket.on("Pump_5_FEEDBACK", (data) => {
                                        setStatePump5(data)
                                             });           
// ----------------Valve State--------///
    socket.on("VF_OPENED", (data) => {
        setStateValveF(data)
         }); 
         socket.on("VA1_OPENED", (data) => {
            setStateValveA1(data)
             }); 
             socket.on("VA2_OPENED", (data) => {
                setStateValveA2(data)
                 }); 
                 socket.on("VA3_OPENED", (data) => {
                    setStateValveA3(data)
                     }); 
                     socket.on("VA4_OPENED", (data) => {
                        setStateValveA4(data)
                         }); 
                         socket.on("VA5_OPENED", (data) => {
                            setStateValveA5(data)
                             }); 
    socket.on("VB1_OPENED", (data) => {
            setStateValveB1(data)
             }); 
             socket.on("VB2_OPENED", (data) => {
                setStateValveB2(data)
                 }); 
                 socket.on("VB3_OPENED", (data) => {
                    setStateValveB3(data)
                     }); 
                     socket.on("VB4_OPENED", (data) => {
                        setStateValveB4(data)
                         }); 
                         socket.on("VB5_OPENED", (data) => {
                            setStateValveB5(data)
                             }); 
     socket.on("VC1_OPENED", (data) => {
            setStateValveC1(data)
             }); 
             socket.on("VC2_OPENED", (data) => {
                setStateValveC2(data)
                 }); 
                 socket.on("Pressure1", (data) => {
                    setStateValveC1(data)
                     }); 
                     socket.on("Pressure2", (data) => {
                        setStateValveC2(data)
                         });
                         socket.on("Pressure3", (data) => {
                            setStateValveC2(data)
                             });
                          
                 socket.on("UV_CMD", (data) => {
                    setStateUV(data)
                     });                         
 })





    




    return (
        <div className='mainsection2-container'>
            {/* -------------Status---------------- */}


            <div className="status-section">
             <Status/>
             
            </div>
            {/* -------------Control---------------- */}


            <div className="control-section">
             <Control/>
             
            </div>
            {/* --------------------Set Time------- */}
            <div className="settime">
            <img  title="Time Clean" className="settime-icon"  src={Clean} onClick={() =>  setPopupClean(true) }/>

            <Popup
             title="Set Time Clean"
            openPopup={popupClean}
            setOpenPopup={setPopupClean}
             >
            <CleanPop/> 
        </Popup>
            </div>
            
            
    <div className="model-container">
                {/* -------------------------Tank1-------------- */}
        <div className="tank1-container">
             {/* ----------- Before Tank1-------------------- */}
            
            <div className="before-tank1">

            <img className="pipe1" src ={Pipe_alight}/>
            <img className="pipe2" src ={Pipe_alight}/>
            <img title=" PUMP 1 " className="pump1"  onClick={() =>  setPopupPump1(true)} src ={statePump1 ? Pump_alight_on: Pump_alight   }/>
            
        <Popup
             title="Pump 1"
            openPopup={popupPump1}
            setOpenPopup={setPopupPump1}
             >
            <PumpPop on={'Pump_1'} emit={'Pump1'}/> 
        </Popup>
            
            <img className="pipe5" src ={Pipe_LT}/>
            <img className="pipe4" src ={Pipe_RB}/>

            <img title=' VALVE F ' className="valve0" onClick={() =>  setPopupValveF(true)}  src ={stateValveF ? Valve_on: Valve_hori  }/>

            <Popup
             title="Valve F"
            openPopup={popupValveF}
            setOpenPopup={setPopupValveF}
             >
            <ValvePop on={'VF'} emit ={'VAF'}/> </Popup>
                
            
            </div>
            {/* ------After Tank1----------- */}
            <div className="after-tank1">

            <img className="pipe6" src ={Pipe_alight}/>
            <img className="pipe8" src ={Pipe_hori}/>
            <img className="pipe10" src ={Pipe_hori}/>
            <img className="pipe9" src ={Pipe_LB}/>
            <img className="pipe7" src ={Pipe_fork}/>
            <img className="pipe11" src ={Pipe_hori}/>
            <img className="pipe12" src ={Pipe_hori}/>


            <img title=" PUMP 2 " className="pump2" onClick={() =>  setPopupPump2(true)} src ={statePump2 ? Pump_on : Pump}/>
            <Popup
             title="Pump 2"
            openPopup={popupPump2}
            setOpenPopup={setPopupPump2}
             >
            <PumpPop on={'Pump_2'} emit={'Pump2'}/> 
            </Popup>
            

            <img title=" PUMP 3 " className="pump3" onClick={() =>  setPopupPump3(true)} src ={statePump3 ? Pump_on : Pump}/>
            
            <Popup
             title="Pump 3"
            openPopup={popupPump3}
            setOpenPopup={setPopupPump3}
             >
            <PumpPop on={'Pump_3'} emit={'Pump3'}/> 
            </Popup>

            <img className="pipe15" src ={Pipe_alight}/>
            <img className="pipe16" src ={Pipe_hori}/>
            <img className="pipe13" src ={Pipe_RB}/>
            <img className="pipe14" src ={Pipe_fork}/>
            <img className="pipe18" src ={Pipe_alight}/>
            <img className="pipe17" src ={Pipe_RT}/>
           
            </div>
           {/* -------------Tank1------------ */} 

           <img title=" Feed Tank" className="tank1" src ={FeedTank} />
           <div className='leveltank1'>
           <Level  value={levelTankF} maxValue ={3} height ={170}/> 
           </div>
           
           
          {/* -------------- */}
    
           

        </div>
        {/* -----------------------Tank2-------------- */}
        <div className="tank2-container">
                {/* ----------beforeTank2------------------ */}
                <img title=" Pressure Tank 1" className='tank2' src={PressureTank}/>
                {/* <p className='label-tank2' > PRESSURE TANK 1 </p> */}
                <div className="before-tank2">

                    <img className="pipe21" src ={Pipe_hori}/>
                    <img className="pipe22" src ={Pipe_hori}/>
                    <img className="pipe19" src ={Pipe_fork_alight_right}/>
                    <img className="pipe20" src ={Pipe_LB}/>
                    <img className="pipe23" src ={Pipe_hori}/>
                    <img className="pipe24" src ={Pipe_hori}/>
                    
                         <img title=' VALVE A1 ' className="valve1" onClick={() =>  setPopupValve1(true)} src ={stateValveA1 ? Valve_on: Valve_hori  }/>
                         <Popup
                              title="Valve A1"
                              openPopup={popupValve1}
                            setOpenPopup={setPopupValve1}
                        >
                        <ValvePop on={'VA1'} emit ={'VA1'}/></Popup>
                         
                    
                    
                         <img title=' VALVE A2 ' className="valve2" onClick={() =>  setPopupValve2(true)} src ={stateValveA2 ? Valve_on: Valve_hori  }/>
                         <Popup
                              title="Valve 2"
                              openPopup={popupValve2}
                            setOpenPopup={setPopupValve2}
                        >
                        <ValvePop on={'VA2'} emit ={'VA2'}/> </Popup>
                    <img className="pipe25" src ={Pipe_fork_down}/>
                    <img className="pipe26" src ={Pipe_fork_down}/>

                    <img title=' VALVE A3 ' className="valve3" src ={stateValveA3 ? Valve_on: Valve_hori  } onClick={() =>  setPopupValve3(true) }/>

                    <Popup
                              title="Valve 3"
                              openPopup={popupValve3}
                            setOpenPopup={setPopupValve3}
                        >
                        <ValvePop on={'VA3'} emit ={'VA3'}/> </Popup>
                    <img title=' VALVE A4 '  className="valve4" src ={stateValveA4 ? Valve_on: Valve_hori  } onClick={() =>  setPopupValve4(true)}/>
                    <Popup
                              title="Valve 4"
                              openPopup={popupValve4}
                            setOpenPopup={setPopupValve4}
                        >
                       <ValvePop on={'VA4'} emit ={'VA4'}/> </Popup>

                    <img className="pipe29" src ={Pipe_alight}/>
                    <img className="pipe27" src ={Pipe_RB}/>
                    <img className="pipe28" src ={Pipe_fork_alight_left}/>
              

                    
                    

                </div>
                    {/* ----------afterTank2---------- */}
                <div className="after-tank2">

                    <img className="pipe33" src ={Pipe_hori}/>
                    <img className="pipe30" src ={Pipe_fork}/>
                    <img className="pipe31" src ={Pipe_LB}/>
                    <img className="pipe32" src ={Pipe_angle}/>


                    <img title=' VALVE A5 ' className="valve5" src ={stateValveA5 ? Valve_on: Valve_hori} onClick={() =>  setPopupValve5(true) }/>

                    <Popup
                              title="Valve A5"
                              openPopup={popupValve5}
                            setOpenPopup={setPopupValve5}
                        >
                        <ValvePop on={'VA5'} emit ={'VA5'}/> </Popup>


                    <img className="pipe35" src ={Pipe_alight}/>
                    <img className="pipe34" src ={Pipe_RT}/>
                    <p className="sensor1value">Pressure: {pressure1} bar </p>
                    <img title=' Pressure Sensor ' className="sensor1" src ={Sensor}/>
                    
                    

                </div>
               

        </div>
        {/* ---------------------------Tank3----------- */}
        <div className='tank3-container'>
            {/* ---Tank3----------- */}
        {/* ----------beforeTank2------------------ */}
        <img title='Pressure Tank 2' className='tank3' src={PressureTank}/>
        {/* <p className='label-tank3' > PRESSURE TANK 2 </p> */}

            <div className='before-tank3'>
                    <img className="pipe38" src ={Pipe_hori}/>
                    <img className="pipe39" src ={Pipe_hori}/>
                    <img className="pipe36" src ={Pipe_fork_alight_right}/>
                    <img className="pipe37" src ={Pipe_LB}/>
                    <img className="pipe40" src ={Pipe_hori}/>
                     <img className="pipe41" src ={Pipe_hori}/>


                    <img title=' VALVE B1 ' className="valve6" src ={stateValveB1 ? Valve_on: Valve_hori} onClick={() =>  setPopupValve6(true) } />
                       
                        <Popup
                              title="Valve B1"
                              openPopup={popupValve6}
                            setOpenPopup={setPopupValve6}
                        >
                        <ValvePop on={'VB1'} emit ={'VB1'}/> </Popup>

                    <img title=' VALVE B2 ' className="valve7" src ={stateValveB2 ? Valve_on: Valve_hori} onClick={() =>  setPopupValve7(true)  }/>

                    <Popup
                              title="Valve B2"
                              openPopup={popupValve7}
                            setOpenPopup={setPopupValve7}
                        >
                        <ValvePop on={'VB2'} emit ={'VB2'}/> </Popup>


                <img className="pipe42" src ={Pipe_fork_down}/>
                <img className="pipe43" src ={Pipe_fork_down}/> 


                <img title=' VALVE B3 ' className="valve8" src ={stateValveB3 ? Valve_on: Valve_hori } onClick={() =>  setPopupValve8(true)  } /> 
                <Popup
                              title="Valve B3"
                              openPopup={popupValve8}
                            setOpenPopup={setPopupValve8}
                        >
                        <ValvePop on={'VB3'} emit ={'VB3'}/> </Popup>
                <img title=' VALVE B4 'className="valve9" src ={stateValveB4 ? Valve_on: Valve_hori } onClick={() =>  setPopupValve9(true)  }/> 
                <Popup
                              title="Valve B4"
                              openPopup={popupValve9}
                            setOpenPopup={setPopupValve9}
                        >
                        <ValvePop on={'VB4'} emit ={'VB4'}/> </Popup>


                     <img className="pipe46" src ={Pipe_alight}/>
                    <img className="pipe44" src ={Pipe_RB}/>
                    <img className="pipe45" src ={Pipe_fork_alight_left}/>
            </div>

              {/* ----------afterTank3---------- */}
                <div className="after-tank3">

                    <img className="pipe50" src ={Pipe_hori}/>
                    <img className="pipe47" src ={Pipe_fork}/>
                    <img className="pipe48" src ={Pipe_LB}/>
                    <img className="pipe49" src ={Pipe_angle}/>


                    <img title=' VALVE B5 ' className="valve10" src ={stateValveB5 ? Valve_on: Valve_hori  } onClick={() =>  setPopupValve10(true)  }/>
                    <Popup
                              title="Valve B5"
                              openPopup={popupValve10}
                            setOpenPopup={setPopupValve10}
                        >
                        <ValvePop on={'VB5'} emit ={'VB5'}/> </Popup>


                    {/* <img className="pipe52" src ={Pipe_alight}/> */}
                    <img className="pipe51" src ={Pipe_RB}/>
                    

                </div>
                 {/* -------LevelTank3----- */}
                 <p className="sensor2value"> Pressure: {pressure2} bar </p>
                 <img title=' Pressure Sensor ' className="sensor2" src ={Sensor}/>
        </div>
        {/* -------------Tank4-------- */}
        <div className="tank4-container">
            {/* ------------Before Tank4--------------------*/}
                <div className="before-tank4">

                {/* <img className="pipe54" src ={Pipe_hori}/>
                */}

                </div>
            {/* --------After Tank 4---------- */}
                <div className='after-tank4'>
                {/* <img className="pipe56" src ={Pipe_alight}/>
                
                <img className="pipe58" src ={Pipe_RB}/> */}
                {/* <img className="pipe59" src ={Pipe_alight}/> */}
                <img className="pipe60" src ={Pipe_alight}/>
                
                {/* <img title=" PUMP 4 " className="pump4" src ={Pump_alight}/>
                <img title=" PUMP 5 " className="pump5" src ={Pump_alight}/> */}
                </div>
        </div>
           <img title="Raw Tank" className="tank4" src ={RawTank}/>
           {/* <p className='label-tank4' > RAW TANK </p> */}
            {/* -------LevelTank4----- */}
            <div className='leveltank4'>
            
           <Level  value={levelTankM} maxValue ={3} height ={170}/> 
  
            </div>

         {/* -------------Micro Filter-------- */}
         <div className='micro-filter-container'>
            {/* --------Before Filter-------- */}
            <div className='before-micro-filter'>
                <img className="pipe63" src ={Pipe_hori}/>
                 <img className="pipe61" src ={Pipe_RT}/>
                 {/* <img className="pipe62" src ={Pipe_fork}/> */}
                
            </div>
            {/* --------After Filter-------- */} 
            <div className='after-micro-filter'>
            <img className="pipe65" src ={Pipe_alight}/>
            <img className="pipe67" src ={Pipe_hori}/>
            <img className="pipe66" src ={Pipe_RB}/>
            <img className="pipe64" src ={Pipe_fork}/>


            <img title=' VALVE C1 ' className="valve11" src ={stateValveC1 ? Valve_on: Valve_hori} onClick={() =>  setPopupValve11(true)  }/>
            <Popup
                              title="Valve C1"
                              openPopup={popupValve11}
                            setOpenPopup={setPopupValve11}
                        >
                        <ValvePop on={'VC1'} emit ={'VC1'}/> </Popup>

            <img title=' VALVE C2 ' className="valve12" src ={stateValveC2 ? Valve_on: Valve_hori} onClick={() =>  setPopupValve12(true)  }/>
            <Popup
                              title="Valve C2"
                              openPopup={popupValve12}
                            setOpenPopup={setPopupValve12}
                        >
                        <ValvePop on={'VC2'} emit ={'VC2'}/> </Popup>


            <img title=" Pressure Pump 1 " className="pump6"  src ={statePump4?   Pump_Pressure_on:Pump_Pressure} onClick={() =>  setPopupPump4(true)}/>
            <Popup
             title="Pressure Pump 1"
            openPopup={popupPump4}
            setOpenPopup={setPopupPump4}
             >
            <PumpPop on={'Pump_4'} emit={'Pump4'}/> 
        </Popup>
            <img title=" Pressure Pump 2 " className="pump7" src ={statePump5 ?  Pump_Pressure_2_on:Pump_Pressure_2 } onClick={() =>  setPopupPump5(true)}/>
            <Popup
             title="Pressure Pump 2"
            openPopup={popupPump5}
            setOpenPopup={setPopupPump5}
             >
            <PumpPop on={'Pump_5'} emit={'Pump5'}/> 
        </Popup>
            </div>
            {/* --------Micro Filter--------*/}
            {/* <img title="Micro Filter"className='micro-filter' src={MicroFilter}/> */}
            {/* <p className='label-micro-filter' > MICRO FILTER </p> */}
         </div>
                <div className='RO-UV-CTank'>
                    {/* -----------RO Filter------------ */}
                <div className="RO-filter-container">
                {/* --------before ROFilter------------ */}
              
                
                <div className="before-ro-filter">
                    <img className="pipe53" src ={Pipe_alight}/>
                   
                    <img className="pipe71" src ={Pipe_alight}/>
                    <img className="pipe70" src ={Pipe_hori}/>
                    <img className="pipe73" src ={Pipe_hori}/>
                    <img className="pipe68" src ={Pipe_LT}/>
                    <img className="pipe72" src ={Pipe_RB}/>
                    <img className="pipe57" src ={Pipe_fork_down}/>
                     <img className="pipe69" src ={Pipe_fork}/>

                     <img title=' Pressure Sensor ' className="sensor3" src ={Sensor}/>
                     <p className="sensor3value">Pressure: {pressure3} bar </p>
                </div>
                {/* --------after ROFilter------------ */}
                
                <div className="after-ro-filter">
                <img className="pipe75" src ={Pipe_hori}/>
                <img className="pipe76" src ={Pipe_alight}/>
                <img className="pipe74" src ={Pipe_fork_down}/>
                <img className="pipe86" src ={Pipe_alight}/>
                <img className="pipe78" src ={Pipe_hori}/>
                <img className="pipe77" src ={Pipe_LT}/>
                <img className="pipe80" src ={Pipe_alight}/>
                <img className="pipe79" src ={Pipe_RB}/>
                <img className="pipe81" src ={Pipe_RT}/>



                <img className="pipe84" src ={Pipe_hori}/>
                 <img className="pipe85" src ={Pipe_alight}/>
                 <img className="pipe83" src ={Pipe_fork_down}/>
                 <img className="pipe82" src ={Pipe_LT}/>
                 <img className="pipe92" src ={Pipe_alight}/>
                 <img className="pipe87" src ={Pipe_hori}/>
                 <img className="pipe89" src ={Pipe_hori}/>
                 <img className="pipe88" src ={Pipe_fork_alight_right}/>
                 <img className="pipe91" src ={Pipe_hori}/>
                 <img className="pipe90" src ={Pipe_fork_alight_right}/>
                 <img className="pipe93" src ={Pipe_hori}/>
                 <img className="pipe94" src ={Pipe_fork_alight_right}/>
                 <img className="pipe95" src ={Pipe_RT}/>
                
                 
                
                
                </div>
                {/* -----------RO------- */}
                <div className='rofilter'>
                     <img title="RO Filter 1" className='rofilter1' src ={ROFilter}/>
                    <img title="RO Filter 2" className='rofilter2' src ={ROFilter}/>
                    <img title="RO Filter 3" className='rofilter3' src ={ROFilter}/>
                    <img title="RO Filter 4" className='rofilter4' src ={ROFilter}/>
                    {/* <p className='label-ro-filter' > RO FILTER </p> */}
                </div>
                
         </div>
           {/* -----------uv Filter------------ */}
         <div className="uv-filter-container">
                {/* --------before uvFilter------------ */}
                <div className="before-uv-filter">
                    

                
                 
                 

                </div>
                {/* --------after uvFilter------------ */}
                <div className="after-uv-filter">
                <img className="pipe96" src ={Pipe_hori}/>
                <img className="pipe97" src ={Pipe_LB}/>
                    
                </div>
                {/* -----------uv------- */}
                <img title='UV Water Filter' className='uvfilter'src={stateUV?  UVFilterRun:UVFilter}/>
                {/* <p className='label-uv-filter' > UV FILTER </p> */}
          </div>
                {/* ------------------Tank 5  Water Tank------------------------------ */}

                  <div className="water-tank">

                    <img title='Water Tank' className="watertank" src ={RawTank}/>
                    {/* <p className='label-watertank' > WATER TANK </p> */}
                  </div>
                  <div className='leveltank5'>
                  <Level  value={levelTankC} maxValue ={3} height ={170}/>  
                </div>
       

    </div>
                </div>
            
            
       
</div>
    )
}

export default MainSection2
