import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Zap, Car, MapPin, Gauge, Store, Shield, LogIn, LogOut, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header({ totalPorts, availablePorts }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
      isActive
        ? 'bg-red-600 text-white shadow-md shadow-red-600/30 font-bold'
        : 'text-zinc-300 hover:text-white hover:bg-zinc-800/80'
    }`;

  return (
    <header className="border-b border-zinc-800 bg-black/95 text-white backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand: Zeon Charging */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 p-0.5 shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
              <Zap className="w-4 h-4 text-red-500 fill-current" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-wider text-white font-heading">
                ZEON<span className="text-red-500 font-extrabold ml-1">CHARGING</span>
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-red-950/80 text-red-400 font-bold border border-red-800/80">
                NETWORK
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 hidden sm:block font-medium">
              India's Most Reliable EV Fast Charging Network
            </p>
          </div>
        </Link>

        {/* Live Port Stats */}
        {totalPorts !== undefined && availablePorts !== undefined && (
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono bg-zinc-900/90 px-3 py-1 rounded-lg border border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-zinc-400">Live Bays:</span>
            <span className="font-bold text-red-400">
              {availablePorts} / {totalPorts} Available
            </span>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex items-center gap-1">
          {/* Show vehicle name only when user is logged in */}
          {isAuthenticated && (
            <NavLink to="/" end className={navClass}>
              <Car className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">{user?.car || user?.vehicleModel || 'My EV'}</span>
            </NavLink>
          )}

          <NavLink to="/hubs" className={navClass}>
            <MapPin className="w-3.5 h-3.5" />
            <span>Locations</span>
          </NavLink>

          <NavLink to="/simulator" className={navClass}>
            <Gauge className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Simulator</span>
          </NavLink>

          {/* Host a Charger (CPO Vendor Portal) */}
          {(!isAuthenticated || user?.role === 'vendor') && (
            <NavLink
              to={isAuthenticated && user?.role === 'vendor' ? '/vendor' : '/vendor/login'}
              className={navClass}
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Host a Charger</span>
            </NavLink>
          )}

          {/* Admin Portal */}
          {(!isAuthenticated || user?.role === 'admin') && (
            <NavLink
              to={isAuthenticated && user?.role === 'admin' ? '/admin' : '/admin/login'}
              className={navClass}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Admin</span>
            </NavLink>
          )}

          {/* User profile / Auth buttons */}
          <div className="ml-2 pl-2 border-l border-zinc-800 flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  title="View Profile & Bookings"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs transition-all cursor-pointer border border-zinc-700 hover:border-red-500/40 text-white"
                >
                  <User className="w-3.5 h-3.5 text-red-400" />
                  <span className="font-bold text-zinc-200 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-zinc-800 text-red-300 font-bold border border-red-900/50">
                    {user?.role}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md shadow-red-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Driver Sign In</span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
