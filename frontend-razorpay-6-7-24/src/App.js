import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './component/Signup';
import Home from './component/Home';
import Login from './component/Login';
import Registration from './component/Registration';
import Subscription from './component/Subscription';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Registration />} />
        <Route path='/home' element={<Home />} />
        <Route path='/subscription' element={<Subscription/>}/>
      </Routes>
    </Router>
  );
}

export default App;
