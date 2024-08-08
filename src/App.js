import './App.css';
//import MainDash from './components/MainDash/MainDash';
//import RightSide from './components/RigtSide/RightSide';
import RightSide from './components/RightSide/RightSide.jsx';
//import Sidebar from './components/Sidebar';
import '../src/App.css';
import MainDash from './components/MainDash/MainDash.jsx';
import Sidebar from './components/Sidebar.jsx';



function App() {
  return (
    <div className="App">
      <div className="AppGlass">
        <Sidebar/>
        <MainDash/>
        <RightSide/>
      </div>
    </div>
  );
}

export default App;