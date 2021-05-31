import {useState,Component,useEffect} from 'react'
import './StatusData.css'

import {
    Container, Col, Form,
    FormGroup, Label, Input,Button
   
  } from 'reactstrap';

  // import Select from 'react-select'
  import io from "socket.io-client";
  let socket;
  const CONNECTION_PORT = "localhost:5000/";

function StatusData() {


    const [stateP1,setStateP1] = useState([]);


     /// Connect 
     useEffect(() => {
        socket = io(CONNECTION_PORT);
    }, [CONNECTION_PORT]);
      ///State
    useEffect(() => {
      socket.on("pump1", (data) => {
         
          
          });
   });

    return (
        <div>
             
            <Form className='state-container'>
            <h2 className='label-status'>Status Data</h2>
               
                <FormGroup className='motor-state-container' >
                <Col >
                <ul className ='motor-list'>Motor
                <li>Motor 1</li>
                <li>Motor 2</li>
                <li>Motor 3</li>
                <li>Motor 4</li>
                <li>Motor 5</li>
                </ul>
                </Col>
                <Col >
                <ul className='motor-state'>Mode
                <li>Motor 1</li>
                <li>Motor 2</li>
                <li>Motor 3</li>
                <li>Motor 4</li>
                <li>Motor 5</li>
                </ul>
                </Col>
                </FormGroup>
                <FormGroup className="valve-state-container">
                <Col >
                <ul className ='valve-list'>Valve
                <li>Valve 1</li>
                <li>Valve 2</li>
                <li>Valve 3</li>
                <li>Valve 4</li>
                <li>Valve 5</li>
                <li>Valve 6</li>
                </ul>
                </Col>
                <Col >
                <ul className='valve-state'>Mode
                <li>Valve 1</li>
                <li>Valve 2</li>
                <li>Valve 3</li>
                <li>Valve 4</li>
                <li>Valve 5</li>
                <li>Valve 6</li>
                </ul>
                </Col>
                </FormGroup>
                <FormGroup className="valve-state-container">
                <Col >
                <ul className ='valve-list' >Valve
                <li>Valve 7</li>
                <li>Valve 8</li>
                <li>Valve 9</li>
                <li>Valve 10</li>
                <li>Valve 11</li>
                <li>Valve 12</li>
                <li>Valve 13</li>
                </ul>
                </Col>
                <Col >
                <ul className='valve-state' >Mode
                <li>Valve 7</li>
                <li>Valve 8</li>
                <li>Valve 9</li>
                <li>Valve 10</li>
                <li>Valve 11</li>
                <li>Valve 12</li>
                <li>Valve 13</li>
                </ul>
                </Col>
                </FormGroup>
                
            </Form>
            
        </div>
    )
}

export default StatusData
