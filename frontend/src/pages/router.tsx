import React, { FC, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RouteType } from '../types/router.types.ts';

import MainPage from './MainPage';
import AuthPage from './AuthPage';
import CreatePage from './CreatePage.tsx';
import ListPage from './ListPage.tsx';
import ProfTestPage from './ProfTestPage.tsx';
import RegPage from './RegPage.tsx';
import TestPage from './TestPage.tsx';
import QuestionPage from './QuestionPage.tsx';
import ProfilePage from './ProfilePage.tsx';
import PrivateRoute from './PrivateRoute'; // Убедитесь, что путь правильный
import FirstEpisode from './FirstEpisode.tsx';
import SecondEpisode from './SecondEpisode.tsx';
import ThirdEpisode from './ThirdEpisode.tsx';

const Router: FC = () => {
  const routeConfig: RouteType[] = [
    {
      title: 'MainPage',
      path: '/home',
      element: <MainPage />,
    },
    {
      title: 'AuthPage',
      path: '/auth',
      element: <AuthPage />,
    },
    {
      title: 'CreatePage',
      path: '/create',
      element: <PrivateRoute element={<CreatePage/>} />,
    },
    {
      title: 'ListPage',
      path: '/list',
      element: <PrivateRoute element={<ListPage />} />,
    },
    {
      title: 'ProfTestPage',
      path: '/proftest',
      element: <PrivateRoute element={<ProfTestPage/>} />,
    },
    {
      title: 'FirstEdisode',
      path: '/firstepisode',
      element: <PrivateRoute element={<FirstEpisode/>} />,
    },
    {
      title: 'SecondEdisode',
      path: '/secondepisode',
      element: <PrivateRoute element={<SecondEpisode/>} />,
    },
    {
      title: 'ThirdEdisode',
      path: '/thirdepisode',
      element: <PrivateRoute element={<ThirdEpisode />} />,
    },
    {
      title: 'RegPage',
      path: '/reg',
      element: <RegPage />,
    },
    {
      title: 'TestPage',
      path: '/test/:id?',
      element: <PrivateRoute element={<TestPage/>} />,
    },
    {
      title: 'QuestionPage',
      path: '/question/:id?',
      element: <PrivateRoute element={<QuestionPage/>} />,
    },
    {
      title: 'ProfilePage',
      path: '/profile/:id?',
      element: <PrivateRoute element={<ProfilePage/>} />,
    },
  ];

  return (
    <Suspense>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        {routeConfig.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Suspense>
  );
};

export default Router;
