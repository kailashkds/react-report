import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/SignInPage.module.css';
import { AuthContext } from '../contexts/AuthContext';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State to hold the error message
  const navigate = useNavigate();

  const { setUsername, setIsAuthenticated } = useContext(AuthContext);

  const location = useLocation();
  const signOutMessage = location.state?.message;

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous error messages

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/rest/auth/login`, {
        email: email,
        password: password
      });
      if (response.status === 200) {
        localStorage.clear();
        localStorage.setItem('access_token', response.data.access_token);
        setIsAuthenticated(true);
        setUsername(email)
        navigate('/NavigationPage');
      } else {
        // Set a user-friendly error message
        setErrorMessage('Invalid email and password');
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      // Set a user-friendly error message
      setErrorMessage('Invalid email and password');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.signin}>
      <h1>Sign In to Budgeto</h1>
      {signOutMessage && <div className={styles.signOutMessage}>{signOutMessage}</div>}
      <form onSubmit={handleSignIn}>
        <label>
          Email:
          <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <input type="submit" value="Sign In" />
        {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display the error message */}
      </form>
      <Link to="/signup">Don't have an account? Sign Up</Link>
    </div>
    </div>
  );
};

export default SignInPage;
