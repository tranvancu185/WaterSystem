
import { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import {
  NavLink
} from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import Logo from './img/liquid.svg';
import logoutIcon from './img/logout.svg';
import './Navbar.css';


function Navbar(){
  const[click,setClick] =useState(false);
  const handleClick = () => setClick(!click);

  const {
		authState: {
			user: { username }
		},
		logoutUser
	} = useContext(AuthContext)

	const logout = () => logoutUser()
    return(
        <>
        
        <nav className='navbar'>
            <div className='navbar-container'>
            
                <NavLink to='/' className='navbar-logo'  >
                WATER TREATMENT SYSTEM  <img className = 'nav-logo'src={Logo}/>
                </NavLink>
               
                <div className='menu-icon' onClick={handleClick}>
              <span class="material-icons md-48">{click ? 'close' : 'menu' }</span>
                </div>
                <ul className = {click ? 'nav-menu active':'nav-menu'}>
                  <li className='nav-item'>
                    <NavLink to='/home'className ='nav-NavLink' >
                    <span class="material-icons md-48">home</span> 
                     Home
                    </NavLink>
                  </li>
                  <li className='nav-item'>
                    <NavLink to='/dashboard'className ='nav-NavLink'>
                    <span class="material-icons md-48">insights</span> 
                      Dashboard
                    </NavLink>
                  </li>
                  {/* <li className='nav-item'>
                    <NavLink to='/P-T' className ='nav-NavLink' >
                    <span class="material-icons md-48">settings_power</span>  
                      Power-Temperature
                    </NavLink>
                  </li> */}
                  <li className='nav-item'>
                    <NavLink to='/report' className ='nav-NavLink' >
                    <span class="material-icons md-48">description</span> 
                      Report
                    </NavLink>
                  </li>
                  
                  <li className='nav-item'>
                 
					      {/* <label>Welcome {username}</label> */}
					                  	
					        
					      <Button
					    	  // className ='nav-NavLink' 
					      	className='logout-btn'
					      	onClick={logout}
				        	>
						      <img
						    	src={logoutIcon}
							    alt='logoutIcon'
						    	width='32'
						    	height='32'
							  className='mr-2'
					    	/>
						
				      	</Button>
				
                  </li>
                </ul>
            </div>
            
        </nav>
       
    </>
    )
}
export default Navbar

