import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import {
  Home,
  Login,
  Registration,
  TeacherHome,
  NewGame,
  MyGames,
  Game,
  GameStudent,
  StudentLogin,
  StudentHome,
  Results

} from "./pages";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/teacherHome" element={<TeacherHome />} />
        <Route path="/newGame" element={<NewGame />} />
        <Route path="/myGames" element={<MyGames />} />
        <Route path="/game/:gameId" element={<Game />} />
        <Route path="/gameStudent/:gameId" element={<GameStudent />} />
        <Route path="/studentLogin" element={<StudentLogin />} />
        <Route path="/studentHome" element={<StudentHome />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
};
export default App;
