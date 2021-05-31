import React from 'react'
import {
    Container, Col, Form,
    FormGroup, Label, Row   
  } from 'reactstrap';

import './Dashboard.css'
import MultiLevel from '../Chart/MultiLevelChart';
import MotorChart from '../Chart/PumpChart';
import Pressure from '../Chart/PressureChart'

function Dashboard() {
    return (
        <Container className='dashboard'>
            <Row className="multilevel" >
                <MultiLevel/>
                <Pressure/>
            </Row>
            <Row className="motorchart">
                <MotorChart/>
                
            </Row>
            <Row className="pressurechart">
                
            </Row>
        </Container>
        
    )
}

export default Dashboard
