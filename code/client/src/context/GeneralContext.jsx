import React, { createContext, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const GeneralContext = createContext();

const GeneralContextProvider = ({children}) => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');

  const [ticketBookingDate, setTicketBookingDate] = useState();

  const inputs = {username, email, usertype, password};


  const navigate = useNavigate();

  const login = async (email, password) =>{
    try{
      const loginInputs = {email, password}
      console.log("Logging in with:", loginInputs);
        await axios.post('http://localhost:6001/login', loginInputs)
        .then( async (res)=>{
            console.log("Login successful:", res.data);
            localStorage.setItem('userId', res.data._id);
            localStorage.setItem('userType', res.data.usertype);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('email', res.data.email);

            if(res.data.usertype === 'customer'){
                navigate('/');
            } else if(res.data.usertype === 'admin'){
                navigate('/admin');
            } else if(res.data.usertype === 'flight-operator'){
              navigate('/flight-admin');
            }
        }).catch((err) =>{
            alert("login failed!!");
            console.log("Login error:", err.response?.data || err.message);
        });

    }catch(err){
        console.log("Login catch error:", err);
    }
  }
  
  const register = async (username, email, password, usertype) =>{
    try{
        const inputs = {username, email, usertype, password}
        console.log("Registering with:", inputs);
      // Register, then redirect user to login page (do not auto-login)
      await axios.post('http://localhost:6001/register', inputs)
      .then( async (res)=>{
        console.log("Registration successful:", res.data);
        // Do not store credentials or auto-login after registration
        // Send user to authentication page to login manually
        alert('Registration successful. Please login to continue.');
        navigate('/auth');
      }).catch((err) =>{
        const errorMsg = err.response?.data?.message || err.message || "Registration failed";
        alert(errorMsg);
        console.log("Registration error:", err.response?.data || err.message);
      });
    }catch(err){
        console.log("Registration catch error:", err);
    }
  }



  const logout = async () =>{
    
    localStorage.clear();
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorage.removeItem(key);
      }
    }
    
    navigate('/');
  }



  return (
    <GeneralContext.Provider value={{login, register, logout, username, setUsername, email, setEmail, password, setPassword, usertype, setUsertype, ticketBookingDate, setTicketBookingDate}} >{children}</GeneralContext.Provider>
  )
}

export default GeneralContextProvider
