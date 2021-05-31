import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import { useState, useContext } from 'react'
import {AuthContext} from '../../../context/AuthContext'
import AlertMessage from '../AlertMessage'
import './FormSignIn.css'


const LoginForm = () => {
	// Context
	const { loginUser } = useContext(AuthContext)

	// Local state
	const [loginForm, setLoginForm] = useState({
		username: '',
		password: ''
	})

	const [alert, setAlert] = useState(null)

	const { username, password } = loginForm

	const onChangeLoginForm = event =>
		setLoginForm({ ...loginForm, [event.target.name]: event.target.value })

	const login = async event => {
		event.preventDefault()

		try {
			const loginData = await loginUser(loginForm)
			if (!loginData.success) {
				setAlert({ type: 'danger', message: loginData.message })
				setTimeout(() => setAlert(null), 5000)
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<>
			<Form className='login-form' onSubmit={login}>
				<AlertMessage info={alert} />
                

                <Form.Group>
					<Form.Control
                        className='username-input'
						type='text'
						placeholder='Username'
						name='username'
						required
						value={username}
						onChange={onChangeLoginForm}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Control
                        className='password-input'
						type='password'
						placeholder='Password'
						name='password'
						required
						value={password}
						onChange={onChangeLoginForm}
					/>
				</Form.Group>
				<Button variant='success' type='submit' className='login-btn'>
					Login
				</Button>

                <a href='/register'>
				Don't have an account?
				
			    </a>
                
				
			</Form>
			
		</>
	)
}

export default LoginForm