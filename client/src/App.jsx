import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';

// Page components (implemented across Phase 5 & 6)
import Home from './pages/Home.jsx';
import Hubs from './pages/Hubs.jsx';
import HubDetail from './pages/HubDetail.jsx';
import Simulator from './pages/Simulator.jsx';
import Vendor from './pages/Vendor.jsx';
import Admin from './pages/Admin.jsx';
import Profile from './pages/Profile.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
          <Routes>
            {/* Login is standalone full-screen */}
            <Route path="/login" element={<Login />} />

            {/* Application routes */}
            <Route
              path="/*"
              element={
                <main className="flex-1">
                  <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/hubs" element={<Hubs />} />
                      <Route path="/hub/:id" element={<HubDetail />} />
                      <Route path="/simulator" element={<Simulator />} />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/vendor"
                        element={
                          <ProtectedRoute role="vendor">
                            <Vendor />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute role="admin">
                            <Admin />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
