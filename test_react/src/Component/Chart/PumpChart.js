import React, { useState } from 'react';
import {
  Container, Col, Form,
  FormGroup, Label, Row,Button  
} from 'reactstrap';

import './PumpChart.css';
import PieChart from './PieChart';

const MotorChart = () => {
  const [pump1, setPump1] = useState(0);
  const [pump2, setPump2] = useState(0);
  const [pump3, setPump3] = useState(0);
  const [pump4, setPump4] = useState(0);
  const [pump5, setPump5] = useState(0);
  

  const randompump1Value = () => {
    const pump1Value = Math.floor(Math.random() * 101);
    setPump1(pump1Value);
    setPump2(pump1Value);
    setPump3(pump1Value);
    setPump4(pump1Value);
    setPump5(pump1Value);
    
  }

 

  return (
    <Container className="pump-chart-contain">
      <Form className="pump-form">
        <h2 className="pump-chart-title">Pump Status</h2>
        <Col className="line1">
        <FormGroup className="pump-1">
          <Label>Pump 1</Label>
          <PieChart
          progress={pump1}
          size={160}
          strokeWidth={25}
         />
        </FormGroup>
        
        <FormGroup className="pump-2">
          <Label>Pump 2</Label>
          <PieChart
          progress={pump2}
          size={160}
          strokeWidth={25}
         />
          </FormGroup>
          <FormGroup className="pump-3">
          <Label>Pump 3</Label>
          <PieChart
          progress={pump3}
          size={160}
          strokeWidth={25}
         />
       
        </FormGroup>
        </Col>
        <Col className="line2">
        
        <FormGroup className="pump-4">
          <Label>Pump 4</Label>
          <PieChart
          progress={pump4}
          size={160}
          strokeWidth={25}
         />
         
        </FormGroup>

        <FormGroup className="pump-5">
          <Label>Pump 5</Label>
          <PieChart
          progress={pump5}
          size={160}
          strokeWidth={25}
         />
         
        </FormGroup>

        </Col>
        
        <Button onClick={randompump1Value}>
          Random
        </Button>
        
        
      </Form>
    </Container>
  );
}

export default MotorChart;