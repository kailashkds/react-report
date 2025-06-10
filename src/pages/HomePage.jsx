import React from 'react';
import { Link } from 'react-router-dom';
import classes from '../styles/HomePage.module.css';

const HomePage = () => {
  return (
    <header className={classes.header}>
        <div className={classes.logo}>Budgeto</div>
        <nav>
            <ul>
                <li>
                    <Link to='/signup'>Create an Account</Link>
                </li>
                <li>
                    <Link to='/signin'>Sign In</Link>
                </li>
            </ul>
        </nav>
    </header>
  );
}

export default HomePage;
