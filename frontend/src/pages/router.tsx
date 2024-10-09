import { FC, Suspense } from "react";
import { RouteType } from "../types/router.types.ts";
import { Routes, Route, Navigate } from "react-router-dom";

import MainPage from "./MainPage";
import AuthPage from './AuthPage'

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
  ];

  return (
    <Suspense>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={"/home"} />}
        />

        {routeConfig.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Suspense>
  );
};

export default Router;
