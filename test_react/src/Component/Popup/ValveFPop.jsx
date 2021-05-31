import { useEffect, useState } from 'react';
import {
  Button, Col, Container, Form,
  FormGroup, Input, Label, Row
} from 'reactstrap';
import io from "socket.io-client";
import greenlightoff from '../img/Off_Green.png';
import redlightoff from '../img/Off_Red.png';
import greenlighton from '../img/On_Green.png';
import redlighton from '../img/On_Red.png';
import './ValvePop.css';
    let socket;
    const CONNECTION_PORT = "localhost:5000/";
  

function ValvePop(props) {

    const[modeSet,setModeSet] =useState(null)
    const [mode,setMode] = useState();
    const [opened,setOpened] = useState();
    const [closed,setClosed] = useState();
    const [fault,setFault] = useState();



    /// Connect 
    useEffect(() => {
      socket = io(CONNECTION_PORT);
  }, [CONNECTION_PORT]);
    ///State
  useEffect(() => {
    socket.on(`${props.on}_MODE`, (data) => {
      console.log(data)
     if(data===2)
     {setMode('AUTO')}
     else if(data===1)
     {setMode('MAN')}
      });
      socket.on(`${props.on}_OPENED`, (data) => {
        setOpened(data);
        
        });
       socket.on(`${props.on}_CLOSED`, (data) => {
          setClosed(data);
          
          });
          socket.on(`${props.on}_FAULT`, (data) => {
            setFault(data);
            
            });
 });

    ///Mode
    const btnSetClick =async()=>{
        
      await socket.emit(`${props.emit}_MODE`,modeSet)}

    
    ///Set Open
    const btnOpenClick =async()=>{
     
      await socket.emit('Button',`${props.emit}_OPEN`)}
      ///Set Close
    const btnCloseClick =async()=>{
        
      await socket.emit('Button',`${props.emit}_CLOSE`)}
      ///Set Reset
    const btnResetClick =async()=>{
        await socket.emit('Button',`${props.emit}_RESET`)}
       
    
    return (
        <Container>
     

        <Form className='valvepop'>
        <Row form>
          <div className='select-mode'>
          <Col >
            <FormGroup >
              
              <Label>Mode :{mode}</Label>
              
             
             
            </FormGroup>
          </Col>
          <Col >
            <FormGroup >

              <Label>Set Mode </Label>
              <Input className='valve-select-mode' type="select" name="Mode" id="modeSelect" onChange={(e)=>setModeSet(e.target.value)}>
              <option value ='2'> Auto </option>
             <option value ='1'> Man </option>
             </Input>
             <Button onClick={btnSetClick} className ='btnset'> SET </Button>
             
             
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
            <div className="controlbtn">
                <Label>Control  </Label>
                <Button className='btnopen'  onClick={btnOpenClick} >Open</Button> {' '}
                <Button className='btnclose' onClick={btnCloseClick} >Close</Button> 
                <Button className='btnreset'onClick={btnResetClick} >Reset</Button>
              </div>
            </FormGroup>
          </Col>
          </div>
          
          
        </Row>
        <Row form>
          <Col>
            <FormGroup>
            <div className='valve-status-light'>
            


            <Label>Opened</Label>
            <img className="valveopenlight" src ={opened? greenlighton : greenlightoff}/>
             <Label>Closed</Label>
            <img className="valvecloselight" src ={closed ? greenlighton : greenlightoff}/>


             <Label> Fault </Label>
            <img className="valvefaultlight" src ={fault ?  redlighton : redlightoff } />
             </div>
            </FormGroup>
          </Col>
        </Row>
         
        </Form>
      </Container>
    )
}

export default ValvePop
