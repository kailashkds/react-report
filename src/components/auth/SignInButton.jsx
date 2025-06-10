import React from 'react';

/*This is an example*/

const SignInButton = () => {
    const handleSignIn = () => {
        alert('Sign in button clicked!');
    };

    return (
        <button onClick={handleSignIn}>
            Sign In
        </button>
    );
};

export default SignInButton;