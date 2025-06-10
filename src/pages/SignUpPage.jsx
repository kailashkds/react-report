import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from '../styles/SignUpPage.module.css';

const SignUpSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full Name is required'),
  email: Yup.string()
    .email('Email is invalid')
    .required('Email is required'),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      'Password must have at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 6 characters long'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (fields) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/rest/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fields.fullName,
          email: fields.email,
          password: fields.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: 'Successfully Signed Up! Redirecting to Sign In page...', className: styles.success });
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      } else {
        throw new Error('Failed to register user');
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'An error occurred while registering the user', className: styles.error });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.signup}>
        <Formik
          initialValues={{
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={SignUpSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, status, touched, values }) => (
            <Form className="signup-form">
              <h2>Sign Up</h2>
              {message && <div className={message.className}>{message.text}</div>}
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <Field
                  name="fullName"
                  type="text"
                  className={'form-control' + (errors.fullName && touched.fullName ? ' is-invalid' : '')}
                />
                <ErrorMessage name="fullName">{msg => <div className={styles.error}>* {msg}</div>}
                </ErrorMessage>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Field
                  name="email"
                  type="text"
                  className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')}
                />
                <ErrorMessage name="email">{msg => <div className={styles.error}>* {msg}</div>}
                </ErrorMessage>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')}
                />
                <button type="button" onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
                <ErrorMessage name="password">{msg => <div className={styles.error}>* {msg}</div>}
                </ErrorMessage>
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Field
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={values.confirmPassword}
                  className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')}
                />
                <button type="button" onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
                <ErrorMessage name="confirmPassword">{msg => <div className={styles.error}>* {msg}</div>}
                </ErrorMessage>
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-primary mr-2">Register</button>
                <button type="reset" className="btn btn-secondary">Reset</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUpPage;
