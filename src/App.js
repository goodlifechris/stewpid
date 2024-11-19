import logo from './logo.svg';
import './App.css';
require('dotenv').config()
import MontyHallGame from './MontyHall';
function App() {
  return (
    <div className="App">
<MontyHallGame/>
    </div>
  );
}

export default App;
