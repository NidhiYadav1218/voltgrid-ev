import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Zap, Car, MapPin, Gauge, Store, Shield, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header({ totalPorts, availablePorts }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
      isActive
        ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-wider text-slate-900 dark:text-white font-heading">
                VOLT<span className="text-emerald-500">GRID</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-300 dark:border-emerald-800">
                GUJARAT
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Statewide EV Supergrid & Charging Network
            </p>
          </div>
        </Link>

        {/* Live Port Stats */}
        {totalPorts !== undefined && availablePorts !== undefined && (
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-500 dark:text-slate-400">Live Ports:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {availablePorts} / {totalPorts} Available
            </span>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={navClass}>
            <Car className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Charge</span>
          </NavLink>

          <NavLink to="/hubs" className={navClass}>
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hubs</span>
          </NavLink>

          <NavLink to="/simulator" className={navClass}>
            <Gauge className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Simulator</span>
          </NavLink>

          {(!isAuthenticated || user?.role === 'vendor' || user?.role === 'admin') && (
            <NavLink to="/vendor" className={navClass}>
              <Store className="w-3.5 h-3.5" />
              <span className="hidden md:inline">CPO Vendor</span>
            </NavLink>
          )}

          {(!isAuthenticated || user?.role === 'admin') && (
            <NavLink to="/admin" className={navClass}>
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Admin</span>
            </NavLink>
          )}

          {/* User profile / Auth buttons */}
          <div className="ml-2 pl-2 border-l border-slate-200 dark:border-slate-800 flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
                  <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-sm transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
