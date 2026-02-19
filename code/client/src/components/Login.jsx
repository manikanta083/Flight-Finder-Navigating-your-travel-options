import React, { useContext, useState } from 'react'
import { GeneralContext } from '../context/GeneralContext';

const Login = ({setIsLogin}) => {

  const { login } = useContext(GeneralContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) =>{
    e.preventDefault();
    await login(email, password);
  }
  return (
    <form className="authForm" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="form-floating mb-3 authFormInputs">
            <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" 
                                                                  value={email} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="floatingInput">Email address</label>
        </div>
            <div className="form-floating mb-3 authFormInputs">
            <input type="password" className="form-control" id="floatingPassword" placeholder="Password" 
                                                                  value={password} onChange={(e) => setPassword(e.target.value)} /> 
            <label htmlFor="floatingPassword">Password</label>
        </div>
        <button type="submit" className="btn btn-primary">Sign in</button>

        <p>Not registered? <span onClick={()=> setIsLogin(false)}>Register</span></p>
    </form>
  )
}
export default Login
