import { BrowserRouter, Routes, Route, Link } from "react-router-dom"; // Install react router "npm install react-router-dom"
import { useState } from "react";
import "./App.css";
import Home from "./Pages/Home.jsx";
import Page2 from "./Pages/Page2.jsx";
import Todo from "./Pages/Todo.jsx";
import Profile from "./Pages/Profile.jsx";
import Booking from "./Pages/Booking.jsx";
import AddBooking from "./Pages/AddBooking.jsx";
import OpenPopup from "./Pages/LoginPopup.jsx";

function App() {
  return (
    <>
      {/*Wrap the app in BrowserRouter to enable routing*/}
      <BrowserRouter>
        {/*Navigation links*/}
        <nav>
          <Link to="/">Home</Link> {/* root link (opens on start) */}
          <span>|</span>
          <Link to="/page2">Page 2</Link>
          <span>|</span>
          <Link to="/todo">Todo</Link>
          <span>|</span>
          <Link to="/profile">Profile</Link>
          <span>|</span>
          <Link to="/booking">Booking</Link>
          <span>|</span>
          <Link to="/addbooking">Add Booking</Link>
        </nav>
        {/*Links the button that opens and closes the login popup*/}
        <OpenPopup />

        {/*Define routes for different pages*/}
        <Routes>
          <Route path="/" element={<Home />} /> {/*Route for root*/}
          <Route path="/page2" element={<Page2 />} /> {/*Route for Page 2*/}
          <Route path="/todo" element={<Todo />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/addbooking" element={<AddBooking />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
