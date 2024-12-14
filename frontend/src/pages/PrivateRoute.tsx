import React, { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ element }) => {

  const [cookies] = useCookies(['id']);
  

  const isAuthenticated = !!cookies.id;

  return isAuthenticated ? element : <Navigate to="/auth" />;
};

export default PrivateRoute;

