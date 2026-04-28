import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';

import Dashboard from './Dashboard';
import Login from './Login';
import Register from './Register';

function App() {
  return (
    <Router>
      <Routes>
        {/* BOTH routes for login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;