import './Footer.css';
function Footer() {
    return (
      <div classNameName='footer'>
        
        <div className='footer-link-items'>
            <h2>Contact Us</h2>
                
                <li>
                <span className="material-icons">call</span>
                     <p><a href="#">+84 987 515 600  Mr.Phuc</a>
                         <br />
                         <a href="#">+84 349 130 643  Mr.Sy</a></p>
                 </li>
                 <li>
                 <span className="material-icons">mail_outline</span>
                     <p><a href="#">diachiemail@gmail.com</a></p>
                </li>
                <li>
                 <span className="material-icons">location_on</span>
                     <p><a href="#">Destination</a></p>
                </li>
              <small className='website-rights'>TS-HP © 2021</small>
              
          </div>
         
      </div>  
    )
}
export default Footer;