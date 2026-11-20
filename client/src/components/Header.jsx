import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Zap, User, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeMenu, setActiveMenu] = useState(null);
  const menuTimeoutRef = useRef(null);

  const handleMouseEnter = (menuName) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu(menuName);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  // Close menus on page navigation
  useEffect(() => {
    setActiveMenu(null);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[95vw]">
      {/* Floating Pill Container */}
      <div className="relative bg-white text-zinc-800 rounded-full shadow-2xl px-5 sm:px-7 py-2.5 flex items-center gap-5 sm:gap-7 border border-zinc-200/80 backdrop-blur-md">
        
        {/* Zeon Brand Logo */}
        <Link to="/" className="flex items-center gap-1.5 group pr-1">
          <div className="flex items-center">
            {/* Red Lightning Bolt inside Z styling */}
            <span className="text-xl sm:text-2xl font-black italic tracking-tighter text-[#E50914] font-heading flex items-center">
              <span className="relative inline-block">
                ⚡
              </span>
              <span>ZEON</span>
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium">
          {/* Home */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `transition-colors hover:text-[#E50914] ${
                isActive ? 'text-[#E50914] font-bold' : 'text-zinc-700'
              }`
            }
          >
            Home
          </NavLink>

          {/* Locations */}
          <NavLink
            to="/locations"
            className={({ isActive }) =>
              `transition-colors hover:text-[#E50914] ${
                isActive || location.pathname === '/hubs' ? 'text-[#E50914] font-bold' : 'text-zinc-700'
              }`
            }
          >
            Locations
          </NavLink>

          {/* Charging Mega Menu */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('charging')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setActiveMenu(activeMenu === 'charging' ? null : 'charging')}
              className={`flex items-center gap-1 transition-colors hover:text-[#E50914] cursor-pointer ${
                ['/mobile_app', '/auto_charge', '/rfid', '/how_to_charge'].includes(location.pathname)
                  ? 'text-[#E50914] font-bold'
                  : 'text-zinc-700'
              }`}
            >
              <span>Charging</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'charging' ? 'rotate-180 text-[#E50914]' : ''}`} />
            </button>

            {/* Charging Dropdown Mega Menu (Matches Image 3) */}
            {activeMenu === 'charging' && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                <div className="w-[500px] sm:w-[540px] bg-white rounded-3xl shadow-2xl border border-zinc-200 p-6 flex gap-6 text-zinc-800 animate-in fade-in zoom-in-95 duration-150">
                  {/* Left Links */}
                  <div className="flex-1 space-y-3.5 text-left py-1">
                    <Link
                      to="/app"
                      className="flex items-center justify-between text-sm font-bold text-[#E50914] hover:translate-x-1 transition-all"
                    >
                      <span>VoltGrid App (Web & APK)</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-bold">
                        ⚡ LIVE
                      </span>
                    </Link>
                    <Link
                      to="/mobile_app"
                      className="block text-sm font-medium text-zinc-700 hover:text-[#E50914] hover:translate-x-1 transition-all"
                    >
                      Mobile App Overview
                    </Link>
                    <Link
                      to="/auto_charge"
                      className="block text-sm font-medium text-zinc-700 hover:text-[#E50914] hover:translate-x-1 transition-all"
                    >
                      Auto Charge
                    </Link>
                    <Link
                      to="/auto_charge"
                      className="block text-sm font-medium text-zinc-700 hover:text-[#E50914] hover:translate-x-1 transition-all"
                    >
                      RFID
                    </Link>
                    <Link
                      to="/how_to_charge"
                      className="block text-sm font-medium text-zinc-700 hover:text-[#E50914] hover:translate-x-1 transition-all"
                    >
                      How To Charge
                    </Link>
                  </div>

                  {/* Right Visual Card */}
                  <div className="w-60 bg-zinc-100 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden text-left border border-zinc-200/60">
                    <h4 className="text-xs font-bold text-zinc-700 font-heading leading-snug">
                      Zeon App, Features <br />& How To Charge
                    </h4>

                    {/* Illustration preview */}
                    <div className="mt-3 flex items-center justify-center py-2 relative">
                      <div className="w-16 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-xs shadow-md">
                        ZEON ⚡
                      </div>
                      <div className="w-8 h-0.5 bg-red-400"></div>
                      <div className="w-16 h-8 rounded-lg bg-zinc-800 text-white flex items-center justify-center text-[10px] font-bold">
                        RED EV
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Business Mega Menu */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('business')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setActiveMenu(activeMenu === 'business' ? null : 'business')}
              className={`flex items-center gap-1 transition-colors hover:text-[#E50914] cursor-pointer ${
                ['/become_a_zeon_location_partner', '/add_your_charger', '/fleet_charger', '/vendor'].includes(location.pathname)
                  ? 'text-[#E50914] font-bold'
                  : 'text-zinc-700'
              }`}
            >
              <span>Business</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'business' ? 'rotate-180 text-[#E50914]' : ''}`} />
            </button>

            {/* Business Dropdown Mega Menu (Matches Image 4) */}
            {activeMenu === 'business' && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                <div className="w-[500px] sm:w-[540px] bg-white rounded-3xl shadow-2xl border border-zinc-200 p-6 flex gap-6 text-zinc-800 animate-in fade-in zoom-in-95 duration-150">
                  {/* Left Links */}
                  <div className="flex-1 space-y-3.5 text-left py-1">
                    <Link
                      to="/become_a_zeon_location_partner"
                      className="block text-sm font-medium text-zinc-700 hover:text-[#E50914] hover:translate-x-1 transition-all"
                    >
                      Location Partner
                    </Link>
                    <Link
                      to="/become_a_zeon_location_partner"
                      className="block text-sm font-medium text-zinc-700 hover:text-[#E50914] hover:translate-x-1 transition-all"
                    >
                      Franchisee
                    </Link>
                    <Link
                      to="/add_your_charger"
                      className="block text-sm font-medium text-zinc-700 hover:text-[#E50914] hover:translate-x-1 transition-all"
                    >
                      Add Your Charger
                    </Link>
                    <Link
                      to="/fleet_charger"
                      className="block text-sm font-medium text-zinc-700 hover:text-[#E50914] hover:translate-x-1 transition-all"
                    >
                      Fleet Charger
                    </Link>
                  </div>

                  {/* Right Visual Card */}
                  <div className="w-60 bg-zinc-100 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden text-left border border-zinc-200/60">
                    <h4 className="text-xs font-bold text-zinc-700 font-heading leading-snug">
                      Host A Station Or <br />Become A Franchisee
                    </h4>

                    {/* Illustration preview */}
                    <div className="mt-3 flex items-center justify-center py-2">
                      <div className="w-12 h-14 rounded-lg bg-zinc-900 border-2 border-red-600 text-white flex flex-col items-center justify-center text-[9px] font-mono p-1">
                        <span className="text-red-500 font-bold">ZEON</span>
                        <span>DC FAST</span>
                      </div>
                      <div className="w-8 h-0.5 bg-zinc-400"></div>
                      <div className="w-16 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                        HOTEL / MALL
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* About Mega Menu */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('about')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setActiveMenu(activeMenu === 'about' ? null : 'about')}
              className={`flex items-center gap-1 transition-colors hover:text-[#E50914] cursor-pointer ${
                ['/about_us', '/mission_vision'].includes(location.pathname)
                  ? 'text-[#E50914] font-bold'
                  : 'text-zinc-700'
              }`}
            >
              <span>About</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'about' ? 'rotate-180 text-[#E50914]' : ''}`} />
            </button>

            {/* About Dropdown Mega Menu (Matches Image 5) */}
            {activeMenu === 'about' && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                <div className="w-[460px] sm:w-[500px] bg-white rounded-3xl shadow-2xl border border-zinc-200 p-6 flex gap-6 text-zinc-800 animate-in fade-in zoom-in-95 duration-150">
                  {/* Left Links */}
                  <div className="flex-1 space-y-3.5 text-left py-2">
                    <Link
                      to="/about_us"
                      className="block text-sm font-medium text-zinc-700 hover:text-[#E50914] hover:translate-x-1 transition-all"
                    >
                      About Us
                    </Link>
                    <Link
                      to="/mission_vision"
                      className="block text-sm font-medium text-zinc-700 hover:text-[#E50914] hover:translate-x-1 transition-all"
                    >
                      Mission
                    </Link>
                  </div>

                  {/* Right Visual Card */}
                  <div className="w-56 bg-zinc-100 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden text-left border border-zinc-200/60">
                    <h4 className="text-xs font-bold text-zinc-700 font-heading leading-snug">
                      Learn More <br />About ZEON & Mission
                    </h4>

                    <div className="mt-3 flex items-center justify-center py-2">
                      <div className="px-3 py-2 rounded-xl bg-zinc-900 border border-red-600/60 text-center">
                        <span className="text-[10px] text-red-400 font-bold block">ZEON CHARGING</span>
                        <span className="text-[8px] text-zinc-400">Powering EV India</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* User Auth / Profile Pill on Right */}
        <div className="pl-2 border-l border-zinc-200 flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-800 transition-colors"
                title="View Profile"
              >
                <User className="w-3.5 h-3.5 text-[#E50914]" />
                <span className="hidden sm:inline">{user?.name?.split(' ')[0] || 'Account'}</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1 rounded-full text-zinc-400 hover:text-[#E50914] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 px-3.5 py-1 rounded-full bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <LogIn className="w-3 h-3" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
