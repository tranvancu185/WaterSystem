import LoginForm from './LoginForm/FormSignIn'
import RegisterForm from './LoginForm/FormSignup'
import { AuthContext } from '../../context/AuthContext'
import { useContext } from 'react'
import { Redirect } from 'react-router-dom'
import Spinner from 'react-bootstrap/Spinner'
import logoLogin from '../../Component/img/water.svg'
import'./Auth.css'

const Auth = ({ authRoute }) => {
	const {
		authState: { authLoading, isAuthenticated }
	} = useContext(AuthContext)

	let body

	if (authLoading)
		body = (
			<div className='d-flex justify-content-center mt-2'>
				<Spinner animation='border' variant='info' />
			</div>
		)
	else if (isAuthenticated) return <Redirect to='/home' />/// dang nhap thanh cong dua toi home
	else
		body = (
			<>
				{authRoute === 'login' && <LoginForm />}
				{authRoute === 'register' && <RegisterForm />}
			</>
		)

	return (
    <div className="form-login">
        <div className='login-form-container'>
			<img className='login-logo' src={logoLogin}/>
            <div className='auth-form'>
					{body}
				
			</div>
		</div>
    </div>
		
	)
}

export default Auth