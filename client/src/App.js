// ==== src/App.js ====
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import PortfolioView from './pages/PortfolioView';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';

function LayoutWithSidebar({ children }) {
  const location = useLocation();
  const pathsWithSidebar = ['/dashboard', '/edit-profile', '/portfolio'];

  const shouldShowSidebar = pathsWithSidebar.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {shouldShowSidebar && <Sidebar />}
      {children}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LayoutWithSidebar>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
          <Route path="/portfolio/:username" element={<PortfolioView />} />
        </Routes>
      </LayoutWithSidebar>
    </BrowserRouter>
  );
}

export default App;
