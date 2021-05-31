import React from 'react';
import { Container, Row } from 'reactstrap';
import '../../App.css';
import Footer from '../Footer/Footer';
import MainSection from '../MainSection/MainSection';
import StatusData from '../StatusSection/StatusData';

    

function Home() {

   

    return (
        <div>
            <Container>
            <MainSection/>


            <Row>
            <StatusData/>
            </Row>


            <Footer/>
            </Container>
            
        </div>
    )
}
export default Home
