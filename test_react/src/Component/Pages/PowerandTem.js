import { useEffect, useState ,useContext} from 'react';
import { Col, Container } from 'reactstrap';
import PowerData from '../ElectricPower/PowerData';
import Temperature from '../TemperatureSection/Temperature';


import './PT.css';






function PowerandTem() {
   


    
   

    return (
        <Container className="PTcontainer">
            
            <Col className="power-container">
            <PowerData 
           
            />
            </Col>
            <Col className="temperature-container">
            <Temperature  />
            
            </Col>
            
        </Container>
    )
}

export default PowerandTem
