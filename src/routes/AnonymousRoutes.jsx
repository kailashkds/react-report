import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";
import ExamplePage from "../pages/ExamplePage";
import SignInPage from '../pages/SignInPage';
import SignUpPage from "../pages/SignUpPage";

const AnonymousRoutes = () => {
  return (
    <div className={'flex flex-col justify-center min-h-screen bg-cream'}>
      {/*Add Global Navigation bar here*/}
      <div className={'pt-14 mb-auto'}>
        <Routes>
          <Route path={'*'} element={<ErrorPage />} />
          <Route path={'/'} element={<HomePage />} />
          <Route path={'/example'} element={<ExamplePage />} />
          <Route path={'/signup'} element={<SignUpPage />} />
          <Route path={'/signin'} element={<SignInPage />} />
        </Routes>
      </div>
        {/*Add Global Footer here*/}
    </div>
  );
};

export default AnonymousRoutes;
