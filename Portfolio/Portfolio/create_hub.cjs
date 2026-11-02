const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// 1. Extract Modals from index.html
function extractBlock(startTag, endTag) {
  const startIdx = indexHtml.indexOf(startTag);
  if (startIdx === -1) return '';
  const endIdx = indexHtml.indexOf(endTag, startIdx);
  if (endIdx === -1) return '';
  return indexHtml.substring(startIdx, endIdx + endTag.length);
}

const authModal = extractBlock('<div id="authModal"', '<!-- ================= DRIVER PROFILE & ARRIVAL LOG MODAL ================= -->') || extractBlock('<div id="authModal"', '</div>\n  </div>\n\n  <!-- ================= DRIVER PROFILE');
const profileModal = extractBlock('<div id="profileModal"', '<!-- ================= CHECKOUT & BILLING MODAL');
const checkoutModal = extractBlock('<div id="checkoutModal"', '<!-- ================= INVOICE & ARRIVAL PIN MODAL');
const invoiceModal = extractBlock('<div id="invoiceModal"', '<!-- ================= ARRIVAL PIN UNLOCK MODAL');
const pinModal = extractBlock('<div id="pinModal"', '<!-- ================= SMARTCAR VIRTUAL VEHICLE SIMULATOR MODAL');
const toastNotification = extractBlock('<div id="toastNotification"', '<!-- ================= AUDIO ENGINE');

// 2. Extract the main script block from index.html (contains the full application engine)
const scriptBlocks = indexHtml.match(/<script[\s\S]*?<\/script>/gi);
const mainScript = scriptBlocks[scriptBlocks.length - 1];

// 3. Assemble hub.html using the proven index.html engine
const hubHtml = `<!DOCTYPE html>
<html lang="en" class="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VoltGrid // Gujarat EV Charging SuperHub Details</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="voltgrid_db.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace']
          }
        }
      }
    };
  </script>
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen antialiased flex flex-col transition-colors duration-200">

  <!-- ================= TOP NAVIGATION BAR ================= -->
  <header class="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-purple-100 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
      
      <!-- Brand & Back Button -->
      <div class="flex items-center gap-3">
        <a href="index.html" class="flex items-center gap-2.5 group">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform">
            <span class="text-xl">⚡</span>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">VoltGrid</span>
              <span class="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">GUJARAT</span>
            </div>
            <p class="text-[10px] text-slate-500 font-medium">Smart EV Station Bay Explorer</p>
          </div>
        </a>

        <a href="index.html" class="hidden sm:inline-flex items-center gap-1.5 ml-3 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors">
          <span>&larr;</span> All Gujarat Hubs (34)
        </a>
      </div>

      <!-- Right Controls: Telematics Pill, Nav User Slot, Quick Links & Theme -->
      <div class="flex items-center gap-2 sm:gap-3">
        
        <!-- Live Connected Vehicle SoC Pill -->
        <a href="simulator.html" target="_blank" title="Connected EV Telematics • Click to open simulator" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 text-xs font-bold text-sky-700 dark:text-sky-300 hover:border-sky-400 transition-colors">
          <span class="text-sm">🚗</span>
          <span id="navSimStatusText">22% SoC</span>
        </a>

        <!-- Vendor & Admin Hub Links -->
        <a href="vendor.html" class="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-bold transition-colors">
          <span>💼</span> Vendor
        </a>
        <a href="admin.html" class="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold transition-colors">
          <span>🛡️</span> Admin
        </a>
        <a href="simulator.html" target="_blank" class="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 text-xs font-bold transition-colors">
          <span>🚗</span> Simulator
        </a>

        <!-- Dark/Light Mode Toggle -->
        <button onclick="toggleDarkMode()" title="Toggle Theme" class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors">
          🌓
        </button>

        <!-- Driver Profile / Login Slot (Exact from index.html) -->
        <div id="navUserSlot" class="flex items-center">
          <button onclick="openAuthModal()" class="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all">
            Sign In / Register
          </button>
        </div>

      </div>
    </div>
  </header>

  <!-- ================= MAIN STATION HUB SHOWCASE ================= -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">

    <!-- Station Details Hero Banner -->
    <div id="stationHeroCard" class="relative overflow-hidden bg-white dark:bg-slate-900 border border-purple-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        <!-- Left: Station Info -->
        <div class="space-y-3">
          <div class="flex items-center gap-2 flex-wrap">
            <span id="hubVendorBadge" class="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 flex items-center gap-1.5">
              <span id="hubVendorLogo">⛽</span> <span id="hubVendorName">Jio-bp pulse</span>
            </span>
            <span id="hubCityBadge" class="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              📍 <span id="hubCityText">Ahmedabad</span>
            </span>
            <span id="hubTypeBadge" class="text-xs font-semibold text-slate-500 dark:text-slate-400">
              • <span id="hubTypeText">Highway Ultra-Fast Hub (2W & 4W)</span>
            </span>
          </div>

          <h1 id="hubStationTitle" class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Jio-bp pulse SG Highway HyperHub • Ahmedabad
          </h1>

          <p id="hubStationAddress" class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            Sindhu Bhavan Marg, Off S.G. Highway, Bodakdev, Ahmedabad, Gujarat 380054
          </p>

          <!-- Turnkey Google Maps Turn-by-Turn Directions Button -->
          <div class="pt-2 flex items-center gap-3">
            <a 
              id="hubDirectionsBtn" 
              href="https://www.google.com/maps/dir/?api=1&destination=23.0416,72.5074" 
              target="_blank" 
              class="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:from-purple-700 hover:to-sky-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/25 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <span>🗺️</span> OPEN GOOGLE MAPS DIRECTIONS ↗
            </a>
          </div>
        </div>

        <!-- Right: 4 Stat Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 min-w-[280px]">
          <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-center">
            <span class="block text-[10px] font-bold uppercase text-slate-400">Tariff Rate</span>
            <strong class="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">₹<span id="hubTariffRate">26</span><span class="text-xs font-normal">/kWh</span></strong>
            <span class="block text-[10px] text-slate-500 mt-0.5">Live grid tariff</span>
          </div>
          <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-center">
            <span class="block text-[10px] font-bold uppercase text-slate-400">Available Bays</span>
            <strong class="text-lg font-extrabold text-sky-600 dark:text-sky-400 font-mono" id="hubBaysAvailable">6 / 6 Free</strong>
            <span class="block text-[10px] text-slate-500 mt-0.5">Zero waiting line</span>
          </div>
          <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-center">
            <span class="block text-[10px] font-bold uppercase text-slate-400">Station Rating</span>
            <strong class="text-lg font-extrabold text-amber-500 font-mono" id="hubRating">★ 4.9</strong>
            <span class="block text-[10px] text-slate-500 mt-0.5">Verified safe bay</span>
          </div>
          <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-center">
            <span class="block text-[10px] font-bold uppercase text-slate-400">Clean Energy</span>
            <strong class="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
              <span>☀️</span> Solar
            </strong>
            <span class="block text-[10px] text-slate-500 mt-0.5">Canopy empowered</span>
          </div>
        </div>

      </div>

      <!-- Amenities Section -->
      <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap text-xs">
        <span class="font-bold text-slate-400 text-[11px] uppercase tracking-wider mr-1">Hub Amenities:</span>
        <div id="hubAmenitiesList" class="flex items-center gap-2 flex-wrap">
          <span class="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs">☕ 24x7 Wild Bean Cafe</span>
          <span class="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs">🚻 Restrooms</span>
          <span class="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs">📶 Free Wi-Fi</span>
          <span class="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs">🛋️ EV Lounge</span>
          <span class="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs">🛵 2W Dedicated Bay</span>
        </div>
      </div>
    </div>

    <!-- ================= DEDICATED BAY MATRIX SECTION ================= -->
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span class="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Dedicated Bay Matrix</span>
          <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Choose a Port & Lock Your Slot
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Select your preferred power output and connector gun. Each booking generates an instant 4-digit PIN with a guaranteed 15-minute arrival hold.
          </p>
        </div>

        <!-- Vehicle Type Filter Pills (Exact from index.html) -->
        <div class="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shrink-0 shadow-xs">
          <button id="filterBtn_ALL" onclick="setVehicleTypeFilter('ALL')" class="px-3.5 py-1.5 rounded-xl font-extrabold text-xs bg-emerald-500 text-white shadow-xs transition-all">
            ⚡ All Ports (<span id="countAllPorts">6</span>)
          </button>
          <button id="filterBtn_4W" onclick="setVehicleTypeFilter('4W')" class="px-3.5 py-1.5 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            🚗 4-Wheelers (<span id="count4WPorts">4</span>)
          </button>
          <button id="filterBtn_2W" onclick="setVehicleTypeFilter('2W')" class="px-3.5 py-1.5 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            🛵 2-Wheelers (<span id="count2WPorts">2</span>)
          </button>
        </div>
      </div>

      <!-- Ports Grid Container (Rendered exactly by renderPorts() from index.html) -->
      <div id="portsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <!-- Live charging bays dynamically injected here -->
      </div>
    </div>

  </main>

  <!-- ================= FOOTER ================= -->
  <footer class="mt-auto border-t border-purple-100 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-400">
    <p>VoltGrid &bull; Connected EV Cockpit & CPO Platform &bull; Real-time Gujarat Charging Network</p>
  </footer>

  <!-- ================= MODALS COPIED DIRECTLY FROM INDEX.HTML ================= -->
${authModal}
${profileModal}
${checkoutModal}
${invoiceModal}
${pinModal}
${toastNotification}

  <!-- ================= APPLICATION ENGINE SCRIPT (COPIED DIRECTLY FROM INDEX.HTML) ================= -->
${mainScript}

  <!-- Hub Station Detail Initializer & Dynamic Header Sync -->
  <script>
    function renderHubStationShowcase() {
      const st = stations.find(s => s.id === currentStationId) || stations[0];
      if (!st) return;

      const titleEl = document.getElementById('hubStationTitle');
      const addrEl = document.getElementById('hubStationAddress');
      const vendorBadgeEl = document.getElementById('hubVendorBadge');
      const vendorNameEl = document.getElementById('hubVendorName');
      const vendorLogoEl = document.getElementById('hubVendorLogo');
      const cityTextEl = document.getElementById('hubCityText');
      const typeTextEl = document.getElementById('hubTypeText');
      const tariffEl = document.getElementById('hubTariffRate');
      const ratingEl = document.getElementById('hubRating');
      const baysAvailEl = document.getElementById('hubBaysAvailable');
      const directionsBtn = document.getElementById('hubDirectionsBtn');
      const amenitiesEl = document.getElementById('hubAmenitiesList');

      if (titleEl) titleEl.innerText = st.name;
      if (addrEl) addrEl.innerText = st.location || 'Gujarat, India';
      if (vendorNameEl) vendorNameEl.innerText = st.vendorName || 'VoltGrid';
      if (vendorLogoEl) vendorLogoEl.innerText = st.vendorLogo || '⚡';
      if (cityTextEl) cityTextEl.innerText = st.city || 'Gujarat';
      if (typeTextEl) typeTextEl.innerText = st.type || 'SuperHub';
      if (tariffEl) tariffEl.innerText = st.pricePerKwh || 26;
      if (ratingEl) ratingEl.innerText = '★ ' + (st.rating || 4.9);

      const freePorts = st.ports ? st.ports.filter(p => p.status === 'available').length : 0;
      const totalPorts = st.ports ? st.ports.length : 6;
      if (baysAvailEl) baysAvailEl.innerText = freePorts + ' / ' + totalPorts + ' Free';

      const all4w = st.ports ? st.ports.filter(p => p.vehicleType === '4W' || p.vehicleType === 'BOTH').length : 0;
      const all2w = st.ports ? st.ports.filter(p => p.vehicleType === '2W' || p.vehicleType === 'BOTH').length : 0;
      const countAll = document.getElementById('countAllPorts');
      const count4w = document.getElementById('count4WPorts');
      const count2w = document.getElementById('count2WPorts');
      if (countAll) countAll.innerText = totalPorts;
      if (count4w) count4w.innerText = all4w;
      if (count2w) count2w.innerText = all2w;

      const dirUrl = st.directionsUrl || ('https://www.google.com/maps/dir/?api=1&destination=' + (st.lat || 23.0416) + ',' + (st.lng || 72.5074));
      if (directionsBtn) directionsBtn.href = dirUrl;

      if (amenitiesEl && Array.isArray(st.amenities)) {
        amenitiesEl.innerHTML = st.amenities.map(a => 
          '<span class="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs">' + a + '</span>'
        ).join('');
      }
    }

    // Set Station ID from URL Parameter and Render
    window.addEventListener('DOMContentLoaded', () => {
      const urlParams = new URLSearchParams(window.location.search);
      const targetId = urlParams.get('id') || 'st-01';
      currentStationId = targetId;
      renderHubStationShowcase();
      renderPorts();
    });

    // Also update header showcase on live sync
    if (window.VoltGridDB && typeof window.VoltGridDB.onSync === 'function') {
      window.VoltGridDB.onSync((type, data) => {
        renderHubStationShowcase();
      });
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'hub.html'), hubHtml, 'utf8');
console.log('Successfully generated hub.html directly from index.html! Bytes:', hubHtml.length);
