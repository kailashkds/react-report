import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import classes from '../styles/HomePage.module.css';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

             
const NavigationPage = () => {
  const { setIsAuthenticated, setUsername } = useContext(AuthContext);
  const navigate = useNavigate();

  const location = useLocation();
  const message = location.state?.message;

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUsername('');
    localStorage.clear();
    navigate('/signin', { state: { message: 'You have successfully logged out!' } });
  };

  return (
    <div>
      <header className={classes.header}>
        <div className={classes.logo}>Budgeto</div>
        <div className={classes.profileSignOut}>
          <Link to="/profile" className={classes.profileLink}>
            <FontAwesomeIcon icon={faCog} /> Profile
          </Link>
          <button onClick={handleSignOut} className={classes.signOutButton}>
            <FontAwesomeIcon icon={faSignOutAlt} /> Sign Out
          </button>
        </div>
        {/* user settings link at the top in the header */}
      </header>
      {message && <div style={{ color: 'blue', textAlign: 'center' }}>{message}</div>}
      {/* link boxes  */}
      <div className={classes.linkBoxes}>
        {/* Link to Total Revenue */}
        <Link to="/totalrevenue" className={classes.box}>
          Total Revenue 
        </Link>
        
        {/* Link to Profit and Loss statement */}
        <Link to="/ReportsPage" className={classes.box}>
          Profit and Loss Statement
        </Link>
        
        {/* Link to Cash Flow statement */}
        <Link to="/cashflow" className={classes.box}>
          Cashflow Statement
        </Link>

      </div>
    </div>
  );
}

export default NavigationPage;
