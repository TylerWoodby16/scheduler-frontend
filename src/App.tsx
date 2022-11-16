import React, { Fragment } from "react";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Schedule from "./Schedule";
import NavBar from "./NavBar";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import Home from "./Home";
import { RequireAuth } from "./AuthRoute";

function App() {
  return (
    // <Fragment>
    //   <NavBar />
      <Routes>
        <Route path="/" element={<Schedule />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />

        <Route path="/home" element={
          <RequireAuth>
            <Home />
          </RequireAuth>
          } />
      </Routes>
    // </Fragment>
  );
}

export default App;
