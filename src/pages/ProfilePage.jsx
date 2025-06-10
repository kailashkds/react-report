import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/ProfilePage.module.css';
import { AuthContext } from '../contexts/AuthContext';


const ProfilePage = () => {
  const [newFullName, setNewFullName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();
  const { username } = useContext(AuthContext);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if any of the new values have been entered
    if (newFullName || newPassword) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/rest/user/me`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({
            name: newFullName,
            username: username,
            old_password: currentPassword,
            password: newPassword,
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          setMessage({ type: 'success', text: 'Successfully Updated the profile.', className: styles.success });
          setTimeout(() => {
            // Navigate to the Navigation Page with a success message
      navigate('/NavigationPage', { state: { message: 'Your changes have been successfully updated!' } });
          }, 2000);
        } else {
          throw new Error('Failed to update user\'s profile');
        }
      } catch (error) {
        console.error(error);
        setMessage({ type: 'error', text: 'An error occurred while updating the user\'s profile', className: styles.error });
      }
    } else {
      setMessage({ type: 'error', text: 'You did not update your profile information', className: styles.error });
    }
  };

  return (
    <div className={styles.profileContainer}>
      <form onSubmit={handleSubmit} className={styles.profileBox}>
        <h1>Edit Profile</h1>
        <label>
          New Full Name (if applicable):
          <input type="text" value={newFullName} onChange={e => setNewFullName(e.target.value)} />
        </label>
        <label>
          Current Email:
          <input type="email" value={username} readOnly />
        </label>
        <label>
          Current Password:
          <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
        </label>
        <label>
          New Password (if applicable):
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        </label>
        <div className={styles.profileActions}>
          <input type="submit" value="Save Changes" className={styles.buttonWidth} />
          <button type="button" onClick={() => navigate('/NavigationPage')} className={styles.buttonWidth}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
