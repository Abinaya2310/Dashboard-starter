import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css'; // Ensure this file contains the necessary styles
import Footer from './components/Footer.jsx';
import MainDash from './components/MainDash/MainDash.jsx';
import Sidebar from './components/Sidebar.jsx';
import Analytics from './pages/Analytics';
import AuditRecords from './pages/AuditRecords.jsx';
import Customers from './pages/Customers';
import Profile from './pages/Profile';
import SettingsPage from './pages/SettingsPage.jsx';
import ToDoList from './pages/ToDoList';
function App() {
  const [darkMode, setDarkMode] = useState(false);

  // On first load, check the theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme'); // Ensure light theme is removed
    } else {
      setDarkMode(false);
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme'); // Ensure dark theme is removed
    }
  }, []);

  // Toggle the theme
  const toggleTheme = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      if (newMode) {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  return (
    <Router>
      <div className="App">
        <div className="theme-toggle-container">
          <button className={`theme-toggle ${darkMode ? 'dark' : 'light'}`} onClick={toggleTheme}>
            {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
        <div className="AppGlass">
          <Sidebar /> {/* Sidebar remains fixed and unchanged */}
          <Routes>
            <Route path="/" element={<MainDash />} />
            <Route path="/dashboard" element={<MainDash />} />
            <Route path="/to-do-list" element={<ToDoList />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/auditrecords" element={<AuditRecords />} />
            <Route path="/settingspage" element={<SettingsPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;






