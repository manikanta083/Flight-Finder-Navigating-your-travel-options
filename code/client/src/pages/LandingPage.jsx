import React, { useContext, useEffect, useState } from 'react'
import '../styles/LandingPage.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../context/GeneralContext';

const LandingPage = () => {

  const [error, setError] = useState('');
  const [checkBox, setCheckBox] = useState(false);
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(()=>{
    if(localStorage.getItem('userType') === 'admin'){
      navigate('/admin');
    } else if(localStorage.getItem('userType') === 'flight-operator'){
      navigate('/flight-admin');
    }
  }, [navigate]);

  const [Flights, setFlights] = useState([]);
  const {setTicketBookingDate, logout} = useContext(GeneralContext);
  const userId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');

  const fetchFlights = async (e) => {
    if(e) e.preventDefault();
    
    setLoading(true);
    setError("");
    
    try {
      console.log("Search button clicked!");
      console.log("Departure:", departure, "Destination:", destination, "Date:", departureDate);
      
      if(checkBox){
        if(departure === "" || destination === "" || !departureDate || !returnDate){
          setError("Please fill all the inputs");
          setLoading(false);
          return;
        }
        const date = new Date();
        const date1 = new Date(departureDate);
        const date2 = new Date(returnDate);
        if(!(date1 > date && date2 > date1)){
          setError("Please check the dates");
          setLoading(false);
          return;
        }
      } else {
        if(departure === "" || destination === "" || !departureDate){
          setError("Please fill all the inputs");
          setLoading(false);
          return;
        }
        const date = new Date();
        const date1 = new Date(departureDate);
        if(!(date1 >= date)){
          setError("Please check the dates");
          setLoading(false);
          return;
        }
      }
      
      console.log("Fetching flights from API...");
      const response = await axios.get('http://localhost:6001/fetch-flights');
      console.log("Flights fetched:", response.data);
      setFlights(response.data);
      setError("");
      
    } catch(err) {
      console.error("Fetch error:", err.message);
      setError("Failed to fetch flights. Make sure the backend is running!");
    } finally {
      setLoading(false);
    }
  }

  const handleTicketBooking = async (id, origin, destination) =>{
    if(!userId){
      alert('Please login first to book a flight');
      navigate('/auth');
      return;
    }
    if(origin === departure){
      setTicketBookingDate(departureDate);
      navigate(`/book-flight/${id}`);
    } else if(destination === departure){
      setTicketBookingDate(returnDate);
      navigate(`/book-flight/${id}`);
    }
  }

  return (
    <div className="landingPage">
        {/* TOP NAV - FIXED OUTSIDE SCROLL */}
        <div className="topNavBar">
          {userType ? (
            // Logged in - show Home, Bookings, Logout
            <>
              <button className="navBtn" onClick={() => navigate('/')}>Home</button>
              <span className="navSeparator">|</span>
              <button className="navBtn" onClick={() => navigate('/bookings')}>Bookings</button>
              <span className="navSeparator">|</span>
              <button className="navBtn logoutBtn" onClick={logout}>Logout</button>
            </>
          ) : (
            // Not logged in - show Home, Login
            <>
              <button className="navBtn" onClick={() => navigate('/')}>Home</button>
              <span className="navSeparator">|</span>
              <button className="navBtn" onClick={() => navigate('/auth')}>Login</button>
            </>
          )}
        </div>

        <div className="landingHero">

          <div className="landingHero-title">
            <h1 className="banner-h1">Embark on an Extraordinary Flight Booking Adventure!</h1>
            <p className="banner-p">Unleash your travel desires and book extraordinary Flight journeys that will transport you to unforgettable destinations, igniting a sense of adventure like never before.</p>     
          </div>

          <div className="Flight-search-container input-container mb-4">
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" value="" onChange={(e)=>setCheckBox(e.target.checked)} />
                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Return journey</label>
                  </div>
                  <div className='Flight-search-container-body'>

                    <div className="form-floating">
                      <select className="form-select form-select-sm mb-3"  aria-label=".form-select-sm example" value={departure} onChange={(e)=>setDeparture(e.target.value)}>
                        <option value="" selected disabled>Select</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Banglore">Banglore</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Indore">Indore</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Pune">Pune</option>
                        <option value="Trivendrum">Trivendrum</option>
                        <option value="Bhopal">Bhopal</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="varanasi">varanasi</option>
                        <option value="Jaipur">Jaipur</option>
                      </select>
                      <label htmlFor="floatingSelect">Departure City</label>
                    </div>
                    <div className="form-floating">
                      <select className="form-select form-select-sm mb-3"  aria-label=".form-select-sm example" value={destination} onChange={(e)=>setDestination(e.target.value)}>
                        <option value="" selected disabled>Select</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Banglore">Banglore</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Indore">Indore</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Pune">Pune</option>
                        <option value="Trivendrum">Trivendrum</option>
                        <option value="Bhopal">Bhopal</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="varanasi">varanasi</option>
                        <option value="Jaipur">Jaipur</option>
                      </select>
                      <label htmlFor="floatingSelect">Destination City</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input type="date" className="form-control" id="floatingInputstartDate" value={departureDate} onChange={(e)=>setDepartureDate(e.target.value)}/>
                      <label htmlFor="floatingInputstartDate">Journey date</label>
                    </div>
                    {checkBox ?
                      <div className="form-floating mb-3">
                        <input type="date" className="form-control" id="floatingInputreturnDate" value={returnDate} onChange={(e)=>setReturnDate(e.target.value)}/>
                        <label htmlFor="floatingInputreturnDate">Return date</label>
                      </div>
                    : null}
                    <div>
                      <button 
                        type="button"
                        className="btn btn-primary search-btn" 
                        onClick={fetchFlights}
                        disabled={loading}
                      >
                        {loading ? 'Searching...' : 'Search'}
                      </button>
                    </div>
                  </div>
                  {error && <p style={{color: 'rgb(255, 100, 100)', fontWeight: 'bold'}}>{error}</p>}
              </div>
                   
              {Flights.length > 0 ? (
                <>
                  {checkBox ? (
                    // Return journey - show both directions
                    <>
                      {Flights.filter(Flight => Flight.origin.toLowerCase() === departure.toLowerCase() && Flight.destination.toLowerCase() === destination.toLowerCase()).length > 0 || Flights.filter(Flight => Flight.origin.toLowerCase() === destination.toLowerCase() && Flight.destination.toLowerCase() === departure.toLowerCase()).length > 0 ? (
                        <div className="availableFlightsContainer">
                          {/* Outbound Flights */}
                          {Flights.filter(Flight => Flight.origin.toLowerCase() === departure.toLowerCase() && Flight.destination.toLowerCase() === destination.toLowerCase()).length > 0 && (
                            <>
                              <h1>Outbound Flights ({departure} → {destination})</h1>
                              <div className="Flights">
                                {Flights.filter(Flight => Flight.origin.toLowerCase() === departure.toLowerCase() && Flight.destination.toLowerCase() === destination.toLowerCase()).map((Flight) => (
                                  <div className="Flight" key={Flight._id}>
                                    <div>
                                      <p><b>{Flight.flightName}</b></p>
                                      <p><b>Flight Number:</b> {Flight.flightId}</p>
                                    </div>
                                    <div>
                                      <p><b>Start :</b> {Flight.origin}</p>
                                      <p><b>Departure Time:</b> {Flight.departureTime}</p>
                                    </div>
                                    <div>
                                      <p><b>Destination :</b> {Flight.destination}</p>
                                      <p><b>Arrival Time:</b> {Flight.arrivalTime}</p>
                                    </div>
                                    <div>
                                      <p><b>Starting Price:</b> {Flight.basePrice}</p>
                                      <p><b>Available Seats:</b> {Flight.totalSeats}</p>
                                    </div>
                                    <button className="button btn btn-primary" onClick={() => handleTicketBooking(Flight._id, Flight.origin, Flight.destination)}>Book Now</button>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}

                          {/* Return Flights */}
                          {Flights.filter(Flight => Flight.origin.toLowerCase() === destination.toLowerCase() && Flight.destination.toLowerCase() === departure.toLowerCase()).length > 0 && (
                            <>
                              <h1 style={{marginTop: '30px'}}>Return Flights ({destination} → {departure})</h1>
                              <div className="Flights">
                                {Flights.filter(Flight => Flight.origin.toLowerCase() === destination.toLowerCase() && Flight.destination.toLowerCase() === departure.toLowerCase()).map((Flight) => (
                                  <div className="Flight" key={Flight._id}>
                                    <div>
                                      <p><b>{Flight.flightName}</b></p>
                                      <p><b>Flight Number:</b> {Flight.flightId}</p>
                                    </div>
                                    <div>
                                      <p><b>Start :</b> {Flight.origin}</p>
                                      <p><b>Departure Time:</b> {Flight.departureTime}</p>
                                    </div>
                                    <div>
                                      <p><b>Destination :</b> {Flight.destination}</p>
                                      <p><b>Arrival Time:</b> {Flight.arrivalTime}</p>
                                    </div>
                                    <div>
                                      <p><b>Starting Price:</b> {Flight.basePrice}</p>
                                      <p><b>Available Seats:</b> {Flight.totalSeats}</p>
                                    </div>
                                    <button className="button btn btn-primary" onClick={() => handleTicketBooking(Flight._id, Flight.origin, Flight.destination)}>Book Now</button>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="availableFlightsContainer">
                          <h1>No Flights Found</h1>
                        </div>
                      )}
                    </>
                  ) : (
                    // One-way journey - show only selected direction
                    <>
                      {Flights.filter(Flight => Flight.origin.toLowerCase() === departure.toLowerCase() && Flight.destination.toLowerCase() === destination.toLowerCase()).length > 0 ? (
                        <div className="availableFlightsContainer">
                          <h1>Available Flights</h1>
                          <div className="Flights">
                            {Flights.filter(Flight => Flight.origin.toLowerCase() === departure.toLowerCase() && Flight.destination.toLowerCase() === destination.toLowerCase()).map((Flight) => (
                              <div className="Flight" key={Flight._id}>
                                <div>
                                  <p><b>{Flight.flightName}</b></p>
                                  <p><b>Flight Number:</b> {Flight.flightId}</p>
                                </div>
                                <div>
                                  <p><b>Start :</b> {Flight.origin}</p>
                                  <p><b>Departure Time:</b> {Flight.departureTime}</p>
                                </div>
                                <div>
                                  <p><b>Destination :</b> {Flight.destination}</p>
                                  <p><b>Arrival Time:</b> {Flight.arrivalTime}</p>
                                </div>
                                <div>
                                  <p><b>Starting Price:</b> {Flight.basePrice}</p>
                                  <p><b>Available Seats:</b> {Flight.totalSeats}</p>
                                </div>
                                <button className="button btn btn-primary" onClick={() => handleTicketBooking(Flight._id, Flight.origin, Flight.destination)}>Book Now</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="availableFlightsContainer">
                          <h1>No Flights Found</h1>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : null}
        </div>
    </div>
  );
}

export default LandingPage;
