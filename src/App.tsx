// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login/login';
import AddNews from './pages/addnew/addnews';
//import Signup from './pages/Signup';
import NewsList from './pages/viewNiew/view';
//import AddNews from './pages/AddNews';
//import AddComment from './pages/AddComment';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<NewsList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/add-news" element={<AddNews />} />

              
            </Routes>
        </Router>
    );
};

export default App;
