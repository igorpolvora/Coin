import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import './App.css'

const queryClient = new QueryClient()

// PrivateRoute Component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Placeholder components for the requested routes
const DashboardPlaceholder = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
    <p className="text-gray-500">Esta página está protegida.</p>
  </div>
);

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardPlaceholder title="Dashboard" /></PrivateRoute>} />
        <Route path="/transactions" element={<PrivateRoute><DashboardPlaceholder title="Transações" /></PrivateRoute>} />
        <Route path="/cards" element={<PrivateRoute><DashboardPlaceholder title="Cartões" /></PrivateRoute>} />
        <Route path="/vault" element={<PrivateRoute><DashboardPlaceholder title="Cofre" /></PrivateRoute>} />
        <Route path="/budget" element={<PrivateRoute><DashboardPlaceholder title="Orçamento" /></PrivateRoute>} />
        <Route path="/bills" element={<PrivateRoute><DashboardPlaceholder title="Contas" /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
