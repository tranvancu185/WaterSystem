import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Test from './Component/Chart/PressureChart';
import Dashboard from "./Component/Pages/Dashboard";
import Home from "./Component/Pages/Home";
import Landing from './Component/Pages/Landing';
import PowerandTem from "./Component/Pages/PowerandTem";
import Report from "./Component/Pages/Report";
import ProtectedRoute from './Component/routing/ProtectedRoute';
import AuthContextProvider from './context/AuthContext';
import MqttContextProvider from './context/MqttContext';
import PlanConTextProvider from './context/PlanContext';
import Auth from './features/Auth/Auth';


function App() {
  
 
  return (
    <AuthContextProvider>
      <PlanConTextProvider>
        <MqttContextProvider>
          

        
      <Router>
    
      <Switch>
      <Route exact path='/' component={Landing} />
						<Route
							exact
							path='/login'
							render={props => <Auth {...props} authRoute='login' />}
						/>
						<Route
							exact
							path='/register'
							render={props => <Auth {...props} authRoute='register' />}
						/>
        <ProtectedRoute  exact path ='/home' exact component ={Home} />
        <ProtectedRoute  exact path ='/dashboard' component ={Dashboard} />
        <ProtectedRoute exact path='/test' component={Test} />
        
        <ProtectedRoute  exact path ='/P-T' exact component ={PowerandTem} />
        
        <ProtectedRoute  exact path ='/report' exact component ={Report} />
        
      </Switch>
    </Router>
      </MqttContextProvider>
    </PlanConTextProvider>

   </AuthContextProvider>
      
  );
}

export default App;
