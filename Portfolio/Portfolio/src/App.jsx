import React, { useState } from 'react';
import Header from './components/Header';
import StationSelector from './components/StationSelector';
import PortCard from './components/PortCard';
import ReservationModal from './components/ReservationModal';
import ActiveChargingSession from './components/ActiveChargingSession';
import DigitalPassModal from './components/DigitalPassModal';
import OperatorTelemetry from './components/OperatorTelemetry';
import { INITIAL_STATIONS } from './data/mockData';
import { Shield, Sparkles, Zap, BatteryCharging, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [stations, setStations] = useState(INITIAL_STATIONS);
  const [selectedStationId, setSelectedStationId] = useState(INITIAL_STATIONS[0].id);
  const [activeView, setActiveView] = useState('driver'); // 'driver' | 'operator'

  // Modals & Active Session State
  const [reservingPort, setReservingPort] = useState(null);
  const [activeSession, setActiveSession] = useState({
    portId: 'P-102',
    portName: 'Port 02',
    vehicle: 'Porsche Taycan 4S',
    currentSoc: 68,
    targetSoc: 85,
    kwDelivered: 42.1,
    sessionId: 'VG-8812'
  });
  const [digitalPass, setDigitalPass] = useState(null);

  const selectedStation = stations.find((s) => s.id === selectedStationId) || stations[0];

  // Aggregated Stats
  const totalPorts = stations.reduce((acc, s) => acc + s.ports.length, 0);
  const availablePorts = stations.reduce(
    (acc, s) => acc + s.ports.filter((p) => p.status === 'available').length,
    0
  );

  // Reserve a port
  const handleOpenReserve = (port) => {
    setReservingPort(port);
  };

  const handleConfirmReservation = (resData) => {
    setStations((prevStations) =>
      prevStations.map((station) => {
        if (station.id !== selectedStationId) return station;
        return {
          ...station,
          ports: station.ports.map((p) => {
            if (p.id === resData.portId) {
              return {
                ...p,
                status: 'reserved',
                reservedBy: `Session #${resData.sessionId}`,
                currentVehicle: resData.vehicle,
                lockExpiresAt: 15
              };
            }
            return p;
          })
        };
      })
    );

    setDigitalPass(resData);
  };

  // Start Charging a reserved port
  const handleStartCharge = (port) => {
    setStations((prevStations) =>
      prevStations.map((station) => {
        if (station.id !== selectedStationId) return station;
        return {
          ...station,
          ports: station.ports.map((p) => {
            if (p.id === port.id) {
              return {
                ...p,
                status: 'charging',
                chargePercent: 35,
                powerKw: 150,
                kwDelivered: 1.2,
                timeRemainingMin: 22
              };
            }
            return p;
          })
        };
      })
    );

    setActiveSession({
      portId: port.id,
      portName: port.name,
      vehicle: port.currentVehicle || 'Connected EV',
      currentSoc: 35,
      targetSoc: 80,
      kwDelivered: 1.2,
      sessionId: 'VG-' + Math.floor(1000 + Math.random() * 9000)
    });
  };

  // Disconnect / Release
  const handleRelease = (port) => {
    setStations((prevStations) =>
      prevStations.map((station) => {
        if (station.id !== selectedStationId) return station;
        return {
          ...station,
          ports: station.ports.map((p) => {
            if (p.id === port.id) {
              return {
                ...p,
                status: 'available',
                currentVehicle: null,
                chargePercent: 0,
                reservedBy: null,
                lockExpiresAt: null
              };
            }
            return p;
          })
        };
      })
    );

    if (activeSession && activeSession.portId === port.id) {
      setActiveSession(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col tech-grid">
      {/* Top Navigation */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        totalPorts={totalPorts}
        availablePorts={availablePorts}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'driver' ? (
          <div>
            {/* Active Charging Banner if user has a running charge */}
            {activeSession && (
              <ActiveChargingSession
                session={activeSession}
                onStop={() => setActiveSession(null)}
              />
            )}

            {/* Station Selection */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Select Charging Station Hub
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Real-time slot lock queue enabled &bull; Instant anti-steal reservation
                </p>
              </div>
            </div>

            <StationSelector
              stations={stations}
              selectedStationId={selectedStationId}
              onSelectStation={setSelectedStationId}
            />

            {/* Ports Matrix for Selected Station */}
            <div className="mt-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    Live Ports Matrix &bull; {selectedStation.name}
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    Hardware protocol: OCPP 2.0.1 &bull; 800V DC Bus Active
                  </p>
                </div>

                {/* Legend badges */}
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Available
                  </span>
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Charging
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span> Reserved
                  </span>
                </div>
              </div>

              {/* Grid of Ports */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {selectedStation.ports.map((port) => (
                  <PortCard
                    key={port.id}
                    port={port}
                    pricePerKwh={selectedStation.pricePerKwh}
                    onReserve={handleOpenReserve}
                    onStartCharge={handleStartCharge}
                    onRelease={handleRelease}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Operator View */
          <OperatorTelemetry
            stations={stations}
            onTogglePortStatus={(stId, portId) => {}}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#060910] py-6 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>VOLTGRID AUTONOMOUS NETWORK // NODE_02</span>
          </div>
          <p>BUILT WITH NEXT.JS &bull; REACT &bull; TAILWIND &bull; DISTRIBUTED MUTEX</p>
        </div>
      </footer>

      {/* Reservation Drawer Modal */}
      <ReservationModal
        isOpen={!!reservingPort}
        onClose={() => setReservingPort(null)}
        port={reservingPort}
        station={selectedStation}
        onConfirmReservation={handleConfirmReservation}
      />

      {/* Digital Pass / QR Ticket Modal */}
      <DigitalPassModal
        isOpen={!!digitalPass}
        onClose={() => setDigitalPass(null)}
        passData={digitalPass}
        station={selectedStation}
      />
    </div>
  );
}
