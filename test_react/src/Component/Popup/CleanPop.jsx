import { useState,useEffect } from 'react';
import {
  Button, Col, Container, Form,
  FormGroup, Input, Label
} from 'reactstrap';
import './CleanPop.css';
import io from "socket.io-client";
let socket;
const CONNECTION_PORT = "localhost:5000/";
  

function CleanPop() {

  const[time1,setTime1] =useState(null)
  const[time2,setTime2] =useState(null)
  const[time3,setTime3] =useState(null)
  const[time4,setTime4] =useState(null)
  


  /// Connect io
useEffect(() => {
  socket = io(CONNECTION_PORT);
}, [CONNECTION_PORT]);


const btnSet1 = async () => {
               
  await socket.emit("Clean_Forward_1",time1);
          };
          const btnSet2 = async () => {
               
            await socket.emit("Clean_Forward_2",time2);
                    };
                    const btnSet3 = async () => {
               
                      await socket.emit("Clean_Forward_3",time3);
                              };
                              const btnSet4 = async () => {
               
                                await socket.emit("Clean_Forward_4",time4);
                                        };
    
    return (
        <Container className='motorpop'>
     

        <Form >
          <div className='select-mode'>
          <Col>
          <Label>Tank 1 </Label>
            <FormGroup>
            <Label>Clean Forward </Label>
              <Input className='setspeed' placeholder="0 minutes" onChange={ (e)=>setTime1(e.target.value)} />
              <Button className='btnset' onClick={btnSet1} > Set </Button>
            </FormGroup>
            <FormGroup>
            <Label> Clean Reverse </Label>
              <Input className='setspeed' placeholder="0 minutes" onChange={ (e)=>setTime2(e.target.value)} />
              <Button className='btnset' onClick={btnSet2} > Set </Button>
            </FormGroup>
          </Col>
          <Col>
         
           
          </Col>
          </div>
          
          <Col>
          <div className="motor-status">
          <Label>Tank 2 </Label>
            
            <FormGroup>
            <Label>Clean Forward </Label>
              <Input className='setspeed' placeholder="0 minutes" onChange={ (e)=>setTime3(e.target.value)} />
              <Button className='btnset' onClick={btnSet3} > Set </Button>
            </FormGroup>
            <FormGroup>
            <Label> Clean Reverse </Label>
              <Input className='setspeed' placeholder="0 minutes" onChange={ (e)=>setTime4(e.target.value)} />
              <Button className='btnset' onClick={btnSet4} > Set </Button>
            </FormGroup>
          </div>
            
          </Col>
         
        </Form>
      </Container>
    )
}

export default CleanPop
