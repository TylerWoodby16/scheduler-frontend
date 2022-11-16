import React from 'react';
import {Route, Outlet, Navigate, RouteProps, useLocation } from "react-router-dom";
import jwt from "jsonwebtoken";

// const AuthRoute: React.FC<RouteProps> = ({ children, ...props}) => {
//   return (
//     <Route 
//     path="whatever"

//     />
//   );
// }

// const AuthRoute = () => {
//   const auth = null; // determine if authorized, from context or however you're doing it

//   // If authorized, return an outlet that will render child elements
//   // If not, return element that will navigate to login page
//   return auth ? <Outlet /> : <Navigate to="/login" />;
// }

export function RequireAuth({ children }: { children: any }) {
  let location = useLocation();

  const auth = null;

  return auth ? {children} : <Navigate to="/login" />;

  // if (!auth.user) {
  //   return <Navigate to="/login" state={{ from: location }} />;
  // }

  return children;
}

const verifyToken = () => {
  const token = localStorage.getItem("token");
  if(!token) return false;

  const decoded = jwt.decode(token, {complete: true});
  
  const now = Math.floor(Date.now() / 1000);
  return false;
  // return decoded?.payload.exp > now;
}

// export default AuthRoute;
