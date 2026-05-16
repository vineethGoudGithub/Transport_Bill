import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// We will create these next
import Sidebar from './components/Sidebar';
import { Menu, X } from 'lucide-react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateBill from './pages/CreateBill';
import BillHistory from './pages/BillHistory';
import BillPreview from './pages/BillPreview';
import StatementGenerator from './pages/StatementGenerator';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {isAuthenticated && (
        <>
          <button className="mobile-toggle" onClick={toggleSidebar}>
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
        </>
      )}
      <main className={`main-content ${!isAuthenticated ? 'full-width' : ''}`}>
        {children}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/create-bill" element={<ProtectedRoute><CreateBill /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><BillHistory /></ProtectedRoute>} />
              <Route path="/statements" element={<ProtectedRoute><StatementGenerator /></ProtectedRoute>} />
              <Route path="/bills/:id" element={<ProtectedRoute><BillPreview /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AppLayout>
          <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
