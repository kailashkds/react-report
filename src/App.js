import React, {useContext} from 'react';
import {AuthContext} from './contexts/AuthContext';
import AnonymousRoutes from './routes/AnonymousRoutes';
import AuthenticatedRoutes from './routes/AuthenticatedRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
    const {
        isAuthenticated
    } = useContext(AuthContext);

    if (isAuthenticated) {
        return <AuthenticatedRoutes/>;
    }
    return <AnonymousRoutes/>;
};

export default App;
