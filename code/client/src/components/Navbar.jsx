import React, { useContext } from 'react'
import '../styles/Navbar.css';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../context/GeneralContext';

const Navbar = () => {

    const navigate = useNavigate();
    const usertype = localStorage.getItem('userType');

    const {logout} = useContext(GeneralContext);

  return (
    <>
        <div className="navbar">

        {!usertype ? 
        
            <>
                <h3 >SB Flights</h3>

                <div className="nav-options" >
                    <span className="nav-link" onClick={()=>navigate('/')}>Home</span>
                    <span className="nav-link" onClick={()=>navigate('/auth')}>Login</span>
                </div>
            
            </>
        :
        
        <>
        {usertype === 'customer' ? 
        
        <>
            <h3 >SB Flights</h3>

            <div className="nav-options" >

                <span className="nav-link" onClick={()=>navigate('/')}>Home</span>
                <span className="nav-link" onClick={()=>navigate('/bookings')}>Bookings</span>
                <span className="nav-link" onClick={logout}>Logout</span>

            </div>
        </>
            :  usertype === 'admin' ?

                    <>
                        <h3 >SB Flights (Admin)</h3>
                        <div className="nav-options" >

                            <span className="nav-link" onClick={()=>navigate('/admin')}>Home</span>
                            <span className="nav-link" onClick={()=>navigate('/all-users')}>Users</span>
                            <span className="nav-link" onClick={()=>navigate('/all-bookings')}>Bookings</span>
                            <span className="nav-link" onClick={()=>navigate('/all-flights')}>Flights</span>
                            <span className="nav-link" onClick={logout}>Logout</span>
                        </div> 
                    </>
            
                : usertype === 'flight-operator' ?
                    <>
                        <h3 >SB Flights (Operator)</h3>
                        <div className="nav-options" >

                            <span className="nav-link" onClick={()=>navigate('/flight-admin')}>Home</span>
                            <span className="nav-link" onClick={()=>navigate('/flight-bookings')}>Bookings</span>
                            <span className="nav-link" onClick={()=>navigate('/flights')}>Flights</span>
                            <span className="nav-link" onClick={()=>navigate('/new-flight')}>Add Flight</span>
                            <span className="nav-link" onClick={logout}>Logout</span>
                        </div> 
                    </>
            
                :

                    ""

        }
        </>
        }
        </div>
    
    </>
  )
}

export default Navbar
