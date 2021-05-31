import greenlightoff from '../img/Off_Green.png';
import greenlighton from '../img/On_Green.png';
import redlightoff from '../img/Off_Red.png';
import redlighton from '../img/On_Red.png';
import yellowlightoff from '../img/Off_Yellow.png';
import yellowlighton from '../img/On_Yellow.png';
import {useState, useEffect} from 'react'
import './Status.css'
import {Container,Row,Col,Label,Button} from 'reactstrap';
import io from "socket.io-client";
  let socket;
  const CONNECTION_PORT = "localhost:5000/";
  

function StatusForm() {
    const[mode,setMode] =useState();
    const[run,setRun] =useState(false);
    const[fault,setFault] =useState(false);
    const[warn,setWarn] =useState(false);
    

    /// Connect 
    useEffect(() => {
        socket = io(CONNECTION_PORT);
    }, [CONNECTION_PORT]);
      ///State
    useEffect(() => {
  
      ////
      socket.on("MODE", (data) => {
        if(data===2)
        {setMode('AUTO')}
        else if(data===1)
        {setMode('MAN')}
        console.log(mode)
                 });
                 socket.on("System_Status", (data) => {
                    setRun(data);
                    
                    });
                 socket.on("Pump_1_FEEDBACK", (data) => {
                        setWarn(data);
                        
                        });
                 socket.on("Pump_1_FEEDBACK", (data) => {
                        setFault(data);
                            
                     });


                })
       ///Set Start
    const btnEmer =async()=>{
      await 
      socket.emit('Button','Emergency')}         

    return (
        <Container className='statusForm'>
            {/* <h2 className='titleStatus'> SYSTEM STATUS </h2> */}
            <Col>
             <div className="status-light" >
        
            <Label> Running </Label>
            <img className="greenlight" src ={run ? greenlighton : greenlightoff}/>
            
            <Label> Warning </Label>
            <img className="yellowlight" src ={warn ? yellowlighton : yellowlightoff}/>
            
            <Label> Error </Label>
            <img className="redlight" src ={fault ?  redlighton : redlightoff } />
        
            </div>
            </Col>
            <Col className ='sys-mode'>

            <a className='system-mode'>Mode : {mode}</a> 
            
            </Col>
            <Button  className='btn-sys-emer' onClick={btnEmer}>EMERGENCY</Button>
           
        </Container>
    )
}

export default StatusForm
