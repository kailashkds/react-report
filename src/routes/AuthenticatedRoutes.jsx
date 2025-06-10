import React from 'react';
import {Route, Routes} from 'react-router-dom';
import ErrorPage from "../pages/ErrorPage";
import ReportsPage from '../pages/ReportsPage';
import ReportGenerator from '../pages/ReportGenerator';
import NavigationPage from '../pages/NavigationPage';
import ProfilePage from '../pages/ProfilePage';

const AuthenticatedRoutes = () => {
    return (
        <div className={'flex flex-col justify-center min-h-screen bg-cream'}>
            {/*Add Global Navigation bar here*/}
            <div className={'pt-14 mb-auto'}>
                <Routes>
                    {/* Example */}
                    <Route path={'/somePath'} element={<ErrorPage/>}/>
                    <Route path={'/ReportsPage'} element={<ReportsPage/>}/>
                    <Route path={'/ReportGenerator'} element={<ReportGenerator/>}/>
                    <Route path={'/NavigationPage'} element={<NavigationPage/>}/>
                    <Route path={'/profile'} element={<ProfilePage/>} />
                </Routes>
            </div>
            {/*Add Global Footer here*/}
        </div>
    );
};

export default AuthenticatedRoutes;
