import React from 'react';
import { Routes, Route, Link, RouteProps } from "react-router-dom";
import jwt from "jsonwebtoken";

const AuthRoute: React.FC<RouteProps> = ({ children, ...props}) => {
  return (
    <Route 
    path="whatever"

    />
  );
}

const verifyToken = () => {
  const token = localStorage.getItem("token");
  if(!token) return false;

  const decoded = jwt.decode(token, {complete: true});
  
  const now = Math.floor(Date.now() / 1000);
  return false;
  // return decoded?.payload.exp > now;
}

export default AuthRoute;
