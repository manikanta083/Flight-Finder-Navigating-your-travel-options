import React, { useContext, useState } from 'react'
import { GeneralContext } from '../context/GeneralContext';

const Register = ({setIsLogin}) => {

  const { register } = useContext(GeneralContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) =>{
    e.preventDefault();
    setError('');
    
    // Validation
    if (!username || !email || !password || !usertype) {
      setError('All fields are required');
      return;
    }
    
    await register(username, email, password, usertype);
  }
  return (
    <form className="authForm" onSubmit={handleRegister}>
        <h2>Register</h2>
        {error && <p style={{color: 'red', marginBottom: '10px'}}>{error}</p>}
        <div className="form-floating mb-3 authFormInputs">
            <input type="text" className="form-control" id="floatingInput" placeholder="username"
                                                       value={username} onChange={(e)=> setUsername(e.target.value)} />
            <label htmlFor="floatingInput">Username</label>
        </div>
        <div className="form-floating mb-3 authFormInputs">
            <input type="email" className="form-control" id="floatingEmail" placeholder="name@example.com"
                                                       value={email} onChange={(e)=> setEmail(e.target.value)} />
            <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating mb-3 authFormInputs">
            <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
                                                       value={password} onChange={(e)=> setPassword(e.target.value)} /> 
            <label htmlFor="floatingPassword">Password</label>
        </div>
        <select className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" 
                                                      value={usertype} onChange={(e)=> setUsertype(e.target.value)}>
          <option value="">User type</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
          <option value="flight-operator">Flight Operator</option>
        </select>
        
        <button type="button" className="btn btn-primary" onClick={handleRegister}>Sign up</button>
        <p>Already registered? <span onClick={()=> setIsLogin(true)}>Login</span></p>
    </form>
  )}
export default Register;