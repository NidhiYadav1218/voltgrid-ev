import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Zap,
  Store,
  Shield,
  Car,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  AlertCircle,
  Building,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { VEHICLES } from '../constants/vehicles.js';

export default function Login({ defaultPortal }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // Determine initial portal: 'vendor', 'admin', or 'driver'
  const determinePortal = () => {
    if (defaultPortal) return defaultPortal;
    const fromPath = location.state?.from?.pathname || '';
    const search = location.search || '';
    if (fromPath.startsWith('/vendor') || search.includes('portal=vendor')) return 'vendor';
    if (fromPath.startsWith('/admin') || search.includes('portal=admin')) return 'admin';
    return 'driver';
  };

  const [portal, setPortal] = useState(determinePortal);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [selectedCar, setSelectedCar] = useState('MG ZS EV');
  const [cpoName, setCpoName] = useState('');
  const [gstin, setGstin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync portal if state changes
  useEffect(() => {
    setPortal(determinePortal());
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister && portal === 'driver') {
        await register({
          name,
          email,
          phone,
          password,
          car: selectedCar
        });
      } else {
        await login(email, password);
      }

      // Route to destination based on portal / from state
      const from = location.state?.from?.pathname;
      if (from && from !== '/login') {
        navigate(from, { replace: true });
      } else if (portal === 'vendor') {
        navigate('/vendor', { replace: true });
      } else if (portal === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPassword, targetPortal) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsRegister(false);
    setError('');
    if (targetPortal) setPortal(targetPortal);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-slate-100 relative overflow-hidden">
      {/* Background radial glow */}
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
          portal === 'vendor'
            ? 'bg-amber-500/10'
            : portal === 'admin'
            ? 'bg-indigo-500/10'
            : 'bg-emerald-500/10'
        }`}
      ></div>

      <div className="w-full max-w-md bg-slate-800/90 backdrop-blur border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        {/* Portal Switcher Tabs */}
        <div className="flex p-1 bg-slate-950/80 rounded-2xl mb-6 border border-slate-700/60 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setPortal('driver');
              setError('');
              setIsRegister(false);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              portal === 'driver'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Driver</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPortal('vendor');
              setError('');
              setIsRegister(false);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              portal === 'vendor'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>CPO Vendor</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPortal('admin');
              setError('');
              setIsRegister(false);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              portal === 'admin'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Brand & Portal Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className={`w-12 h-12 rounded-2xl p-0.5 shadow-lg mb-3 transition-all ${
              portal === 'vendor'
                ? 'bg-gradient-to-tr from-amber-500 to-emerald-400 shadow-amber-500/20'
                : portal === 'admin'
                ? 'bg-gradient-to-tr from-indigo-500 to-cyan-400 shadow-indigo-500/20'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-emerald-500/20'
            }`}
          >
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              {portal === 'vendor' ? (
                <Store className="w-6 h-6 text-amber-400" />
              ) : portal === 'admin' ? (
                <Shield className="w-6 h-6 text-indigo-400" />
              ) : (
                <Zap className="w-6 h-6 text-emerald-400" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white font-heading">
              VOLT<span className={portal === 'vendor' ? 'text-amber-400' : portal === 'admin' ? 'text-indigo-400' : 'text-emerald-400'}>GRID</span>
            </h1>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                portal === 'vendor'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                  : portal === 'admin'
                  ? 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60'
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
              }`}
            >
              {portal === 'vendor' ? 'CPO Partner' : portal === 'admin' ? 'Supergrid Admin' : 'EV Driver'}
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            {portal === 'vendor'
              ? 'Charge Point Operator Hub • Manage bays, dynamic tariffs & auto-sweep IMPS payouts'
              : portal === 'admin'
              ? 'Gujarat State Supergrid Operations Command & Escrow Oversight'
              : isRegister
              ? 'Create your Gujarat EV Supergrid account'
              : 'Sign in for instant 15-minute slot holds & telemetry digital passes'}
          </p>
        </div>

        {/* Tab switch for Driver only */}
        {portal === 'driver' && (
          <div className="flex p-1 bg-slate-950/60 rounded-xl mb-6 border border-slate-700/60">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                !isRegister ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                isRegister ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Register Driver
            </button>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && portal === 'driver' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Patel"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Mobile Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 90000 00001"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Primary Electric Vehicle</label>
                <div className="relative">
                  <Car className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={selectedCar}
                    onChange={(e) => setSelectedCar(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all"
                  >
                    {Object.keys(VEHICLES).map((v) => (
                      <option key={v} value={v}>
                        {v} ({VEHICLES[v].type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              {portal === 'vendor' ? 'CPO Business Email' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  portal === 'vendor'
                    ? 'partner@tatapower.com or pulse@jiobp.com'
                    : 'name@example.com'
                }
                className={`w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-all ${
                  portal === 'vendor'
                    ? 'focus:border-amber-500'
                    : portal === 'admin'
                    ? 'focus:border-indigo-500'
                    : 'focus:border-emerald-500'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className={`w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-all ${
                  portal === 'vendor'
                    ? 'focus:border-amber-500'
                    : portal === 'admin'
                    ? 'focus:border-indigo-500'
                    : 'focus:border-emerald-500'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
              portal === 'vendor'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/20'
                : portal === 'admin'
                ? 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 shadow-indigo-500/20'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/20'
            }`}
          >
            {loading ? (
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              <>
                <span>
                  {portal === 'vendor'
                    ? 'Authenticate CPO Partner'
                    : portal === 'admin'
                    ? 'Authenticate Administrator'
                    : isRegister
                    ? 'Create Account'
                    : 'Authenticate & Continue'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Logins Tailored per Portal */}
        <div className="mt-6 pt-5 border-t border-slate-700/60 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2.5">
            Quick Fill Demo Accounts
          </span>

          {portal === 'vendor' ? (
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => fillDemo('vendor@example.com', 'vendorpassword123', 'vendor')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-500 text-[11px] text-amber-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                <span>⛽</span>
                <span>Jio-bp pulse CPO</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('tatapower.cpo@example.com', 'vendorpassword123', 'vendor')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-500 text-[11px] text-amber-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                <span>⚡</span>
                <span>Tata Power CPO</span>
              </button>
            </div>
          ) : portal === 'admin' ? (
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => fillDemo('admin@example.com', 'adminpassword123', 'admin')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-indigo-500 text-[11px] text-indigo-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                <span>🔑</span>
                <span>Admin Console</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => fillDemo('driver1@example.com', 'Password123!', 'driver')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-500 text-[11px] text-emerald-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                <span>🚗</span>
                <span>Demo Driver</span>
              </button>
            </div>
          )}

          {/* Quick Portal Switch Hint */}
          <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-slate-500">
            <span>Or switch to:</span>
            {portal !== 'driver' && (
              <button
                type="button"
                onClick={() => setPortal('driver')}
                className="text-emerald-400 hover:underline"
              >
                Driver
              </button>
            )}
            {portal !== 'vendor' && (
              <button
                type="button"
                onClick={() => setPortal('vendor')}
                className="text-amber-400 hover:underline"
              >
                CPO Vendor
              </button>
            )}
            {portal !== 'admin' && (
              <button
                type="button"
                onClick={() => setPortal('admin')}
                className="text-indigo-400 hover:underline"
              >
                Admin
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
