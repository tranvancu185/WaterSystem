import  { useState,useEffect } from "react";
import "./Temperature.css";
import io from "socket.io-client";
import {
    Container, Col, Form,
    FormGroup, Label, Input,Button,Row
   
  } from 'reactstrap'
  
  import useClock from '../hooks/useClock'
  import light_on from '../img/lightbulb.svg'
  import light_off from '../img/lightbulb (1).svg'

  let socket;
  const CONNECTION_PORT = "localhost:5000/";


function Tem () {
  
///
  const[temperature,setTemperature]=useState([])
  const [temperatureSet, setTemperatureSet] = useState(null);
  const [temperatureColor, setTemperatureColor] = useState("cold");
  const { timeString } = useClock();
  const[inputTemp,setInputTemp] = useState(null)
  const [sys,setSys] = useState(null);
  const [sysSet,setSysSet] = useState(null);
  const[lightState,setLightState] = useState(false);
    /// Connect 
    useEffect(() => {
        socket = io(CONNECTION_PORT);
    }, [CONNECTION_PORT]);


    useEffect(() => {
         socket.on("temperature", (data) => {
            
              setTemperature(data.Tp)
              setTemperatureSet(data.N)
              
              if(data.CM==1)
              {setSys('COOLING')}
              else if (data.CM==2)
              {setSys('HEATING')}
              
             });
      });



  ///// Set values 
  const setMode=async() => {
    
    
    await socket.emit("sysMode", sysSet);


  }

  const setTemp =async ()=>{
   await socket.emit("temperatureSet", inputTemp);

  }


 const setOn = async ()=>{
  setLightState(true)
  await socket.emit("lightSet", '1')

 }
 const setOff = async ()=>{
  setLightState(false)
  await socket.emit("lightSet", '0')
   
}
 
 
  return (
    <Container className="tem-container">
      <Form >
      <h3 className="label-tem" for ="tem-container" >Temperature</h3>

      

      <Col className='temperature' >
      <Row>
        <FormGroup className="temperature-display-container">
        <Label for="temperature-display-container">CURRENT TEMPERATURE </Label>
        <div className={`temperature-value-display ${temperatureColor}`}>
                {temperature/10}°C
        </div>
        <p className="temperature-mode"> MODE: {sys} </p>
        <div className="clock">
        <p className="clock__time">{timeString}</p>
        </div> 
        </FormGroup>
      </Row>
      
      </Col>
      


      <Col className= 'selectmode'>
        
        <Row>
            <FormGroup>
            <Label>SET SYS:</Label>
              <select className='sys-select-mode'   onChange={(e)=>{setSysSet(e.target.value)}}>
             <option value='0'>Auto</option>
             <option value='1'>Cooling</option>
             <option value='2'>Heating</option>
             </select>
            </FormGroup>
           
        </Row>
        <Button className='btn-setmode' onClick={setMode}> Set </Button>
        <Row>
      <FormGroup className='set-tem-container'>
      <Label for='set-tem-container' >SET TEMPERATURE</Label>
      <div className={`temperature-set-display ${temperatureColor}`}>
                {temperatureSet/10}°C
        </div>
      </FormGroup>
      </Row>
      <Row>
        <FormGroup className="settem-container">
        
        <Input className='input-settem' onChange={(e)=>{setInputTemp(e.target.value*10)}}/>
        <Button className='btn-settem' onClick={setTemp}>SET</Button>
      </FormGroup>
      </Row>

          
      </Col>
      <Row>
        <FormGroup className="light-container">
        
        <img className="light" src={lightState ? light_on : light_off} />
        <Button className='btn-on' onClick={setOn}>ON</Button>
        <Button className='btn-off' onClick={setOff}>OFF</Button>
      </FormGroup>
      </Row>
          
      
    
    
      </Form>
       
    
    </Container>
  );
};

export default Tem;