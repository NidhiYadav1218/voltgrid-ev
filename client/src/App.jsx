import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';

// Core Pages
import Home from './pages/Home.jsx';
import Locations from './pages/Locations.jsx';
import HubDetail from './pages/HubDetail.jsx';
import Simulator from './pages/Simulator.jsx';
import Vendor from './pages/Vendor.jsx';
import Admin from './pages/Admin.jsx';
import Profile from './pages/Profile.jsx';

// Zeon Dedicated Pages
import MobileApp from './pages/MobileApp.jsx';
import AutoCharge from './pages/AutoCharge.jsx';
import HowToCharge from './pages/HowToCharge.jsx';
import LocationPartner from './pages/LocationPartner.jsx';
import AddYourCharger from './pages/AddYourCharger.jsx';
import FleetCharger from './pages/FleetCharger.jsx';
import AboutUs from './pages/AboutUs.jsx';
import MissionVision from './pages/MissionVision.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-black text-zinc-100 font-sans">
          <Routes>
            {/* Dedicated Login portals */}
            <Route path="/login" element={<Login portal="driver" />} />
            <Route path="/vendor/login" element={<Login portal="vendor" />} />
            <Route path="/admin/login" element={<Login portal="admin" />} />

            {/* Application routes */}
            <Route
              path="/*"
              element={
                <main className="flex-1">
                  <Routes>
                    {/* Home */}
                    <Route path="/" element={<Home />} />

                    {/* Locations / Interactive Map */}
                    <Route path="/locations" element={<Locations />} />
                    <Route path="/hubs" element={<Navigate to="/locations" replace />} />
                    <Route path="/hub/:id" element={<HubDetail />} />

                    {/* Charging Menu Routes */}
                    <Route path="/mobile_app" element={<MobileApp />} />
                    <Route path="/auto_charge" element={<AutoCharge />} />
                    <Route path="/rfid" element={<AutoCharge />} />
                    <Route path="/how_to_charge" element={<HowToCharge />} />

                    {/* Business Menu Routes */}
                    <Route path="/become_a_zeon_location_partner" element={<LocationPartner />} />
                    <Route path="/franchisee" element={<LocationPartner />} />
                    <Route path="/add_your_charger" element={<AddYourCharger />} />
                    <Route path="/fleet_charger" element={<FleetCharger />} />

                    {/* About Menu Routes */}
                    <Route path="/about_us" element={<AboutUs />} />
                    <Route path="/mission_vision" element={<MissionVision />} />

                    {/* Simulator */}
                    <Route path="/simulator" element={<Simulator />} />

                    {/* User profile */}
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />

                    {/* CPO Vendor dashboard */}
                    <Route
                      path="/vendor"
                      element={
                        <ProtectedRoute role="vendor">
                          <Vendor />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin console */}
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
