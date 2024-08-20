import React, { useEffect, useState } from 'react';
import './App.css';
import Footer from './components/Footer.jsx';
import MainDash from './components/MainDash/MainDash.jsx';
import Sidebar from './components/Sidebar.jsx';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark-theme');
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', darkMode ? 'light' : 'dark');
  };

  return (
    <div className="App">
      <div className="theme-toggle-container">
        <button className={`theme-toggle ${darkMode ? 'dark' : 'light'}`} onClick={toggleTheme}>
          {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>
      <div className="AppGlass">
        <Sidebar />
        <MainDash />

      </div>
      <Footer />
    </div>
  );
}

export default App;



