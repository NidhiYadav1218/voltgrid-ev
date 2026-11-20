import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  Dimensions,
  Alert
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Real Gujarat Stations sample data for mobile
const GUJARAT_SAMPLE_STATIONS = [
  {
    id: 'st-01',
    name: 'VoltGrid HyperHub • S.G. Highway Bodakdev',
    city: 'Ahmedabad',
    status: 'Open 24 hours | 8712',
    accessibility: 'Public',
    ports: [
      { type: 'DC', connector: 'CCS2', power: '240 kW', status: 'Available' },
      { type: 'DC', connector: 'CCS2', power: '120 kW', status: 'Charging' }
    ]
  },
  {
    id: 'st-02',
    name: 'VoltGrid Fast Charger • Dumas Road VR Mall',
    city: 'Surat',
    status: 'Open 24 hours | 6541',
    accessibility: 'Public',
    ports: [
      { type: 'DC', connector: 'CCS2', power: '120 kW', status: 'Available' },
      { type: 'DC', connector: 'CCS2', power: '60 kW', status: 'Available' }
    ]
  },
  {
    id: 'st-03',
    name: 'VoltGrid Expressway Hub • NE-1 Toll Plaza',
    city: 'Vadodara',
    status: 'Open 24 hours | 9934',
    accessibility: 'Public',
    ports: [
      { type: 'DC', connector: 'CCS2', power: '180 kW', status: 'Available' },
      { type: 'AC', connector: 'Type II', power: '22 kW', status: 'Available' }
    ]
  }
];

export default function App() {
  const [onboardingStep, setOnboardingStep] = useState(0); // 0-5 onboarding, 6 app main
  const [activeTab, setActiveTab] = useState('Map'); // Map, MyEVs, Scan, Favourites, More
  const [selectedStation, setSelectedStation] = useState(GUJARAT_SAMPLE_STATIONS[0]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingTabAfterAuth, setPendingTabAfterAuth] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);

  // Auth flow states
  const [authStep, setAuthStep] = useState(1); // 1: Phone, 2: OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [walletBalance, setWalletBalance] = useState(10000.0);

  // Handle Tab Click with Auth Check for My EVs and Favourites
  const handleTabPress = (tabName) => {
    if ((tabName === 'MyEVs' || tabName === 'Favourites') && !isAuthenticated) {
      setPendingTabAfterAuth(tabName);
      setAuthStep(1);
      setShowAuthModal(true);
      return;
    }
    if (tabName === 'Scan') {
      setShowScanModal(true);
      return;
    }
    setActiveTab(tabName);
  };

  const handleSendOtp = () => {
    if (phoneNumber.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setAuthStep(2);
  };

  const handleVerifyOtp = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
    if (pendingTabAfterAuth) {
      setActiveTab(pendingTabAfterAuth);
      setPendingTabAfterAuth(null);
    }
  };

  // 1. ONBOARDING WALKTHROUGH FLOW (Matches Screenshot 6, 7, 8, 9, 10, 11)
  if (onboardingStep < 6) {
    const slides = [
      {
        text: 'Search and browse for VoltGrid charging stations through map screen',
        subtext: 'Real-time live status across Gujarat highways & cities'
      },
      {
        text: 'Click on wallet button in the map screen to access your wallet',
        subtext: 'Manage balances, view invoices & quick UPI recharges'
      },
      {
        text: 'Top up your wallet through your preferred payment method',
        subtext: 'Instant UPI, Cards & Netbanking with zero gateway fees'
      },
      {
        text: 'Tap on the Scan button to quickly start charging at a VoltGrid Charging Station',
        subtext: 'Plug in your vehicle, scan the QR gun code & start charging'
      },
      {
        text: 'Or tap on any of the map pin to access that charging station',
        subtext: 'View tariff rates, live kW output, and turn-by-turn directions'
      },
      {
        text: 'Tap on trip planner to pre-plan your charging stops for a long drive',
        subtext: 'Intelligent route recommendations for EV road trips in Gujarat'
      }
    ];

    const currentSlide = slides[onboardingStep];

    return (
      <SafeAreaView style={styles.onboardingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#D30C15" />
        {/* Top Navigation */}
        <View style={styles.onboardingHeader}>
          {onboardingStep > 0 ? (
            <TouchableOpacity onPress={() => setOnboardingStep(onboardingStep - 1)} style={styles.headerBtn}>
              <Text style={styles.headerBtnText}>← Back</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 60 }} />
          )}
          <TouchableOpacity onPress={() => setOnboardingStep(6)} style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>Skip ➔</Text>
          </TouchableOpacity>
        </View>

        {/* Mock Phone Preview Card */}
        <View style={styles.phoneMockupContainer}>
          <View style={styles.mockupPhone}>
            {/* Dynamic Island / Notch */}
            <View style={styles.mockupNotch} />
            <View style={styles.mockupScreen}>
              <View style={styles.mockupTopPill}>
                <Text style={styles.mockupPillText}>🔍 Search</Text>
                <Text style={styles.mockupPillText}>📍 Plan a trip</Text>
              </View>
              <View style={styles.mockupWalletPill}>
                <Text style={styles.mockupWalletText}>₹ 10,000</Text>
              </View>
              <View style={styles.mockupCenterHighlight}>
                <Text style={styles.mockupCenterTitle}>⚡ VOLTGRID</Text>
                <Text style={styles.mockupCenterSub}>Step {onboardingStep + 1} of 6</Text>
              </View>
              <View style={styles.mockupBottomBar}>
                <Text style={styles.mockupTabActive}>🗺️ Map</Text>
                <Text style={styles.mockupTab}>🚗 My EVs</Text>
                <View style={styles.mockupScanCircle}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>⚡</Text>
                </View>
                <Text style={styles.mockupTab}>❤️ Favourites</Text>
                <Text style={styles.mockupTab}>☰ More</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Slide Explanatory Text */}
        <View style={styles.slideTextContainer}>
          <Text style={styles.slideMainText}>{currentSlide.text}</Text>
          <Text style={styles.slideSubText}>{currentSlide.subtext}</Text>
        </View>

        {/* Pagination Dots */}
        <View style={styles.dotsRow}>
          {slides.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === onboardingStep ? styles.dotActive : styles.dotInactive
              ]}
            />
          ))}
        </View>

        {/* Bottom Button */}
        <View style={styles.onboardingFooter}>
          {onboardingStep === 5 ? (
            <TouchableOpacity
              style={styles.getStartedBtn}
              onPress={() => setOnboardingStep(6)}
            >
              <View style={styles.getStartedIconCircle}>
                <Text style={styles.getStartedLightning}>⚡</Text>
              </View>
              <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={() => setOnboardingStep(onboardingStep + 1)}
            >
              <Text style={styles.nextBtnText}>Next</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // 2. MAIN APPLICATION VIEW
  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Top Floating Controls */}
      <View style={styles.mapTopOverlay}>
        <View style={styles.searchPlanPill}>
          <TouchableOpacity style={styles.pillHalf}>
            <Text style={styles.pillIcon}>🔍</Text>
            <Text style={styles.pillText}>Search</Text>
          </TouchableOpacity>
          <View style={styles.pillDivider} />
          <TouchableOpacity style={styles.pillHalf}>
            <Text style={styles.pillIcon}>📍</Text>
            <Text style={styles.pillText}>Plan a trip</Text>
          </TouchableOpacity>
        </View>

        {/* Top Right Floating Wallet Pill */}
        <TouchableOpacity
          style={styles.floatingWalletPill}
          onPress={() => setShowWalletModal(true)}
        >
          <View style={styles.walletIconCircle}>
            <Text style={{ color: '#fff', fontSize: 10 }}>₹</Text>
          </View>
          <Text style={styles.walletPillAmount}>
            ₹ {walletBalance.toLocaleString('en-IN')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Interactive Map Simulator Area */}
      <View style={styles.mapCanvas}>
        <View style={styles.mapBackgroundSimulator}>
          <Text style={styles.mapWatermark}>GUJARAT EV CORRIDOR</Text>
          {GUJARAT_SAMPLE_STATIONS.map((st, i) => (
            <TouchableOpacity
              key={st.id}
              style={[
                styles.mapPin,
                { top: 120 + i * 90, left: 60 + i * 85 },
                selectedStation?.id === st.id && styles.mapPinActive
              ]}
              onPress={() => setSelectedStation(st)}
            >
              <Text style={styles.mapPinIcon}>⚡</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Floating Action Buttons over Map (Matches Screenshots) */}
        <View style={styles.floatingFabLeft}>
          <TouchableOpacity style={styles.fabBtn}>
            <Text style={styles.fabIcon}>🌐</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fabBtn}>
            <Text style={styles.fabIcon}>🔄</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.floatingFabRight}>
          <TouchableOpacity style={styles.fabBtn}>
            <Text style={styles.fabIcon}>🎯</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.fabBtn}
            onPress={() => setShowFilterModal(true)}
          >
            <Text style={styles.fabIcon}>🌪️</Text>
          </TouchableOpacity>
        </View>

        {/* Station Details Card at Bottom of Map (Matches Screenshot 3) */}
        {selectedStation && (
          <View style={styles.stationBottomCard}>
            <View style={styles.publicBadge}>
              <Text style={styles.publicBadgeText}>ⓘ Public</Text>
            </View>

            <View style={styles.stationCardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.stationName} numberOfLines={1}>
                  {selectedStation.name}
                </Text>
                <Text style={styles.stationStatusText}>
                  {selectedStation.status}
                </Text>
              </View>
              <Text style={styles.brandBadge}>VOLTGRID ⚡</Text>
            </View>

            {/* Ports Listing */}
            <View style={styles.portsList}>
              {selectedStation.ports.map((p, idx) => (
                <View key={idx} style={styles.portItem}>
                  <View style={styles.portLeft}>
                    <View style={styles.dcBadge}>
                      <Text style={styles.dcText}>{p.type}</Text>
                    </View>
                    <Text style={styles.connectorText}>{p.connector}</Text>
                  </View>
                  <Text style={styles.powerText}>{p.power}</Text>
                  <Text
                    style={[
                      styles.portStatus,
                      p.status === 'Available'
                        ? styles.statusAvail
                        : styles.statusCharging
                    ]}
                  >
                    {p.status}
                  </Text>
                </View>
              ))}
            </View>

            {/* Buttons Row */}
            <View style={styles.stationCardButtons}>
              <TouchableOpacity
                style={styles.detailsBtn}
                onPress={() =>
                  Alert.alert(
                    selectedStation.name,
                    `City: ${selectedStation.city}\nRate: ₹24/kWh\nAmenities: Cafe, Restroom, Wi-Fi`
                  )
                }
              >
                <Text style={styles.detailsBtnText}>Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.directionsBtn}
                onPress={() =>
                  Alert.alert(
                    'Opening Navigation',
                    `Routing to ${selectedStation.name} in Gujarat.`
                  )
                }
              >
                <Text style={styles.directionsBtnText}>➔ Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Bottom Navigation Bar (Matches Screenshots) */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleTabPress('Map')}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'Map' && styles.tabLabelActive
            ]}
          >
            🗺️ Map
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleTabPress('MyEVs')}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'MyEVs' && styles.tabLabelActive
            ]}
          >
            🚗 My EVs
          </Text>
        </TouchableOpacity>

        {/* Big Central Floating Red Scan Button */}
        <TouchableOpacity
          style={styles.scanFabButton}
          onPress={() => handleTabPress('Scan')}
        >
          <View style={styles.scanFabInner}>
            <Text style={styles.scanFabLightning}>⚡</Text>
          </View>
          <Text style={styles.scanFabLabel}>Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleTabPress('Favourites')}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'Favourites' && styles.tabLabelActive
            ]}
          >
            ❤️ Favourites
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleTabPress('More')}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'More' && styles.tabLabelActive
            ]}
          >
            ☰ More
          </Text>
        </TouchableOpacity>
      </View>

      {/* AUTHENTICATION MODAL (Phone & OTP - Crucial User Requirement) */}
      <Modal visible={showAuthModal} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.authModalSheet}>
            <View style={styles.modalHandle} />
            {authStep === 1 ? (
              <View style={styles.authStepContent}>
                <Text style={styles.authTitle}>Login / Register with Mobile</Text>
                <Text style={styles.authSub}>
                  Enter your 10-digit mobile number to access My EVs and Favourites.
                </Text>
                <View style={styles.phoneInputRow}>
                  <Text style={styles.prefixText}>+91</Text>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="Enter Mobile Number"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                  />
                </View>
                <TouchableOpacity
                  style={styles.primaryRedBtn}
                  onPress={handleSendOtp}
                >
                  <Text style={styles.primaryRedBtnText}>Get OTP</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.authStepContent}>
                <Text style={styles.authTitle}>Verify with OTP</Text>
                <Text style={styles.authSub}>
                  Enter the 6-digit code sent to +91 {phoneNumber}
                </Text>
                <View style={styles.otpBoxesRow}>
                  {['1', '2', '3', '4', '5', '6'].map((d, i) => (
                    <View key={i} style={styles.otpBox}>
                      <Text style={styles.otpDigit}>{d}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.primaryRedBtn}
                  onPress={handleVerifyOtp}
                >
                  <Text style={styles.primaryRedBtnText}>Verify & Continue</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowAuthModal(false)}
            >
              <Text style={styles.closeBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* FILTER BOTTOM SHEET (Matches Screenshot 1) */}
      <Modal visible={showFilterModal} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.filterSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.filterSectionTitle}>Charger Capacity (kW)</Text>
            <View style={styles.filterSliderValues}>
              <Text style={styles.sliderVal}>3.3</Text>
              <Text style={styles.sliderVal}>7.4</Text>
              <Text style={styles.sliderVal}>24</Text>
              <Text style={styles.sliderVal}>50</Text>
              <Text style={styles.sliderVal}>120</Text>
              <Text style={styles.sliderVal}>240</Text>
              <Text style={styles.sliderVal}>&gt;240</Text>
            </View>

            <Text style={styles.filterSectionTitle}>Charger Type</Text>
            <View style={styles.filterOptionsRow}>
              <TouchableOpacity style={[styles.filterPill, styles.filterPillActive]}>
                <Text style={styles.filterPillTextActive}>⚡ DC</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterPill}>
                <Text style={styles.filterPillText}>📍 AC</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.filterSectionTitle}>Connector Type</Text>
            <View style={styles.filterConnectorsRow}>
              <View style={[styles.connectorBox, styles.connectorBoxActive]}>
                <Text style={styles.connectorTitle}>CCS2</Text>
              </View>
              <View style={styles.connectorBox}>
                <Text style={styles.connectorTitle}>Type II</Text>
              </View>
              <View style={styles.connectorBox}>
                <Text style={styles.connectorTitle}>16A - 3 Pin</Text>
              </View>
            </View>

            <View style={styles.filterFooter}>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Text style={styles.clearFiltersText}>Clear Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyFilterBtn}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.applyFilterBtnText}>✓ Apply Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* WALLET MODAL */}
      <Modal visible={showWalletModal} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.walletSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.walletSheetTitle}>My Wallet</Text>
            <View style={styles.walletCard}>
              <Text style={styles.walletCardLabel}>Current balance</Text>
              <Text style={styles.walletCardAmount}>
                ₹ {walletBalance.toFixed(2)}
              </Text>
              <TouchableOpacity
                style={styles.addMoneyBtn}
                onPress={() => {
                  setWalletBalance((prev) => prev + 1000);
                  Alert.alert('Top-Up Success', '₹1,000 added to your VoltGrid Wallet via UPI.');
                }}
              >
                <Text style={styles.addMoneyBtnText}>Add Money (+₹1,000)</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.recentTxTitle}>Recent Transactions</Text>
            <View style={styles.txItem}>
              <View>
                <Text style={styles.txName}>Wallet Top-Up</Text>
                <Text style={styles.txDate}>Today, 03:17 PM • success</Text>
              </View>
              <Text style={styles.txAmount}>+₹1000.00</Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowWalletModal(false)}
            >
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SCAN MODAL */}
      <Modal visible={showScanModal} animationType="fade" transparent>
        <View style={styles.scanModalOverlay}>
          <View style={styles.scanViewfinder}>
            <View style={styles.scanTargetBox}>
              <Text style={styles.scanGuideText}>Align QR code inside box</Text>
            </View>
            <Text style={styles.scanHint}>
              Point camera at any VoltGrid charging gun QR code to initiate charging
            </Text>
            <TouchableOpacity
              style={styles.simulateChargeBtn}
              onPress={() => {
                setShowScanModal(false);
                Alert.alert('Charging Started', 'Connected to Gun 1 (120 kW CCS2). Charging initiated!');
              }}
            >
              <Text style={styles.simulateChargeText}>⚡ Simulate Scan & Start Charge</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowScanModal(false)}
            >
              <Text style={styles.closeBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  onboardingContainer: {
    flex: 1,
    backgroundColor: '#D30C15'
  },
  onboardingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10
  },
  headerBtn: {
    padding: 8
  },
  headerBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  phoneMockupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10
  },
  mockupPhone: {
    width: 250,
    height: 380,
    borderRadius: 36,
    borderWidth: 5,
    borderColor: '#1a1a1a',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
    padding: 8
  },
  mockupNotch: {
    width: 70,
    height: 12,
    backgroundColor: '#000',
    borderRadius: 6,
    alignSelf: 'center',
    marginBottom: 8
  },
  mockupScreen: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 24,
    padding: 10,
    justifyContent: 'space-between'
  },
  mockupTopPill: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 6,
    justifyContent: 'space-around',
    elevation: 2
  },
  mockupPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333'
  },
  mockupWalletPill: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 4
  },
  mockupWalletText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#333'
  },
  mockupCenterHighlight: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  mockupCenterTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D30C15'
  },
  mockupCenterSub: {
    fontSize: 10,
    color: '#666',
    marginTop: 2
  },
  mockupBottomBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  mockupTabActive: {
    fontSize: 8,
    color: '#D30C15',
    fontWeight: 'bold'
  },
  mockupTab: {
    fontSize: 8,
    color: '#666'
  },
  mockupScanCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#D30C15',
    alignItems: 'center',
    justifyContent: 'center'
  },
  slideTextContainer: {
    paddingHorizontal: 30,
    alignItems: 'center',
    marginBottom: 16
  },
  slideMainText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24
  },
  slideSubText: {
    color: '#ffcdd2',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4
  },
  dotActive: {
    backgroundColor: '#ffffff',
    width: 12
  },
  dotInactive: {
    backgroundColor: 'rgba(255,255,255,0.4)'
  },
  onboardingFooter: {
    paddingHorizontal: 24,
    paddingBottom: 24
  },
  nextBtn: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center'
  },
  nextBtnText: {
    color: '#D30C15',
    fontSize: 16,
    fontWeight: 'bold'
  },
  getStartedBtn: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8
  },
  getStartedIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D30C15',
    alignItems: 'center',
    justifyContent: 'center'
  },
  getStartedLightning: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  getStartedText: {
    color: '#D30C15',
    fontSize: 16,
    fontWeight: 'bold'
  },

  // Main Container
  mainContainer: {
    flex: 1,
    backgroundColor: '#f2f2f2'
  },
  mapTopOverlay: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    zIndex: 10
  },
  searchPlanPill: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    height: 48,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8
  },
  pillHalf: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  pillDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e0e0e0'
  },
  pillIcon: {
    fontSize: 14
  },
  pillText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500'
  },
  floatingWalletPill: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    gap: 6
  },
  walletIconCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center'
  },
  walletPillAmount: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111'
  },
  mapCanvas: {
    flex: 1
  },
  mapBackgroundSimulator: {
    flex: 1,
    backgroundColor: '#e6ebed',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mapWatermark: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#b0bec5',
    letterSpacing: 2
  },
  mapPin: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#D30C15',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    borderWidth: 2,
    borderColor: '#ffffff'
  },
  mapPinActive: {
    backgroundColor: '#b71c1c',
    transform: [{ scale: 1.15 }]
  },
  mapPinIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  floatingFabLeft: {
    position: 'absolute',
    bottom: 270,
    left: 16,
    gap: 12
  },
  floatingFabRight: {
    position: 'absolute',
    bottom: 270,
    right: 16,
    gap: 12
  },
  fabBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1
  },
  fabIcon: {
    fontSize: 18
  },
  stationBottomCard: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    right: 12,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10
  },
  publicBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#4caf50',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 6
  },
  publicBadgeText: {
    color: '#2e7d32',
    fontSize: 10,
    fontWeight: 'bold'
  },
  stationCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  stationName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111'
  },
  stationStatusText: {
    fontSize: 11,
    color: '#666',
    marginTop: 2
  },
  brandBadge: {
    color: '#D30C15',
    fontWeight: '900',
    fontSize: 12
  },
  portsList: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
    gap: 6
  },
  portItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  portLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  dcBadge: {
    backgroundColor: '#37474f',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4
  },
  dcText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold'
  },
  connectorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D30C15'
  },
  powerText: {
    fontSize: 12,
    color: '#333'
  },
  portStatus: {
    fontSize: 11,
    fontWeight: 'bold'
  },
  statusAvail: {
    color: '#2e7d32'
  },
  statusCharging: {
    color: '#f57c00'
  },
  stationCardButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12
  },
  detailsBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center'
  },
  detailsBtnText: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 13
  },
  directionsBtn: {
    flex: 1,
    backgroundColor: '#D30C15',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center'
  },
  directionsBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13
  },

  // Bottom Navigation Bar
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 4
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  tabLabel: {
    fontSize: 11,
    color: '#757575',
    fontWeight: '500'
  },
  tabLabelActive: {
    color: '#D30C15',
    fontWeight: 'bold'
  },
  scanFabButton: {
    top: -18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scanFabInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#D30C15',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#D30C15',
    shadowOpacity: 0.4,
    shadowRadius: 6
  },
  scanFabLightning: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  scanFabLabel: {
    fontSize: 10,
    color: '#757575',
    marginTop: 2
  },

  // Modals & Sheets
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12
  },
  authModalSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20
  },
  authStepContent: {
    paddingVertical: 10
  },
  authTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111'
  },
  authSub: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginBottom: 16
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 16
  },
  prefixText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8
  },
  phoneInput: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: '#111'
  },
  primaryRedBtn: {
    backgroundColor: '#D30C15',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center'
  },
  primaryRedBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  otpBox: {
    width: 44,
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D30C15',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff5f5'
  },
  otpDigit: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111'
  },
  closeBtn: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 8
  },
  closeBtnText: {
    color: '#666',
    fontSize: 13
  },

  // Filter Sheet
  filterSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111',
    marginTop: 12,
    marginBottom: 8
  },
  filterSliderValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginBottom: 8
  },
  sliderVal: {
    fontSize: 11,
    color: '#666'
  },
  filterOptionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12
  },
  filterPill: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center'
  },
  filterPillActive: {
    borderColor: '#D30C15',
    backgroundColor: '#fff5f5'
  },
  filterPillText: {
    color: '#333',
    fontWeight: '600'
  },
  filterPillTextActive: {
    color: '#D30C15',
    fontWeight: 'bold'
  },
  filterConnectorsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16
  },
  connectorBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center'
  },
  connectorBoxActive: {
    borderColor: '#D30C15',
    backgroundColor: '#fff5f5'
  },
  connectorTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333'
  },
  filterFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  clearFiltersText: {
    color: '#D30C15',
    fontWeight: 'bold',
    fontSize: 14
  },
  applyFilterBtn: {
    backgroundColor: '#D30C15',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 16
  },
  applyFilterBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14
  },

  // Wallet Sheet
  walletSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20
  },
  walletSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 12
  },
  walletCard: {
    backgroundColor: '#D30C15',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16
  },
  walletCardLabel: {
    color: '#ffcdd2',
    fontSize: 12
  },
  walletCardAmount: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 8
  },
  addMoneyBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 8
  },
  addMoneyBtnText: {
    color: '#D30C15',
    fontWeight: 'bold',
    fontSize: 12
  },
  recentTxTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8
  },
  txItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  txName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111'
  },
  txDate: {
    fontSize: 11,
    color: '#777'
  },
  txAmount: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2e7d32'
  },

  // Scan Viewfinder
  scanModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  scanViewfinder: {
    alignItems: 'center',
    width: '100%'
  },
  scanTargetBox: {
    width: 220,
    height: 220,
    borderWidth: 2,
    borderColor: '#D30C15',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(211,12,21,0.08)'
  },
  scanGuideText: {
    color: '#fff',
    fontSize: 12
  },
  scanHint: {
    color: '#ddd',
    textAlign: 'center',
    fontSize: 13,
    marginVertical: 16,
    paddingHorizontal: 20
  },
  simulateChargeBtn: {
    backgroundColor: '#D30C15',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 8
  },
  simulateChargeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14
  }
});
