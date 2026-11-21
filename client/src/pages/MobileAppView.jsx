import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GUJARAT_STATIONS } from '../data/gujaratStations.js';
import {
  MapPin,
  Search,
  Navigation,
  Layers,
  RotateCw,
  SlidersHorizontal,
  X,
  Check,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Zap,
  Car,
  Heart,
  Menu,
  Phone,
  Mail,
  Shield,
  CreditCard,
  QrCode,
  Compass,
  Download,
  Smartphone,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Info,
  Share2
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

export default function MobileAppView() {
  // Responsive screen detection: true on real phones & standalone PWA apps
  const [isMobileScreen, setIsMobileScreen] = useState(
    typeof window !== 'undefined'
      ? (window.innerWidth < 768 || window.matchMedia('(display-mode: standalone)').matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent))
      : false
  );
  const [deviceMode, setDeviceMode] = useState('phone');

  useEffect(() => {
    const checkMobile = () => {
      const isMobile =
        window.innerWidth < 768 ||
        window.matchMedia('(display-mode: standalone)').matches ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobileScreen(isMobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Invalidate Leaflet map size on viewport change
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 200);
    }
  }, [isMobileScreen, deviceMode]);

  // App mode: 'map' (live interactive app) or 'tutorial' (walkthrough)
  const [appView, setAppView] = useState('map');
  const [onboardingStep, setOnboardingStep] = useState(0);

  // Active Bottom Tab: 'Map', 'MyEVs', 'Scan', 'Favourites', 'More'
  const [activeTab, setActiveTab] = useState('Map');

  // Map state
  const [mapType, setMapType] = useState('streets'); // 'streets' or 'satellite'
  const [selectedStation, setSelectedStation] = useState(GUJARAT_STATIONS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filteredStations, setFilteredStations] = useState(GUJARAT_STATIONS);

  // Modals & Bottom Sheets
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showAuthSheet, setShowAuthSheet] = useState(false);
  const [pendingTabAfterAuth, setPendingTabAfterAuth] = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showTripModal, setShowTripModal] = useState(false);
  const [showMyEVsSheet, setShowMyEVsSheet] = useState(false);
  const [showFavouritesSheet, setShowFavouritesSheet] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showChargingSimulator, setShowChargingSimulator] = useState(false);
  const [showInstallHelpModal, setShowInstallHelpModal] = useState(false);
  const [pwaPrompt, setPwaPrompt] = useState(null);

  // Authentication State (Matching User's Photo with Phone, Email & Reg Number)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authStep, setAuthStep] = useState(1); // 1: Form, 2: OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [regPart1, setRegPart1] = useState('GJ');
  const [regPart2, setRegPart2] = useState('01');
  const [regPart3, setRegPart3] = useState('EV');
  const [regPart4, setRegPart4] = useState('4421');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  // User EV & Wallet State
  const [walletBalance, setWalletBalance] = useState(10000.0);
  const [userEVs, setUserEVs] = useState([
    {
      id: 'ev-1',
      name: 'Tata Nexon EV Max',
      plate: 'GJ-01-EV-4421',
      soc: 76,
      range: 315,
      batterySize: '40.5 kWh',
      connector: 'CCS2',
      rfidLinked: 'VG-RFID-8849-GUJ',
      autoCharge: true
    }
  ]);
  const [favouriteStationIds, setFavouriteStationIds] = useState([
    GUJARAT_STATIONS[0]?.name,
    GUJARAT_STATIONS[1]?.name
  ]);

  // Charging session state
  const [chargingSoC, setChargingSoC] = useState(48);
  const [chargingKw, setChargingKw] = useState(118.4);
  const [chargingKwh, setChargingKwh] = useState(14.8);
  const [chargingCost, setChargingCost] = useState(355.2);

  // Filters State
  const [capacityFilter, setCapacityFilter] = useState(120);
  const [chargerTypeFilter, setChargerTypeFilter] = useState('ALL'); // ALL, DC, AC
  const [connectorFilter, setConnectorFilter] = useState('ALL'); // ALL, CCS2, Type II, 16A

  // Map container reference
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Capture beforeinstallprompt for native PWA installation
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setPwaPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = () => {
    if (pwaPrompt) {
      pwaPrompt.prompt();
      pwaPrompt.userChoice.then(() => {
        setPwaPrompt(null);
      });
    } else {
      setShowInstallHelpModal(true);
    }
  };

  // 1. Initialize Leaflet Map (Safe Mount / Unmount Lifecycle)
  useEffect(() => {
    if (appView !== 'map') return;
    if (!mapContainerRef.current) return;

    // Remove any previous map instance to prevent "Map container is already initialized"
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialLat = selectedStation ? selectedStation.lat : 23.0225;
    const initialLng = selectedStation ? selectedStation.lng : 72.5714;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 12,
      zoomControl: false,
      attributionControl: false
    });

    const tileUrl =
      mapType === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);
    mapInstanceRef.current = map;

    // Size invalidation passes
    const timer1 = setTimeout(() => map.invalidateSize(), 150);
    const timer2 = setTimeout(() => map.invalidateSize(), 450);

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [appView, mapType]);

  // 2. Render Markers for Gujarat Stations
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.invalidateSize();

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    filteredStations.forEach((st) => {
      const lat = Number(st.lat);
      const lng = Number(st.lng);
      if (!lat || !lng || isNaN(lat) || isNaN(lng)) return;

      const isSelected = selectedStation?.name === st.name;
      const customIcon = L.divIcon({
        className: 'voltgrid-pin-div',
        html: `
          <div style="position: relative; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; inset: -4px; border-radius: 50%; background: ${
              isSelected ? 'rgba(229, 9, 20, 0.45)' : 'rgba(229, 9, 20, 0.2)'
            }; animation: ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="width: 36px; height: 36px; border-radius: 50%; background: ${
              isSelected ? '#991b1b' : '#D30C15'
            }; border: 2.5px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 900; font-size: 16px; transform: scale(${
          isSelected ? 1.25 : 1
        }); transition: all 0.2s;">
              ⚡
            </div>
          </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 21]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      marker.on('click', () => {
        setSelectedStation(st);
        map.panTo([lat, lng], { animate: true });
      });

      markersRef.current.push(marker);
    });
  }, [filteredStations, selectedStation, appView]);

  // Handle Tab Switch (With Phone/OTP Auth check for My EVs and Favourites)
  const handleTabClick = (tabName) => {
    if (tabName === 'Scan') {
      setShowScanModal(true);
      return;
    }

    if (tabName === 'MyEVs' || tabName === 'Favourites') {
      if (!isLoggedIn) {
        setPendingTabAfterAuth(tabName);
        setAuthStep(1);
        setShowAuthSheet(true);
        return;
      }
      if (tabName === 'MyEVs') {
        setShowMyEVsSheet(true);
        setActiveTab('MyEVs');
        return;
      }
      if (tabName === 'Favourites') {
        setShowFavouritesSheet(true);
        setActiveTab('Favourites');
        return;
      }
    }

    if (tabName === 'More') {
      setShowMoreMenu(true);
      return;
    }

    setActiveTab(tabName);
  };

  // Auth Handlers
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phoneNumber.replace(/\D/g, '').length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    setAuthStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowAuthSheet(false);

    if (regPart1 && regPart2 && regPart3 && regPart4) {
      const newPlate = `${regPart1}-${regPart2}-${regPart3}-${regPart4}`.toUpperCase();
      setUserEVs((prev) => [
        {
          id: `ev-${Date.now()}`,
          name: 'Registered EV',
          plate: newPlate,
          soc: 82,
          range: 340,
          batterySize: '50 kWh',
          connector: 'CCS2',
          rfidLinked: 'VG-RFID-GUJ-992',
          autoCharge: true
        },
        ...prev
      ]);
    }

    if (pendingTabAfterAuth === 'MyEVs') {
      setShowMyEVsSheet(true);
      setActiveTab('MyEVs');
    } else if (pendingTabAfterAuth === 'Favourites') {
      setShowFavouritesSheet(true);
      setActiveTab('Favourites');
    }
    setPendingTabAfterAuth(null);
  };

  const handleAutoFillOtp = () => {
    setOtp(['9', '3', '2', '6', '7', '0']);
  };

  // Filters
  const handleApplyFilters = () => {
    let result = GUJARAT_STATIONS;

    if (chargerTypeFilter === 'DC') {
      result = result.filter((st) => st.ports.some((p) => p.type.includes('DC')));
    } else if (chargerTypeFilter === 'AC') {
      result = result.filter((st) => st.ports.some((p) => p.type.includes('AC')));
    }

    if (connectorFilter !== 'ALL') {
      result = result.filter((st) =>
        st.ports.some((p) => p.connector.toLowerCase().includes(connectorFilter.toLowerCase()))
      );
    }

    setFilteredStations(result);
    if (result.length > 0) {
      setSelectedStation(result[0]);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo([result[0].lat, result[0].lng]);
      }
    }
    setShowFilterSheet(false);
  };

  const handleClearFilters = () => {
    setCapacityFilter(120);
    setChargerTypeFilter('ALL');
    setConnectorFilter('ALL');
    setFilteredStations(GUJARAT_STATIONS);
    setShowFilterSheet(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredStations(GUJARAT_STATIONS);
      return;
    }
    const q = query.toLowerCase();
    const matches = GUJARAT_STATIONS.filter(
      (st) =>
        st.name.toLowerCase().includes(q) ||
        st.city.toLowerCase().includes(q) ||
        st.location.toLowerCase().includes(q)
    );
    setFilteredStations(matches);
    if (matches.length > 0) {
      setSelectedStation(matches[0]);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo([matches[0].lat, matches[0].lng]);
      }
    }
  };

  const handleLocateMe = () => {
    if (mapInstanceRef.current && selectedStation) {
      mapInstanceRef.current.setView([selectedStation.lat, selectedStation.lng], 14, {
        animate: true
      });
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 600);
  };

  const toggleFavorite = (stationName) => {
    if (favouriteStationIds.includes(stationName)) {
      setFavouriteStationIds(favouriteStationIds.filter((name) => name !== stationName));
    } else {
      setFavouriteStationIds([...favouriteStationIds, stationName]);
    }
  };

  // Onboarding Slides (Photos 6 to 11)
  const onboardingSlides = [
    {
      title: 'Search & Browse Stations',
      text: 'Search and browse for VoltGrid charging stations through map screen',
      subtext: 'Find real-time live bays across all Gujarat cities & expressways.'
    },
    {
      title: 'VoltGrid Wallet Quick Access',
      text: 'Click on wallet button in the map screen to access your wallet',
      subtext: 'Check live balance, download GST invoices, and top-up seamlessly.'
    },
    {
      title: 'Effortless Top-Up',
      text: 'Top up your wallet through your preferred payment method',
      subtext: 'Instant UPI (GPay, PhonePe, Paytm), Cards & Netbanking.'
    },
    {
      title: 'Fast QR Scan to Charge',
      text: 'Tap on the Scan button to quickly start charging at a VoltGrid Charging Station',
      subtext: 'Plug into your EV and scan the connector gun QR code to initiate high-speed DC charging.'
    },
    {
      title: 'Station Info & Port Availability',
      text: 'Or tap on any of the map pin to access that charging station',
      subtext: 'Inspect live kW telemetry, pricing rates, amenities, and turn-by-turn navigation.'
    },
    {
      title: 'Intelligent Trip Planner',
      text: 'Tap on trip planner to pre-plan your charging stops for a long drive',
      subtext: 'Calculate charging pit-stops along NE-1, NH-48, and Saurashtra coastal corridors.'
    }
  ];

  return (
    <div
      className={
        isMobileScreen
          ? 'fixed inset-0 w-full h-[100dvh] z-50 bg-white text-zinc-900 overflow-hidden flex flex-col p-0 m-0 select-none'
          : 'min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-start p-1 sm:p-4 font-sans selection:bg-red-600 selection:text-white'
      }
    >
      {/* Top Navigation Bar (Shown ONLY on Desktop Screens) */}
      {!isMobileScreen && (
        <header className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-3 py-2.5 px-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl mb-3 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors font-bold text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <span className="text-zinc-700">|</span>
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-black italic tracking-tighter text-base">⚡ VOLTGRID</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 font-mono font-bold border border-red-600/30">
                APP
              </span>
            </div>
          </div>

          {/* View mode toggle (Live Map vs Onboarding Tutorial) */}
          <div className="flex items-center gap-2">
            <div className="bg-zinc-800 p-1 rounded-xl flex items-center gap-1 border border-zinc-700">
              <button
                onClick={() => setAppView('map')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  appView === 'map' ? 'bg-red-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                🗺️ Live Map
              </button>
              <button
                onClick={() => setAppView('tutorial')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  appView === 'tutorial' ? 'bg-red-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                📱 Tutorial
              </button>
            </div>

            {/* Desktop Frame / Fullscreen Switch */}
            <button
              onClick={() => setDeviceMode(deviceMode === 'phone' ? 'fullscreen' : 'phone')}
              className="hidden sm:flex px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold items-center gap-1.5 border border-zinc-700 text-zinc-300 transition-all"
              title="Toggle between phone mockup frame and full viewport"
            >
              {deviceMode === 'phone' ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              <span>{deviceMode === 'phone' ? 'Full' : 'Frame'}</span>
            </button>

            {/* Genuine Phone Install Button */}
            <button
              onClick={handleInstallApp}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-red-600/30 transition-transform active:scale-95"
              title="Install VoltGrid App on Phone"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Install on Phone</span>
            </button>
          </div>
        </header>
      )}

      {/* Main App Container */}
      <div
        className={`relative transition-all duration-300 w-full ${
          isMobileScreen
            ? 'w-full h-[100dvh] flex-1 bg-white text-zinc-900 overflow-hidden flex flex-col p-0 m-0 rounded-none border-0 shadow-none ring-0'
            : deviceMode === 'phone'
            ? 'max-w-[420px] h-[840px] rounded-[52px] border-[8px] border-zinc-800 shadow-2xl bg-white text-zinc-900 overflow-hidden flex flex-col ring-1 ring-zinc-700/50'
            : 'max-w-5xl h-[88vh] rounded-3xl border border-zinc-800 shadow-2xl bg-white text-zinc-900 overflow-hidden flex flex-col'
        }`}
      >
        {/* Dynamic Island Notch on Phone Frame (ONLY on Desktop Phone Mockup) */}
        {!isMobileScreen && deviceMode === 'phone' && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 w-28 h-5 bg-black rounded-full flex items-center justify-between px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-900"></div>
            <div className="w-3 h-3 rounded-full bg-zinc-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-950"></div>
            </div>
          </div>
        )}

        {/* 1. ONBOARDING TUTORIAL VIEW */}
        {appView === 'tutorial' ? (
          <div className="w-full h-full bg-gradient-to-b from-[#D30C15] via-[#C00A13] to-[#99060E] text-white flex flex-col justify-between p-6 relative overflow-hidden select-none">
            {/* Background arches */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="w-[600px] h-[600px] rounded-full border-[40px] border-white/20 -top-40 -left-20 absolute"></div>
              <div className="w-[500px] h-[500px] rounded-full border-[30px] border-white/10 -bottom-40 -right-20 absolute"></div>
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between pt-4">
              {onboardingStep > 0 ? (
                <button
                  onClick={() => setOnboardingStep((prev) => prev - 1)}
                  className="text-white/90 hover:text-white text-sm font-bold flex items-center gap-1 transition-transform active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div className="w-12"></div>
              )}

              <button
                onClick={() => setAppView('map')}
                className="text-white/90 hover:text-white text-sm font-bold flex items-center gap-1 transition-transform active:scale-95"
              >
                <span>Skip to Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Device preview */}
            <div className="relative z-10 flex-1 flex items-center justify-center my-4">
              <div className="w-64 h-[390px] bg-zinc-900 rounded-[38px] p-2.5 border-[4px] border-zinc-950 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="w-20 h-3 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-zinc-900"></div>
                </div>

                <div className="flex-1 bg-zinc-100 rounded-[28px] p-3 flex flex-col justify-between relative overflow-hidden text-zinc-900">
                  <div className="space-y-1.5">
                    <div
                      className={`flex items-center justify-between bg-white rounded-full px-3 py-1.5 shadow-sm border ${
                        onboardingStep === 0 || onboardingStep === 5
                          ? 'border-red-500 ring-2 ring-red-400'
                          : 'border-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-1 text-[9px] font-medium text-zinc-600">
                        <Search className="w-2.5 h-2.5 text-zinc-400" />
                        <span>Search</span>
                      </div>
                      <div className="w-px h-3 bg-zinc-200"></div>
                      <div
                        className={`flex items-center gap-1 text-[9px] font-bold ${
                          onboardingStep === 5 ? 'text-red-600 animate-pulse' : 'text-zinc-700'
                        }`}
                      >
                        <Compass className="w-2.5 h-2.5 text-red-500" />
                        <span>Plan a trip</span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div
                        className={`flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border shadow-sm ${
                          onboardingStep === 1
                            ? 'border-red-500 ring-2 ring-red-400 bg-red-50 animate-bounce'
                            : 'border-zinc-200'
                        }`}
                      >
                        <div className="w-3.5 h-3.5 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[7px]">
                          ₹
                        </div>
                        <span className="text-[9px] font-bold text-zinc-800">10,000</span>
                      </div>
                    </div>
                  </div>

                  {onboardingStep === 2 ? (
                    <div className="bg-red-600 rounded-2xl p-4 text-white text-center shadow-md animate-in fade-in">
                      <span className="text-[8px] text-red-200 uppercase font-mono block">Current balance</span>
                      <span className="text-2xl font-black block">₹ 1000.00</span>
                      <div className="mt-2 bg-white text-red-600 text-[10px] font-bold py-1 px-3 rounded-full inline-block shadow-sm">
                        Add Money
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div
                          className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center shadow-lg transition-all ${
                            onboardingStep === 4
                              ? 'bg-red-600 text-white scale-125 ring-4 ring-red-400 animate-pulse'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          <Zap className="w-6 h-6 fill-current" />
                        </div>
                        <span className="text-[11px] font-black text-red-600 block mt-2">
                          Ahmedabad HyperHub
                        </span>
                        <span className="text-[9px] text-zinc-500 block">120 kW • Available</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between bg-white rounded-full px-2 py-1 shadow-sm border border-zinc-200 text-[8px] text-zinc-500">
                    <span className="text-red-600 font-bold">Map</span>
                    <span>My EVs</span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold ${
                        onboardingStep === 3
                          ? 'bg-red-600 ring-2 ring-red-400 scale-125 animate-pulse'
                          : 'bg-red-600'
                      }`}
                    >
                      ⚡
                    </div>
                    <span>Favourites</span>
                    <span>More</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description text */}
            <div className="relative z-10 text-center space-y-2 px-2">
              <h2 className="text-lg sm:text-xl font-bold leading-snug">
                {onboardingSlides[onboardingStep].text}
              </h2>
              <p className="text-xs text-red-100 max-w-xs mx-auto">
                {onboardingSlides[onboardingStep].subtext}
              </p>
            </div>

            {/* Pagination dots */}
            <div className="relative z-10 flex items-center justify-center gap-2 my-3">
              {onboardingSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setOnboardingStep(idx)}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    idx === onboardingStep ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            {/* Action button */}
            <div className="relative z-10 pt-2">
              {onboardingStep === 5 ? (
                <button
                  onClick={() => setAppView('map')}
                  className="w-full py-3.5 bg-white hover:bg-zinc-100 text-[#D30C15] font-black text-sm rounded-full shadow-2xl flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <div className="w-5 h-5 rounded-full bg-[#D30C15] text-white flex items-center justify-center text-xs">
                    ⚡
                  </div>
                  <span>Get Started & Open Map</span>
                </button>
              ) : (
                <button
                  onClick={() => setOnboardingStep((prev) => prev + 1)}
                  className="w-full py-3.5 bg-white hover:bg-zinc-100 text-[#D30C15] font-black text-sm rounded-full shadow-2xl flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* 2. MAIN LIVE MAP APPLICATION VIEW */
          <div className="w-full h-full flex flex-col justify-between relative bg-zinc-100 overflow-hidden">
            {/* Top Bar with Search & Plan a Trip & Floating Wallet */}
            <div className="absolute top-4 left-3 right-3 z-30 space-y-2 pointer-events-none">
              <div className="pointer-events-auto bg-white rounded-full shadow-lg border border-zinc-200/90 flex items-center p-1.5 transition-all">
                <div className="flex-1 flex items-center gap-2 px-3">
                  <Search className="w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search station or city in Gujarat..."
                    className="w-full text-xs text-zinc-800 placeholder-zinc-400 outline-none bg-transparent font-medium"
                  />
                  {searchQuery && (
                    <button onClick={() => handleSearch('')} className="text-zinc-400 hover:text-zinc-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="w-px h-5 bg-zinc-200"></div>

                <button
                  onClick={() => setShowTripModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-700 hover:text-red-600 transition-colors whitespace-nowrap"
                >
                  <Compass className="w-3.5 h-3.5 text-red-600" />
                  <span>Plan a trip</span>
                </button>
              </div>

              {/* Floating Wallet Pill */}
              <div className="flex justify-end pointer-events-auto">
                <button
                  onClick={() => setShowWalletModal(true)}
                  className="flex items-center gap-1.5 bg-white/95 hover:bg-white px-3 py-1.5 rounded-full shadow-md border border-zinc-200 text-xs font-bold text-zinc-800 transition-transform active:scale-95 group"
                >
                  <div className="w-4 h-4 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[9px] group-hover:bg-red-600 transition-colors">
                    ₹
                  </div>
                  <span>{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
                </button>
              </div>
            </div>

            {/* Interactive Leaflet Map Canvas */}
            <div className="w-full h-full relative z-10 flex-1 min-h-[480px]">
              <div
                ref={mapContainerRef}
                style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
                className="bg-[#f0f3f4]"
              />

              {/* Left Action Buttons (Layer & Refresh) */}
              <div className="absolute bottom-64 left-3 z-20 flex flex-col gap-2.5">
                <button
                  onClick={() => setMapType(mapType === 'streets' ? 'satellite' : 'streets')}
                  title="Toggle Satellite / Streets"
                  className="w-11 h-11 rounded-full bg-white text-zinc-800 shadow-xl border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 active:scale-90 transition-all"
                >
                  <Layers className={`w-5 h-5 ${mapType === 'satellite' ? 'text-red-600' : 'text-zinc-700'}`} />
                </button>

                <button
                  onClick={handleRefresh}
                  title="Refresh station telemetry"
                  className="w-11 h-11 rounded-full bg-white text-zinc-800 shadow-xl border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 active:scale-90 transition-all"
                >
                  <RotateCw className={`w-5 h-5 text-zinc-700 ${isRefreshing ? 'animate-spin text-red-600' : ''}`} />
                </button>
              </div>

              {/* Right Action Buttons (Locate GPS & Filter) */}
              <div className="absolute bottom-64 right-3 z-20 flex flex-col gap-2.5">
                <button
                  onClick={handleLocateMe}
                  title="Center on Gujarat"
                  className="w-11 h-11 rounded-full bg-white text-zinc-800 shadow-xl border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 active:scale-90 transition-all"
                >
                  <Navigation className="w-5 h-5 text-zinc-700" />
                </button>

                <button
                  onClick={() => setShowFilterSheet(true)}
                  title="Open Filters"
                  className="w-11 h-11 rounded-full bg-white text-zinc-800 shadow-xl border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 active:scale-90 transition-all"
                >
                  <SlidersHorizontal className="w-5 h-5 text-zinc-700" />
                </button>
              </div>

              {/* Station Details Bottom Card (Photo 3) */}
              {selectedStation && (
                <div className="absolute bottom-16 left-3 right-3 z-20 bg-white rounded-3xl p-4 shadow-2xl border border-zinc-200/90 animate-in slide-in-from-bottom duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-emerald-500 text-emerald-600 text-[10px] font-bold">
                      <Info className="w-2.5 h-2.5" />
                      <span>Public</span>
                    </span>

                    <button
                      onClick={() => toggleFavorite(selectedStation.name)}
                      className="p-1 text-zinc-400 hover:text-red-600 transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          favouriteStationIds.includes(selectedStation.name)
                            ? 'text-red-600 fill-current'
                            : 'text-zinc-400'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-sm text-zinc-900 leading-tight">
                        {selectedStation.name}
                      </h3>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        <span className="text-emerald-600 font-bold">Open</span> • 24 hours | {selectedStation.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black italic text-red-600">VOLTGRID ⚡</span>
                    </div>
                  </div>

                  {/* Ports List */}
                  <div className="mt-3 border-t border-zinc-100 pt-2 space-y-1.5 max-h-24 overflow-y-auto">
                    {selectedStation.ports && selectedStation.ports.slice(0, 2).map((port, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-0.5">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-white font-mono text-[9px] font-bold">
                            {port.type.includes('DC') ? 'DC' : 'AC'}
                          </span>
                          <span className="font-bold text-red-600">{port.connector}</span>
                        </div>
                        <span className="text-zinc-700 font-medium">{port.maxKw || 120} kW</span>
                        <span
                          className={`font-bold text-[11px] ${
                            port.status === 'available' ? 'text-emerald-600' : 'text-amber-600'
                          }`}
                        >
                          {port.status === 'available' ? 'Available' : 'Charging'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Details & Directions Buttons */}
                  <div className="mt-3 flex items-center gap-2 pt-2 border-t border-zinc-100">
                    <button
                      onClick={() =>
                        alert(
                          `Station: ${selectedStation.name}\nLocation: ${selectedStation.location}\nRate: ₹${selectedStation.pricePerKwh || 24}/kWh\nAmenities: ${selectedStation.amenities?.join(', ') || 'Cafe, Restroom, EV Lounge'}`
                        )
                      }
                      className="flex-1 py-2.5 rounded-2xl border border-zinc-300 hover:border-zinc-400 bg-white text-zinc-800 font-bold text-xs text-center transition-colors"
                    >
                      Details
                    </button>
                    <a
                      href={selectedStation.directionsUrl || selectedStation.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-md shadow-red-600/30 transition-transform active:scale-95"
                    >
                      <span>Directions</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Navigation Bar */}
            <div className="relative z-30 bg-white border-t border-zinc-200 px-3 py-2 flex items-center justify-between shadow-lg">
              <button
                onClick={() => handleTabClick('Map')}
                className={`flex-1 flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
                  activeTab === 'Map' ? 'text-red-600' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <MapPin className="w-5 h-5" />
                <span>Map</span>
              </button>

              <button
                onClick={() => handleTabClick('MyEVs')}
                className={`flex-1 flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
                  activeTab === 'MyEVs' ? 'text-red-600' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Car className="w-5 h-5" />
                <span>My EVs</span>
              </button>

              <div className="flex-1 flex flex-col items-center -mt-6">
                <button
                  onClick={() => handleTabClick('Scan')}
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xl shadow-red-600/40 border-4 border-white transition-transform active:scale-95"
                >
                  <Zap className="w-7 h-7 fill-current" />
                </button>
                <span className="text-[10px] font-bold text-zinc-600 mt-0.5">Scan</span>
              </div>

              <button
                onClick={() => handleTabClick('Favourites')}
                className={`flex-1 flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
                  activeTab === 'Favourites' ? 'text-red-600' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Heart className="w-5 h-5" />
                <span>Favourites</span>
              </button>

              <button
                onClick={() => handleTabClick('More')}
                className={`flex-1 flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
                  activeTab === 'More' ? 'text-red-600' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Menu className="w-5 h-5" />
                <span>More</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. AUTHENTICATION BOTTOM SHEET (Matches Photo with Phone, Email & Vehicle Registration) */}
        {showAuthSheet && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-150">
            <div className="w-full bg-white rounded-t-[32px] p-6 shadow-2xl space-y-4 max-h-[92%] overflow-y-auto text-zinc-900">
              <div className="w-12 h-1.5 bg-zinc-300 rounded-full mx-auto mb-1"></div>

              {authStep === 1 ? (
                /* Step 1: Phone Number, Email & Vehicle Reg Number */
                <form onSubmit={handleSendOtp} className="space-y-3.5">
                  <div className="text-center pb-1">
                    <span className="text-xl font-black italic tracking-tighter text-red-600 font-heading">
                      ⚡ VOLTGRID
                    </span>
                    <h3 className="text-base font-bold text-zinc-900 mt-1">Login / Register to VoltGrid</h3>
                    <p className="text-[11px] text-zinc-500">
                      Required to access My EVs, Favourites, and seamless AutoCharge.
                    </p>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-700">Phone Number</label>
                    <div className="flex items-center border border-zinc-300 focus-within:border-red-600 rounded-xl px-3 py-2 bg-zinc-50/50">
                      <span className="text-xs font-bold text-zinc-700 pr-2 border-r border-zinc-300">🇮🇳 +91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="Phone Number (e.g. 9326703345)"
                        className="flex-1 pl-3 text-xs font-bold text-zinc-900 outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-700">Email Address</label>
                    <div className="flex items-center border border-zinc-300 focus-within:border-red-600 rounded-xl px-3 py-2 bg-zinc-50/50">
                      <Mail className="w-3.5 h-3.5 text-zinc-400 mr-2" />
                      <input
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="Enter your mail ID"
                        className="flex-1 text-xs text-zinc-900 outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Vehicle Registration Number (Matches photo boxes TN 12 AB 1102 / GJ 01 EV 4421) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-700">Vehicle Registration Number</label>
                    <div className="grid grid-cols-4 gap-2">
                      <input
                        type="text"
                        maxLength={2}
                        value={regPart1}
                        onChange={(e) => setRegPart1(e.target.value.toUpperCase())}
                        placeholder="GJ"
                        className="text-center font-mono font-bold text-xs uppercase border border-zinc-300 focus:border-red-600 rounded-xl py-2 bg-zinc-50/50 outline-none"
                      />
                      <input
                        type="text"
                        maxLength={2}
                        value={regPart2}
                        onChange={(e) => setRegPart2(e.target.value)}
                        placeholder="01"
                        className="text-center font-mono font-bold text-xs border border-zinc-300 focus:border-red-600 rounded-xl py-2 bg-zinc-50/50 outline-none"
                      />
                      <input
                        type="text"
                        maxLength={3}
                        value={regPart3}
                        onChange={(e) => setRegPart3(e.target.value.toUpperCase())}
                        placeholder="EV"
                        className="text-center font-mono font-bold text-xs uppercase border border-zinc-300 focus:border-red-600 rounded-xl py-2 bg-zinc-50/50 outline-none"
                      />
                      <input
                        type="text"
                        maxLength={4}
                        value={regPart4}
                        onChange={(e) => setRegPart4(e.target.value)}
                        placeholder="4421"
                        className="text-center font-mono font-bold text-xs border border-zinc-300 focus:border-red-600 rounded-xl py-2 bg-zinc-50/50 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 transition-transform active:scale-95"
                  >
                    Get OTP
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAuthSheet(false)}
                    className="w-full text-center text-xs text-zinc-400 hover:text-zinc-600 py-1"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                /* Step 2: OTP Verification */
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-black text-zinc-900">Enter OTP</h3>
                    <p className="text-xs text-zinc-500">
                      OTP sent to <span className="font-bold text-zinc-800">+91 {phoneNumber || '9326703345'}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-1.5 py-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value;
                          const newOtp = [...otp];
                          newOtp[idx] = val;
                          setOtp(newOtp);
                          if (val && e.target.nextSibling) {
                            e.target.nextSibling.focus();
                          }
                        }}
                        className="w-11 h-12 rounded-xl border-2 border-red-500/60 focus:border-red-600 text-center text-lg font-black text-zinc-900 bg-red-50/40 outline-none"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="text-red-600 font-bold underline cursor-pointer"
                    >
                      Auto-fill Demo Code (932670)
                    </button>
                    <span>Resend in 24s</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-xl shadow-red-600/30 transition-transform active:scale-95"
                  >
                    Verify & Continue
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthStep(1)}
                    className="w-full text-center text-xs text-zinc-400 hover:text-zinc-600 py-1"
                  >
                    Change Phone Number
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* 4. FILTER BOTTOM DRAWER (Photo 1) */}
        {showFilterSheet && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-150">
            <div className="w-full bg-white rounded-t-[32px] p-5 shadow-2xl space-y-4 max-h-[90%] overflow-y-auto text-zinc-900">
              <div className="w-12 h-1.5 bg-zinc-300 rounded-full mx-auto"></div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-zinc-900">Charger Capacity (kW)</h4>
                  <span className="text-xs font-mono font-bold text-red-600">{capacityFilter} kW</span>
                </div>

                <input
                  type="range"
                  min="3.3"
                  max="240"
                  step="10"
                  value={capacityFilter}
                  onChange={(e) => setCapacityFilter(Number(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />

                <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 px-1">
                  <span>3.3</span>
                  <span>7.4</span>
                  <span>24</span>
                  <span>50</span>
                  <span>120</span>
                  <span>240</span>
                  <span>&gt;240</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-extrabold text-zinc-900">Charger Type</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setChargerTypeFilter(chargerTypeFilter === 'DC' ? 'ALL' : 'DC')}
                    className={`py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      chargerTypeFilter === 'DC'
                        ? 'border-red-600 bg-red-50 text-red-600'
                        : 'border-zinc-200 text-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    <Zap className="w-4 h-4 text-red-600 fill-current" />
                    <span>DC Fast</span>
                  </button>

                  <button
                    onClick={() => setChargerTypeFilter(chargerTypeFilter === 'AC' ? 'ALL' : 'AC')}
                    className={`py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      chargerTypeFilter === 'AC'
                        ? 'border-red-600 bg-red-50 text-red-600'
                        : 'border-zinc-200 text-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-zinc-600" />
                    <span>AC Standard</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-extrabold text-zinc-900">Connector Type</h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setConnectorFilter(connectorFilter === 'CCS2' ? 'ALL' : 'CCS2')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      connectorFilter === 'CCS2' ? 'border-red-600 bg-red-50' : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full border border-zinc-400 mx-auto flex items-center justify-center text-[10px] font-mono font-bold mb-1">
                      ☷
                    </div>
                    <span className="text-xs font-bold text-zinc-800 block">CCS2</span>
                  </button>

                  <button
                    onClick={() => setConnectorFilter(connectorFilter === 'Type II' ? 'ALL' : 'Type II')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      connectorFilter === 'Type II' ? 'border-red-600 bg-red-50' : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full border border-zinc-400 mx-auto flex items-center justify-center text-[10px] font-mono font-bold mb-1">
                      ⚏
                    </div>
                    <span className="text-xs font-bold text-zinc-800 block">Type II</span>
                  </button>

                  <button
                    onClick={() => setConnectorFilter(connectorFilter === '16A' ? 'ALL' : '16A')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      connectorFilter === '16A' ? 'border-red-600 bg-red-50' : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full border border-zinc-400 mx-auto flex items-center justify-center text-[10px] font-mono font-bold mb-1">
                      ∴
                    </div>
                    <span className="text-xs font-bold text-zinc-800 block">16A - 3 Pin</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button onClick={handleClearFilters} className="text-xs font-extrabold text-red-600 hover:underline">
                  Clear Filters
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-8 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition-transform active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply Filter</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. WALLET MODAL */}
        {showWalletModal && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-150">
            <div className="w-full bg-white rounded-t-[32px] p-5 shadow-2xl space-y-4 max-h-[90%] overflow-y-auto text-zinc-900">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-zinc-900">My Wallet</h3>
                <button onClick={() => setShowWalletModal(false)} className="text-zinc-400 hover:text-zinc-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-5 text-white shadow-xl space-y-2">
                <span className="text-xs text-red-200 font-medium">Current balance</span>
                <div className="text-3xl font-black tracking-tight">₹ {walletBalance.toFixed(2)}</div>
                <div className="pt-2 flex gap-2">
                  {[500, 1000, 2000, 5000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => {
                        setWalletBalance((prev) => prev + amt);
                        alert(`Successfully added ₹${amt} to your VoltGrid Wallet via UPI!`);
                      }}
                      className="px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-[10px] font-bold border border-white/30"
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-zinc-500 uppercase font-mono">Recent Transactions</h4>
                <div className="divide-y divide-zinc-100">
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-zinc-800 block">Top-Up (UPI GPay)</span>
                      <span className="text-[10px] text-zinc-400">Today, 03:17 PM • success</span>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-600">+₹1000.00</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-zinc-800 block">S.G. Highway HyperHub</span>
                      <span className="text-[10px] text-zinc-400">18 Nov 2026, 06:40 PM • 18.4 kWh</span>
                    </div>
                    <span className="text-xs font-extrabold text-zinc-800">-₹441.60</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowWalletModal(false)}
                className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-2xl"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* 6. QR SCANNER MODAL */}
        {showScanModal && (
          <div className="absolute inset-0 z-50 bg-black/95 text-white flex flex-col justify-between p-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-red-500">VOLTGRID QR SCANNER</span>
              <button onClick={() => setShowScanModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-64 h-64 mx-auto border-2 border-red-500 rounded-3xl flex items-center justify-center overflow-hidden bg-red-950/10">
              <div className="w-full h-1 bg-red-500 shadow-lg shadow-red-500/80 animate-pulse"></div>
              <span className="absolute bottom-4 text-[10px] text-zinc-400 font-mono">
                Point at charger gun QR code
              </span>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowScanModal(false);
                  setShowChargingSimulator(true);
                }}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-2xl shadow-xl shadow-red-600/40 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Simulate Scan & Start Charging Session</span>
              </button>

              <button
                onClick={() => setShowScanModal(false)}
                className="w-full text-center text-xs text-zinc-400 hover:text-white py-1"
              >
                Back to Map
              </button>
            </div>
          </div>
        )}

        {/* 7. LIVE CHARGING SIMULATOR */}
        {showChargingSimulator && (
          <div className="absolute inset-0 z-50 bg-zinc-950 text-white p-6 flex flex-col justify-between animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold block">● SESSION ACTIVE</span>
                <h3 className="font-bold text-sm text-white">Ahmedabad SG Highway • Bay 01</h3>
              </div>
              <button onClick={() => setShowChargingSimulator(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-3">
              <div className="relative w-44 h-44 mx-auto rounded-full border-4 border-zinc-800 flex flex-col items-center justify-center bg-zinc-900/60 shadow-2xl">
                <span className="text-5xl font-black text-red-500 font-mono">{chargingSoC}%</span>
                <span className="text-xs text-zinc-400 font-bold mt-1">120 kW Ultra-Fast</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[9px] text-zinc-500 block">POWER</span>
                  <span className="text-xs font-mono font-bold text-white">{chargingKw} kW</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[9px] text-zinc-500 block">ENERGY</span>
                  <span className="text-xs font-mono font-bold text-white">{chargingKwh} kWh</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[9px] text-zinc-500 block">COST</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">₹{chargingCost}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowChargingSimulator(false);
                alert('Session stopped! Tax invoice generated for your registered phone number.');
              }}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-2xl shadow-xl shadow-red-600/30"
            >
              Stop Charging & Pay
            </button>
          </div>
        )}

        {/* 8. MY EVS BOTTOM SHEET */}
        {showMyEVsSheet && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-150">
            <div className="w-full bg-white rounded-t-[32px] p-5 shadow-2xl space-y-4 max-h-[90%] overflow-y-auto text-zinc-900">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-zinc-900">My EVs</h3>
                  <span className="text-xs text-zinc-500">Manage registered electric vehicles & AutoCharge</span>
                </div>
                <button onClick={() => setShowMyEVsSheet(false)} className="text-zinc-400 hover:text-zinc-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {userEVs.map((ev) => (
                <div key={ev.id} className="p-4 rounded-2xl border-2 border-red-500/60 bg-red-50/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-zinc-900">{ev.name}</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 text-white font-mono text-[10px]">
                      {ev.plate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-600">
                    <span>SoC: <strong className="text-emerald-600">{ev.soc}%</strong></span>
                    <span>Range: <strong>{ev.range} km</strong></span>
                    <span>Port: <strong>{ev.connector}</strong></span>
                  </div>
                  <div className="pt-1 flex items-center justify-between text-[11px] border-t border-zinc-200">
                    <span className="text-zinc-500">AutoCharge: <strong className="text-emerald-600">Active</strong></span>
                    <span className="text-zinc-500">RFID: <strong className="font-mono text-zinc-700">{ev.rfidLinked}</strong></span>
                  </div>
                </div>
              ))}

              <button
                onClick={() => alert('Vehicle registration dialog: Tata, MG, Mahindra, Hyundai, BYD, Ather.')}
                className="w-full py-3 border-2 border-dashed border-red-600 text-red-600 hover:bg-red-50 rounded-2xl font-bold text-xs"
              >
                + Add Another Vehicle
              </button>

              <button
                onClick={() => setShowMyEVsSheet(false)}
                className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-2xl"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* 9. FAVOURITES BOTTOM SHEET */}
        {showFavouritesSheet && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-150">
            <div className="w-full bg-white rounded-t-[32px] p-5 shadow-2xl space-y-4 max-h-[90%] overflow-y-auto text-zinc-900">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-zinc-900">Starred Favourites</h3>
                  <span className="text-xs text-zinc-500">Quick access to preferred Gujarat stations</span>
                </div>
                <button onClick={() => setShowFavouritesSheet(false)} className="text-zinc-400 hover:text-zinc-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                {GUJARAT_STATIONS.slice(0, 4).map((st) => (
                  <div
                    key={st.name}
                    className="p-3 rounded-2xl border border-zinc-200 hover:border-red-500 bg-white shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-zinc-900">{st.name}</h4>
                      <p className="text-[10px] text-zinc-500">{st.city} • 120kW CCS2</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedStation(st);
                        setShowFavouritesSheet(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-[10px]"
                    >
                      View on Map
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowFavouritesSheet(false)}
                className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-2xl"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* 10. PLAN A TRIP MODAL */}
        {showTripModal && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-150">
            <div className="w-full bg-white rounded-t-[32px] p-5 shadow-2xl space-y-4 max-h-[90%] overflow-y-auto text-zinc-900">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-zinc-900">Plan a Gujarat EV Trip</h3>
                <button onClick={() => setShowTripModal(false)} className="text-zinc-400 hover:text-zinc-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Start Location</label>
                  <input
                    type="text"
                    defaultValue="Ahmedabad (S.G. Highway)"
                    className="w-full border border-zinc-300 rounded-xl px-3 py-2 text-xs font-bold text-zinc-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Destination</label>
                  <input
                    type="text"
                    defaultValue="Surat (VR Mall Dumas Road)"
                    className="w-full border border-zinc-300 rounded-xl px-3 py-2 text-xs font-bold text-zinc-800"
                  />
                </div>

                <div className="p-3 bg-red-50 rounded-2xl border border-red-200 text-xs space-y-1">
                  <span className="font-bold text-red-600 block">Recommended Charging Corridor:</span>
                  <p className="text-zinc-700 text-[11px]">
                    Stop 1: <strong>NE-1 Expressway Vadodara HyperHub</strong> (25 mins charge, 180kW DC).
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowTripModal(false);
                    alert('Route calculated! Charging stations pinned along your highway journey.');
                  }}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-red-600/30"
                >
                  Start Route Navigation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 11. MORE MENU BOTTOM SHEET */}
        {showMoreMenu && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-150">
            <div className="w-full bg-white rounded-t-[32px] p-5 shadow-2xl space-y-3 max-h-[90%] overflow-y-auto text-zinc-900">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <span className="font-black text-sm text-zinc-900">VoltGrid Services & Support</span>
                <button onClick={() => setShowMoreMenu(false)} className="text-zinc-400 hover:text-zinc-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="divide-y divide-zinc-100 text-xs font-medium text-zinc-800">
                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    setShowWalletModal(true);
                  }}
                  className="w-full py-3 flex items-center justify-between text-left hover:text-red-600"
                >
                  <span>VoltGrid Wallet & Invoices</span>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </button>

                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    setAppView('tutorial');
                    setOnboardingStep(0);
                  }}
                  className="w-full py-3 flex items-center justify-between text-left hover:text-red-600"
                >
                  <span>Re-open Walkthrough Tutorial</span>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </button>

                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    handleInstallApp();
                  }}
                  className="w-full py-3 flex items-center justify-between text-left text-red-600 font-bold"
                >
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4" />
                    <span>Install App on Home Screen (Native PWA)</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </button>

                <Link
                  to="/"
                  onClick={() => setShowMoreMenu(false)}
                  className="w-full py-3 flex items-center justify-between text-left text-zinc-700 hover:text-red-600 font-semibold"
                >
                  <span className="flex items-center gap-1.5">
                    <span>🌐</span>
                    <span>Back to VoltGrid Website</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </Link>

                <div className="py-3 flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>VoltGrid EV Network</span>
                  <span>v1.0.0 Gujarat</span>
                </div>
              </div>

              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-2xl"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* 12. PHONE INSTALLATION INSTRUCTIONS MODAL */}
        {showInstallHelpModal && (
          <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-zinc-900 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                    ⚡
                  </div>
                  <div>
                    <h3 className="text-sm font-bold leading-none">Install VoltGrid App</h3>
                    <span className="text-[10px] text-zinc-500">Google Play / Android Verified</span>
                  </div>
                </div>
                <button onClick={() => setShowInstallHelpModal(false)} className="text-zinc-400 hover:text-zinc-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-zinc-700">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    1
                  </div>
                  <p>
                    Open <strong>Chrome</strong> on your phone and visit <code className="text-red-600 font-mono text-[11px]">voltgrid-ev-five.vercel.app/app</code>
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    2
                  </div>
                  <p>
                    Tap the <strong>three dots (⋮)</strong> menu at the top-right corner of Chrome.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    3
                  </div>
                  <p>
                    Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                ✓ <strong>Zero Risk:</strong> Certified by Google Play Protect with no warnings or third-party permissions required.
              </p>

              <button
                onClick={() => setShowInstallHelpModal(false)}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/30"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </div>

      {!isMobileScreen && (
        <div className="mt-3 text-center max-w-xl text-zinc-400 text-xs space-y-1">
          <p>
            <strong className="text-white">VoltGrid Mobile:</strong> Real Gujarat Leaflet map with 34 active stations.
            Use <strong>Install on Phone</strong> to add to Home Screen directly from your browser!
          </p>
        </div>
      )}
    </div>
  );
}
