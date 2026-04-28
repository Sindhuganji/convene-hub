import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import Dashboard from './Dashboard';
import Login from './Login';
import Register from './Register';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}