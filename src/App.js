import './App.css';
import Footer from './components/Footer.jsx'; // Import the Footer component
import MainDash from './components/MainDash/MainDash.jsx';
import RightSide from './components/RightSide/RightSide.jsx';
import Sidebar from './components/Sidebar.jsx';

function App() {
  return (
    <div className="App">
      <div className="AppGlass">
        <Sidebar />
        <MainDash />
        <RightSide />
      </div>
      <Footer /> {/* Add the Footer component here */}
    </div>
  );
}

export default App;
