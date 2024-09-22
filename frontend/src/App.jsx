import { useState } from 'react';
import EventCalendar from './components/Calendar';
import axios from 'axios';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSignup ? '/signup' : '/login';
      const response = await axios.post(`http://localhost:5000${endpoint}`, { email, password });
      if (isSignup) {
        alert('Signup successful. Please log in.');
        setIsSignup(false);
      } else {
        localStorage.setItem('token', response.data.token);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error(`${isSignup ? 'Signup' : 'Login'} failed:`, error);
      alert(`${isSignup ? 'Signup' : 'Login'} failed. Please check your credentials.`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <>
          <h1>{isSignup ? 'Sign Up' : 'Login'}</h1>
          <form onSubmit={handleAuth}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
            <button type="button" onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? 'Switch to Login' : 'Switch to Signup'}
            </button>
          </form>
        </>
      ) : (
        <>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
          <h1>Event Calendar</h1>
          <EventCalendar />
        </>
      )}
    </div>
  );
}

export default App;
