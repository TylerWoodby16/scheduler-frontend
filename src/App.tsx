import React from "react";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Schedule from "./Schedule";
import NavBar from "./NavBar";
import SignUp from "./SignUp";
import LogIn from "./LogIn";

function App() {
  return (
    <div>
      <NavBar/>
      <Routes>
      <Route path="/" element={<Schedule />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<LogIn />} />
      </Routes>
    </div>
  );
}

export default App;
