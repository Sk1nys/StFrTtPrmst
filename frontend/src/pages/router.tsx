import { FC, Suspense } from "react";
import { RouteType } from "../types/router.types.ts";
import { Routes, Route, Navigate } from "react-router-dom";

import MainPage from "./MainPage";
import AuthPage from './AuthPage'
import CreatePage from "./CreatePage.tsx";
import ListPage from "./ListPage.tsx";
import ProfTestPage from "./ProfTestPage.tsx";
import RegPage from "./RegPage.tsx";
import TestPage from "./TestPage.tsx";
const Router: FC = () => {

  const routeConfig: RouteType[] = [
    {
      title: "MainPage",
      path: "/home",
      element:<MainPage />,
    },
    {
      title: "AuthPage",
      path: "/auth",
      element: <AuthPage /> ,
    },
    {
      title: "/CreatePage",
      path: "/create",
      element: <CreatePage /> ,
    },
    {
      title: "/ListPage",
      path: "/list",
      element: <ListPage /> ,
    },
    {
      title: "/ProfTestPage",
      path: "/proftest",
      element: <ProfTestPage /> ,
    },
    {
      title: "/regPage",
      path: "/reg",
      element: <RegPage /> ,
    },
    {
      title: "/testPage",
      path: "/test:id?",
      element: <TestPage />,
    },
    
  ];

  return (
    <Suspense>
      <Routes>
      <Route path="/test/:id" Component={TestPage} />

        <Route
          path="/"
          element={<Navigate to={"/home"} />}
        />
           
        {
          
        routeConfig.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
          
        ))}

        
      </Routes>
    </Suspense>
  );
};

export default Router;
