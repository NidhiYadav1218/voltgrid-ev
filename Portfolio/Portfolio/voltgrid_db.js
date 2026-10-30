/**
 * VoltGrid Unified Statewide Multi-Page Database & Synchronization Engine
 * Bridges index.html (Driver App), vendor.html (CPO Vendor Portal), and admin.html (Platform HQ).
 * Persists data to localStorage and synchronizes in real time across open browser tabs.
 */

const INITIAL_STATIONS = [
  {
    "id": "st-01",
    "vendorId": "vendor-jiobp",
    "vendorName": "Jio-bp pulse",
    "vendorLogo": "⛽",
    "vendorColor": "blue",
    "city": "Ahmedabad",
    "name": "Jio-bp pulse SG Highway HyperHub • Ahmedabad",
    "type": "Highway Ultra-Fast Hub (2W & 4W)",
    "location": "Sindhu Bhavan Marg, Off S.G. Highway, Bodakdev, Ahmedabad, Gujarat 380054",
    "lat": 23.0416,
    "lng": 72.5074,
    "mapsUrl": "https://maps.google.com/?q=23.0416,72.5074",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=23.0416,72.5074",
    "pricePerKwh": 26,
    "solar": true,
    "rating": 4.9,
    "amenities": [
      "24x7 Wild Bean Cafe",
      "Restrooms",
      "Free Wi-Fi",
      "EV Lounge",
      "2W Dedicated Bay"
    ],
    "ports": [
      {
        "id": "p101",
        "name": "Bay 01 (4W)",
        "type": "240kW Ultra-Fast DC",
        "maxKw": 240,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p102",
        "name": "Bay 02 (4W)",
        "type": "120kW Fast DC",
        "maxKw": 120,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p103",
        "name": "Bay 03 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p104",
        "name": "Bay 04 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p105",
        "name": "Bay 05 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p106",
        "name": "Bay 06 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-02",
    "vendorId": "vendor-tata",
    "vendorName": "Tata Power EZ Charge",
    "vendorLogo": "⚡",
    "vendorColor": "emerald",
    "city": "Gandhinagar",
    "name": "Tata Power GIFT City FinTech SuperHub • Gandhinagar",
    "type": "FinTech Corridor Smart Grid (2W & 4W)",
    "location": "Block 12, Road 1D, GIFT SEZ Tower 1, GIFT City, Gandhinagar, Gujarat 382355",
    "lat": 23.161,
    "lng": 72.6841,
    "mapsUrl": "https://maps.google.com/?q=23.1610,72.6841",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=23.1610,72.6841",
    "pricePerKwh": 24,
    "solar": true,
    "rating": 4.9,
    "amenities": [
      "GIFT Club Access",
      "Coffee Lounge",
      "Automated Parking",
      "24x7 Security"
    ],
    "ports": [
      {
        "id": "p201",
        "name": "Bay 01 (4W)",
        "type": "180kW Fast DC",
        "maxKw": 180,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p202",
        "name": "Bay 02 (4W)",
        "type": "120kW Fast DC",
        "maxKw": 120,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p203",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p204",
        "name": "Bay 04 (2W)",
        "type": "3.3kW 16A Smart Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      },
      {
        "id": "p205",
        "name": "Bay 05 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-03",
    "vendorId": "vendor-zeon",
    "vendorName": "Zeon Charging",
    "vendorLogo": "🔋",
    "vendorColor": "indigo",
    "city": "Ahmedabad",
    "name": "Zeon Ahmedabad Airport T2 Gateway Hub",
    "type": "Airport Hypergrid (2W & 4W)",
    "location": "Terminal 2 Commercial Forecourt, SVPI Airport, Hansol, Ahmedabad, Gujarat 380003",
    "lat": 23.0734,
    "lng": 72.6266,
    "mapsUrl": "https://maps.google.com/?q=23.0734,72.6266",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=23.0734,72.6266",
    "pricePerKwh": 28,
    "solar": true,
    "rating": 4.8,
    "amenities": [
      "Airport Shuttle",
      "24x7 Airport Security",
      "Luggage Assistance",
      "Costa Coffee"
    ],
    "ports": [
      {
        "id": "p301",
        "name": "Bay 01 (4W)",
        "type": "240kW Ultra-Fast DC",
        "maxKw": 240,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p302",
        "name": "Bay 02 (4W)",
        "type": "120kW Fast DC",
        "maxKw": 120,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p303",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p304",
        "name": "Bay 04 (2W)",
        "type": "3.3kW 16A Universal 2W Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      },
      {
        "id": "p305",
        "name": "Bay 05 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-04",
    "vendorId": "vendor-statiq",
    "vendorName": "Statiq EV Fast Hub",
    "vendorLogo": "🚀",
    "vendorColor": "amber",
    "city": "Ahmedabad",
    "name": "Statiq SP Ring Road South Bopal Hub • Ahmedabad",
    "type": "Ring Road Commercial Hub (2W & 4W)",
    "location": "Gala Gymkhana Road, Near SP Ring Road Junction, South Bopal, Ahmedabad, Gujarat 380058",
    "lat": 23.0189,
    "lng": 72.4682,
    "mapsUrl": "https://maps.google.com/?q=23.0189,72.4682",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=23.0189,72.4682",
    "pricePerKwh": 25,
    "solar": true,
    "rating": 4.8,
    "amenities": [
      "Shopping Complex",
      "Fast Food",
      "Automated Bay Sensors",
      "EV Waiting Lounge"
    ],
    "ports": [
      {
        "id": "p401",
        "name": "Bay 01 (4W)",
        "type": "150kW Fast DC",
        "maxKw": 150,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p402",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p403",
        "name": "Bay 03 (Dual)",
        "type": "22kW AC Destination",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p404",
        "name": "Bay 04 (2W)",
        "type": "Ather Grid 3.3kW Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p405",
        "name": "Bay 05 (2W)",
        "type": "3.3kW 16A Smart Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-05",
    "vendorId": "vendor-voltgrid",
    "vendorName": "VoltGrid Direct Flagship",
    "vendorLogo": "🛡️",
    "vendorColor": "cyan",
    "city": "Ahmedabad",
    "name": "VoltGrid Sabarmati Riverfront Promenade Hub • Ahmedabad",
    "type": "Scenic Urban Solar Promenade (2W & 4W)",
    "location": "Riverfront West Promenade, Near Atal Pedestrian Bridge, Ashram Road, Ahmedabad, Gujarat 380009",
    "lat": 23.0365,
    "lng": 72.5714,
    "mapsUrl": "https://maps.google.com/?q=23.0365,72.5714",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=23.0365,72.5714",
    "pricePerKwh": 24,
    "solar": true,
    "rating": 5,
    "amenities": [
      "Riverfront Walkway",
      "Solar Tree Canopy",
      "Food Kiosks",
      "Atal Bridge Access"
    ],
    "ports": [
      {
        "id": "p501",
        "name": "Bay 01 (4W)",
        "type": "180kW Ultra-Fast DC",
        "maxKw": 180,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p502",
        "name": "Bay 02 (4W)",
        "type": "120kW Fast DC",
        "maxKw": 120,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p503",
        "name": "Bay 03 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p504",
        "name": "Bay 04 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p505",
        "name": "Bay 05 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p506",
        "name": "Bay 06 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-06",
    "vendorId": "vendor-jiobp",
    "vendorName": "Jio-bp pulse",
    "vendorLogo": "⛽",
    "vendorColor": "blue",
    "city": "Ahmedabad",
    "name": "Jio-bp pulse Motera Stadium MegaHub • Ahmedabad",
    "type": "Cricket Stadium Sports Complex Grid (2W & 4W)",
    "location": "Stadium Cross Road, Near Gate 1 Narendra Modi Stadium, Motera, Ahmedabad, Gujarat 380005",
    "lat": 23.0919,
    "lng": 72.5974,
    "mapsUrl": "https://maps.google.com/?q=23.0919,72.5974",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=23.0919,72.5974",
    "pricePerKwh": 26,
    "solar": true,
    "rating": 4.9,
    "amenities": [
      "Sports Complex Parking",
      "Metro Station 200m",
      "Cafe",
      "Restrooms"
    ],
    "ports": [
      {
        "id": "p601",
        "name": "Bay 01 (4W)",
        "type": "240kW Ultra-Fast DC",
        "maxKw": 240,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p602",
        "name": "Bay 02 (4W)",
        "type": "120kW Fast DC",
        "maxKw": 120,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p603",
        "name": "Bay 03 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p604",
        "name": "Bay 04 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p605",
        "name": "Bay 05 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p606",
        "name": "Bay 06 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-07",
    "vendorId": "vendor-tata",
    "vendorName": "Tata Power EZ Charge",
    "vendorLogo": "⚡",
    "vendorColor": "emerald",
    "city": "Sanand",
    "name": "Tata Power Sanand GIDC Industrial Corridor • Ahmedabad",
    "type": "Auto EV Manufacturing Industrial Hub",
    "location": "Sanand GIDC Gate 2, Sanand-Viramgam State Highway, Ahmedabad, Gujarat 382170",
    "lat": 22.9868,
    "lng": 72.3785,
    "mapsUrl": "https://maps.google.com/?q=22.9868,72.3785",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=22.9868,72.3785",
    "pricePerKwh": 24,
    "solar": true,
    "rating": 4.8,
    "amenities": [
      "Heavy Vehicle Bay",
      "Driver Rest Area",
      "Canteen",
      "24x7 Security"
    ],
    "ports": [
      {
        "id": "p701",
        "name": "Bay 01 (4W)",
        "type": "150kW Fast DC",
        "maxKw": 150,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p702",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p703",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p704",
        "name": "Bay 04 (2W)",
        "type": "3.3kW 16A Smart Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      },
      {
        "id": "p705",
        "name": "Bay 05 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-08",
    "vendorId": "vendor-statiq",
    "vendorName": "Statiq EV Fast Hub",
    "vendorLogo": "🚀",
    "vendorColor": "amber",
    "city": "Vadodara",
    "name": "Statiq NE-1 Expressway Gateway • Vadodara",
    "type": "Intercity Expressway Gateway (NE-1)",
    "location": "National Expressway 1 Entry Plaza, Golden Chokdi, Vadodara, Gujarat 390022",
    "lat": 22.3615,
    "lng": 73.2104,
    "mapsUrl": "https://maps.google.com/?q=22.3615,73.2104",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=22.3615,73.2104",
    "pricePerKwh": 25,
    "solar": true,
    "rating": 4.8,
    "amenities": [
      "Expressway Food Court",
      "EV Lounge",
      "Clean Restrooms",
      "Tyre Pressure Check"
    ],
    "ports": [
      {
        "id": "p801",
        "name": "Bay 01 (4W)",
        "type": "180kW Fast DC",
        "maxKw": 180,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p802",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p803",
        "name": "Bay 03 (Dual)",
        "type": "22kW AC Destination",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p804",
        "name": "Bay 04 (2W)",
        "type": "Ather Grid 3.3kW Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p805",
        "name": "Bay 05 (2W)",
        "type": "3.3kW 16A Smart Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-09",
    "vendorId": "vendor-tata",
    "vendorName": "Tata Power EZ Charge",
    "vendorLogo": "⚡",
    "vendorColor": "emerald",
    "city": "Vadodara",
    "name": "Tata Power Alkapuri Commercial SuperHub • Vadodara",
    "type": "City Centre Corporate Hub (2W & 4W)",
    "location": "RC Dutt Road, Opp Express Hotel, Alkapuri, Vadodara, Gujarat 390007",
    "lat": 22.3107,
    "lng": 73.1812,
    "mapsUrl": "https://maps.google.com/?q=22.3107,73.1812",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=22.3107,73.1812",
    "pricePerKwh": 24,
    "solar": true,
    "rating": 4.9,
    "amenities": [
      "Hotel Access",
      "Central Station 500m",
      "Coffee Day",
      "Valet EV Parking"
    ],
    "ports": [
      {
        "id": "p901",
        "name": "Bay 01 (4W)",
        "type": "120kW Fast DC",
        "maxKw": 120,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p902",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p903",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p904",
        "name": "Bay 04 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      },
      {
        "id": "p905",
        "name": "Bay 05 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-10",
    "vendorId": "vendor-voltgrid",
    "vendorName": "VoltGrid Direct Flagship",
    "vendorLogo": "🛡️",
    "vendorColor": "cyan",
    "city": "Anand",
    "name": "VoltGrid Anand Amul Dairy Corridor Hub",
    "type": "Milk Capital Express Solar Oasis",
    "location": "Amul Dairy Road, Near Anand Railway Junction, Anand, Gujarat 388001",
    "lat": 22.5645,
    "lng": 72.9289,
    "mapsUrl": "https://maps.google.com/?q=22.5645,72.9289",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=22.5645,72.9289",
    "pricePerKwh": 23,
    "solar": true,
    "rating": 4.9,
    "amenities": [
      "Amul Parlour",
      "Green Park Waiting Zone",
      "24x7 Security",
      "Clean Restrooms"
    ],
    "ports": [
      {
        "id": "p1001",
        "name": "Bay 01 (4W)",
        "type": "150kW Fast DC",
        "maxKw": 150,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p1002",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p1003",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p1004",
        "name": "Bay 04 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p1005",
        "name": "Bay 05 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-11",
    "vendorId": "vendor-zeon",
    "vendorName": "Zeon Charging",
    "vendorLogo": "🔋",
    "vendorColor": "indigo",
    "city": "Nadiad",
    "name": "Zeon Nadiad NH-48 Expressway Oasis",
    "type": "Highway Express Pitstop (2W & 4W)",
    "location": "NH 48 Service Road, Near Nadiad Expressway Exit, Kheda District, Gujarat 387002",
    "lat": 22.6916,
    "lng": 72.8634,
    "mapsUrl": "https://maps.google.com/?q=22.6916,72.8634",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=22.6916,72.8634",
    "pricePerKwh": 25,
    "solar": true,
    "rating": 4.7,
    "amenities": [
      "Subway & Highway Dhaba",
      "Restrooms",
      "Free Wi-Fi",
      "EV Shaded Bays"
    ],
    "ports": [
      {
        "id": "p1101",
        "name": "Bay 01 (4W)",
        "type": "150kW Fast DC",
        "maxKw": 150,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p1102",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p1103",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p1104",
        "name": "Bay 04 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p1105",
        "name": "Bay 05 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-12",
    "vendorId": "vendor-voltgrid",
    "vendorName": "VoltGrid Direct Flagship",
    "vendorLogo": "🛡️",
    "vendorColor": "cyan",
    "city": "Surat",
    "name": "VoltGrid VR Surat & Dumas Mega-Hub",
    "type": "Diamond City Central Metro Hub",
    "location": "VR Surat Mall, Dumas Road, Near Magdalla Port Junction, Surat, Gujarat 395007",
    "lat": 21.1442,
    "lng": 72.7562,
    "mapsUrl": "https://maps.google.com/?q=21.1442,72.7562",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=21.1442,72.7562",
    "pricePerKwh": 24,
    "solar": true,
    "rating": 5,
    "amenities": [
      "Mall Access",
      "Solar Canopy Power",
      "Food Court",
      "Dedicated 2W Fleet Bay"
    ],
    "ports": [
      {
        "id": "p1201",
        "name": "Bay 01 (4W)",
        "type": "360kW Hyper-DC",
        "maxKw": 360,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p1202",
        "name": "Bay 02 (4W)",
        "type": "180kW Fast DC",
        "maxKw": 180,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p1203",
        "name": "Bay 03 (4W)",
        "type": "60kW DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p1204",
        "name": "Bay 04 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p1205",
        "name": "Bay 05 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p1206",
        "name": "Bay 06 (2W)",
        "type": "3.3kW 16A Smart Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-13",
    "vendorId": "vendor-tata",
    "vendorName": "Tata Power EZ Charge",
    "vendorLogo": "⚡",
    "vendorColor": "emerald",
    "city": "Surat",
    "name": "Tata Power Surat Diamond Bourse HyperGrid",
    "type": "World Largest Office Building Smart Grid",
    "location": "Core Boulevard, Surat Diamond Bourse, DREAM City, Khajod, Surat, Gujarat 395007",
    "lat": 21.1097,
    "lng": 72.7933,
    "mapsUrl": "https://maps.google.com/?q=21.1097,72.7933",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=21.1097,72.7933",
    "pricePerKwh": 25,
    "solar": true,
    "rating": 4.9,
    "amenities": [
      "Bourse Business Lounge",
      "High-speed Wi-Fi",
      "24x7 Security",
      "Executive Cafe"
    ],
    "ports": [
      {
        "id": "p1301",
        "name": "Bay 01 (4W)",
        "type": "240kW Ultra-Fast DC",
        "maxKw": 240,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p1302",
        "name": "Bay 02 (4W)",
        "type": "120kW Fast DC",
        "maxKw": 120,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p1303",
        "name": "Bay 03 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p1304",
        "name": "Bay 04 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p1305",
        "name": "Bay 05 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p1306",
        "name": "Bay 06 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-14",
    "vendorId": "vendor-jiobp",
    "vendorName": "Jio-bp pulse",
    "vendorLogo": "⛽",
    "vendorColor": "blue",
    "city": "Surat",
    "name": "Jio-bp pulse Adajan-Pal Riverbank Hub • Surat",
    "type": "Urban River Corridor Rapid Hub",
    "location": "Gaurav Path Road, Pal, Adajan, Surat, Gujarat 395009",
    "lat": 21.1963,
    "lng": 72.7845,
    "mapsUrl": "https://maps.google.com/?q=21.1963,72.7845",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=21.1963,72.7845",
    "pricePerKwh": 26,
    "solar": true,
    "rating": 4.8,
    "amenities": [
      "Wild Bean Cafe",
      "Drive-thru Snacks",
      "2W Fast Charging",
      "Restrooms"
    ],
    "ports": [
      {
        "id": "p1401",
        "name": "Bay 01 (4W)",
        "type": "150kW Fast DC",
        "maxKw": 150,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p1402",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p1403",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p1404",
        "name": "Bay 04 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p1405",
        "name": "Bay 05 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-15",
    "vendorId": "vendor-statiq",
    "vendorName": "Statiq EV Fast Hub",
    "vendorLogo": "🚀",
    "vendorColor": "amber",
    "city": "Bharuch",
    "name": "Statiq Narmada Express Gateway • Bharuch",
    "type": "NH-48 Narmada Bridge Super-Junction",
    "location": "Zadeshwar Cross Road, NH 48, Near Narmada Golden Bridge, Bharuch, Gujarat 392011",
    "lat": 21.7241,
    "lng": 73.0189,
    "mapsUrl": "https://maps.google.com/?q=21.7241,73.0189",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=21.7241,73.0189",
    "pricePerKwh": 25,
    "solar": true,
    "rating": 4.8,
    "amenities": [
      "Highway Plaza",
      "Food Court",
      "Clean Restrooms",
      "Tyre Pressure Assist"
    ],
    "ports": [
      {
        "id": "p1501",
        "name": "Bay 01 (4W)",
        "type": "180kW Fast DC",
        "maxKw": 180,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p1502",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p1503",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p1504",
        "name": "Bay 04 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p1505",
        "name": "Bay 05 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-16",
    "vendorId": "vendor-tata",
    "vendorName": "Tata Power EZ Charge",
    "vendorLogo": "⚡",
    "vendorColor": "emerald",
    "city": "Ankleshwar",
    "name": "Tata Power Ankleshwar GIDC NH-48 Oasis",
    "type": "Chemical & Industrial Transit Supercharger",
    "location": "Station Road & NH 48, Ankleshwar GIDC, Bharuch District, Gujarat 393002",
    "lat": 21.6267,
    "lng": 73.0034,
    "mapsUrl": "https://maps.google.com/?q=21.6267,73.0034",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=21.6267,73.0034",
    "pricePerKwh": 24,
    "solar": true,
    "rating": 4.7,
    "amenities": [
      "24x7 Security",
      "Industrial Fleet Bay",
      "Clean Toilets",
      "Tea & Coffee"
    ],
    "ports": [
      {
        "id": "p1601",
        "name": "Bay 01 (4W)",
        "type": "120kW Fast DC",
        "maxKw": 120,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p1602",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p1603",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p1604",
        "name": "Bay 04 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p1605",
        "name": "Bay 05 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-17",
    "vendorId": "vendor-zeon",
    "vendorName": "Zeon Charging",
    "vendorLogo": "🔋",
    "vendorColor": "indigo",
    "city": "Navsari",
    "name": "Zeon Navsari NH-48 Transit Hub",
    "type": "Coastal South Gujarat Transit Point",
    "location": "Junathana & NH 48 Bypass, Near Central Grid, Navsari, Gujarat 396445",
    "lat": 20.9467,
    "lng": 72.952,
    "mapsUrl": "https://maps.google.com/?q=20.9467,72.9520",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=20.9467,72.9520",
    "pricePerKwh": 25,
    "solar": true,
    "rating": 4.8,
    "amenities": [
      "Rest Stop",
      "Refreshments",
      "Free Wi-Fi",
      "2W Fleet Bay"
    ],
    "ports": [
      {
        "id": "p1701",
        "name": "Bay 01 (4W)",
        "type": "120kW Fast DC",
        "maxKw": 120,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p1702",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p1703",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p1704",
        "name": "Bay 04 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p1705",
        "name": "Bay 05 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-18",
    "vendorId": "vendor-voltgrid",
    "vendorName": "VoltGrid Direct Flagship",
    "vendorLogo": "🛡️",
    "vendorColor": "cyan",
    "city": "Valsad",
    "name": "VoltGrid Valsad Tithal Coastal Oasis",
    "type": "Arabian Sea Coastal Tourist Hub",
    "location": "Dharampur Cross Road, NH 48 & Tithal Beach Rd, Valsad, Gujarat 396001",
    "lat": 20.612,
    "lng": 72.93,
    "mapsUrl": "https://maps.google.com/?q=20.6120,72.9300",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=20.6120,72.9300",
    "pricePerKwh": 24,
    "solar": true,
    "rating": 4.9,
    "amenities": [
      "Beach Access 2 km",
      "Solar Roof",
      "Cafe",
      "Air Conditioned Waiting Lounge"
    ],
    "ports": [
      {
        "id": "p1801",
        "name": "Bay 01 (4W)",
        "type": "180kW Fast DC",
        "maxKw": 180,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p1802",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p1803",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p1804",
        "name": "Bay 04 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p1805",
        "name": "Bay 05 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-19",
    "vendorId": "vendor-jiobp",
    "vendorName": "Jio-bp pulse",
    "vendorLogo": "⛽",
    "vendorColor": "blue",
    "city": "Vapi",
    "name": "Jio-bp pulse Vapi Gunjan Mega-Junction",
    "type": "Gujarat-Maharashtra Border NH-48 Hub",
    "location": "Gunjan Char Rasta, NH 48 Corridor, Vapi, Gujarat 396195",
    "lat": 20.3725,
    "lng": 72.909,
    "mapsUrl": "https://maps.google.com/?q=20.3725,72.9090",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=20.3725,72.9090",
    "pricePerKwh": 26,
    "solar": true,
    "rating": 4.9,
    "amenities": [
      "24x7 Wild Bean Cafe",
      "Interstate Lounge",
      "Restrooms",
      "2W Dedicated Charging"
    ],
    "ports": [
      {
        "id": "p1901",
        "name": "Bay 01 (4W)",
        "type": "240kW Ultra-Fast DC",
        "maxKw": 240,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p1902",
        "name": "Bay 02 (4W)",
        "type": "120kW Fast DC",
        "maxKw": 120,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p1903",
        "name": "Bay 03 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p1904",
        "name": "Bay 04 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p1905",
        "name": "Bay 05 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p1906",
        "name": "Bay 06 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-20",
    "vendorId": "vendor-tata",
    "vendorName": "Tata Power EZ Charge",
    "vendorLogo": "⚡",
    "vendorColor": "emerald",
    "city": "Rajkot",
    "name": "Tata Power 150ft Ring Road Hub • Rajkot",
    "type": "Saurashtra Highway & City Ultra-Hub",
    "location": "KKV Hall Circle, 150 Feet Ring Road, Kalawad Road, Rajkot, Gujarat 360005",
    "lat": 22.2837,
    "lng": 70.7686,
    "mapsUrl": "https://maps.google.com/?q=22.2837,70.7686",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=22.2837,70.7686",
    "pricePerKwh": 25,
    "solar": true,
    "rating": 4.8,
    "amenities": [
      "Dining",
      "Restrooms",
      "24x7 Security",
      "Convenience Store"
    ],
    "ports": [
      {
        "id": "p2001",
        "name": "Bay 01 (4W)",
        "type": "150kW Fast DC",
        "maxKw": 150,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p2002",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p2003",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p2004",
        "name": "Bay 04 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      },
      {
        "id": "p2005",
        "name": "Bay 05 (2W)",
        "type": "Ather Grid Fast Charger",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-21",
    "vendorId": "vendor-jiobp",
    "vendorName": "Jio-bp pulse",
    "vendorLogo": "⛽",
    "vendorColor": "blue",
    "city": "Rajkot",
    "name": "Jio-bp pulse Madhapar Highway SuperHub • Rajkot",
    "type": "Jamnagar-Dwarka Highway Gateway NH-27",
    "location": "Madhapar Chowk, Jamnagar Highway NH 27, Rajkot, Gujarat 360006",
    "lat": 22.3168,
    "lng": 70.782,
    "mapsUrl": "https://maps.google.com/?q=22.3168,70.7820",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=22.3168,70.7820",
    "pricePerKwh": 26,
    "solar": true,
    "rating": 4.9,
    "amenities": [
      "Wild Bean Cafe",
      "Clean Highway Restrooms",
      "Free Air",
      "2W Dedicated Charging"
    ],
    "ports": [
      {
        "id": "p2101",
        "name": "Bay 01 (4W)",
        "type": "180kW Fast DC",
        "maxKw": 180,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p2102",
        "name": "Bay 02 (4W)",
        "type": "120kW Fast DC",
        "maxKw": 120,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p2103",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p2104",
        "name": "Bay 04 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p2105",
        "name": "Bay 05 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-22",
    "vendorId": "vendor-statiq",
    "vendorName": "Statiq EV Fast Hub",
    "vendorLogo": "🚀",
    "vendorColor": "amber",
    "city": "Jamnagar",
    "name": "Statiq Jamnagar Reliance Greens Gateway",
    "type": "Refinery Mega Complex Highway Hub",
    "location": "Moti Khavdi, Jamnagar-Khambhalia Highway, Near Reliance Greens Gate, Jamnagar, Gujarat 361140",
    "lat": 22.4278,
    "lng": 69.871,
    "mapsUrl": "https://maps.google.com/?q=22.4278,69.8710",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=22.4278,69.8710",
    "pricePerKwh": 25,
    "solar": true,
    "rating": 4.8,
    "amenities": [
      "Highway Diner",
      "Executive Lounge",
      "Restrooms",
      "Security Patrol"
    ],
    "ports": [
      {
        "id": "p2201",
        "name": "Bay 01 (4W)",
        "type": "180kW Fast DC",
        "maxKw": 180,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p2202",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p2203",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p2204",
        "name": "Bay 04 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p2205",
        "name": "Bay 05 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-23",
    "vendorId": "vendor-zeon",
    "vendorName": "Zeon Charging",
    "vendorLogo": "🔋",
    "vendorColor": "indigo",
    "city": "Bhavnagar",
    "name": "Zeon Bhavnagar Victoria Park SuperHub",
    "type": "Gulf of Khambhat Urban Hub",
    "location": "Waghawadi Road, Near Victoria Park Circle, Bhavnagar, Gujarat 364002",
    "lat": 21.7455,
    "lng": 72.1384,
    "mapsUrl": "https://maps.google.com/?q=21.7455,72.1384",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=21.7455,72.1384",
    "pricePerKwh": 24,
    "solar": true,
    "rating": 4.8,
    "amenities": [
      "Park Green Area",
      "Restrooms",
      "Coffee Kiosk",
      "2W Dedicated Charging"
    ],
    "ports": [
      {
        "id": "p2301",
        "name": "Bay 01 (4W)",
        "type": "120kW Fast DC",
        "maxKw": 120,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p2302",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p2303",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p2304",
        "name": "Bay 04 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p2305",
        "name": "Bay 05 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-24",
    "vendorId": "vendor-tata",
    "vendorName": "Tata Power EZ Charge",
    "vendorLogo": "⚡",
    "vendorColor": "emerald",
    "city": "Junagadh",
    "name": "Tata Power Junagadh Girnar Eco-Hub",
    "type": "Sacred Mount Girnar Foothill Sanctuary",
    "location": "Bhavnath Taleti Road, Foothills of Mount Girnar, Junagadh, Gujarat 362001",
    "lat": 21.5222,
    "lng": 70.4789,
    "mapsUrl": "https://maps.google.com/?q=21.5222,70.4789",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=21.5222,70.4789",
    "pricePerKwh": 24,
    "solar": true,
    "rating": 4.9,
    "amenities": [
      "Ropeway Access",
      "Pilgrim Amenities",
      "Mountain View Cafe",
      "Clean Restrooms"
    ],
    "ports": [
      {
        "id": "p2401",
        "name": "Bay 01 (4W)",
        "type": "120kW Fast DC",
        "maxKw": 120,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p2402",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p2403",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p2404",
        "name": "Bay 04 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p2405",
        "name": "Bay 05 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-25",
    "vendorId": "vendor-voltgrid",
    "vendorName": "VoltGrid Direct Flagship",
    "vendorLogo": "🛡️",
    "vendorColor": "cyan",
    "city": "Morbi",
    "name": "VoltGrid Morbi Ceramic Expressway Hub",
    "type": "Ceramic Capital NH-27 Industrial Grid",
    "location": "NH 27 Bypass, Near Makansar Ceramic Zone, Morbi, Gujarat 363642",
    "lat": 22.812,
    "lng": 70.8385,
    "mapsUrl": "https://maps.google.com/?q=22.8120,70.8385",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=22.8120,70.8385",
    "pricePerKwh": 24,
    "solar": true,
    "rating": 4.8,
    "amenities": [
      "Industrial Plaza",
      "Highway Restaurant",
      "EV Battery Health Check",
      "Security"
    ],
    "ports": [
      {
        "id": "p2501",
        "name": "Bay 01 (4W)",
        "type": "180kW Fast DC",
        "maxKw": 180,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p2502",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p2503",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p2504",
        "name": "Bay 04 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p2505",
        "name": "Bay 05 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-26",
    "vendorId": "vendor-jiobp",
    "vendorName": "Jio-bp pulse",
    "vendorLogo": "⛽",
    "vendorColor": "blue",
    "city": "Porbandar",
    "name": "Jio-bp pulse Porbandar Coastal Gateway",
    "type": "Birthplace of Mahatma Gandhi Coastal Hub",
    "location": "Chowpati Beach Promenade, NH 51 Coastal Highway, Porbandar, Gujarat 360575",
    "lat": 21.6417,
    "lng": 69.6093,
    "mapsUrl": "https://maps.google.com/?q=21.6417,69.6093",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=21.6417,69.6093",
    "pricePerKwh": 25,
    "solar": true,
    "rating": 4.8,
    "amenities": [
      "Beachside Walk",
      "Wild Bean Cafe",
      "Free Wi-Fi",
      "Restrooms"
    ],
    "ports": [
      {
        "id": "p2601",
        "name": "Bay 01 (4W)",
        "type": "120kW Fast DC",
        "maxKw": 120,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p2602",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p2603",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p2604",
        "name": "Bay 04 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p2605",
        "name": "Bay 05 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-27",
    "vendorId": "vendor-tata",
    "vendorName": "Tata Power EZ Charge",
    "vendorLogo": "⚡",
    "vendorColor": "emerald",
    "city": "Dwarka",
    "name": "Tata Power Dwarka Holy Shrine & Shivrajpur Hub",
    "type": "Sacred Western Coastal Pilgrimage Grid",
    "location": "Dwarkadhish Temple Access Rd & Okha Highway, Dwarka, Gujarat 361335",
    "lat": 22.2442,
    "lng": 68.9685,
    "mapsUrl": "https://maps.google.com/?q=22.2442,68.9685",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=22.2442,68.9685",
    "pricePerKwh": 24,
    "solar": true,
    "rating": 4.9,
    "amenities": [
      "Temple Shuttle 500m",
      "Shivrajpur Beach 10 km",
      "Pilgrim Rest Area",
      "Prasadam Kiosk"
    ],
    "ports": [
      {
        "id": "p2701",
        "name": "Bay 01 (4W)",
        "type": "150kW Fast DC",
        "maxKw": 150,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p2702",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p2703",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p2704",
        "name": "Bay 04 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p2705",
        "name": "Bay 05 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-28",
    "vendorId": "vendor-jiobp",
    "vendorName": "Jio-bp pulse",
    "vendorLogo": "⛽",
    "vendorColor": "blue",
    "city": "Somnath",
    "name": "Jio-bp pulse Somnath Temple Heritage Hub",
    "type": "First Jyotirlinga Oceanfront Sanctuary",
    "location": "Somnath Temple Bypass, Prabhas Patan, Veraval, Gujarat 362268",
    "lat": 20.888,
    "lng": 70.4012,
    "mapsUrl": "https://maps.google.com/?q=20.8880,70.4012",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=20.8880,70.4012",
    "pricePerKwh": 25,
    "solar": true,
    "rating": 5,
    "amenities": [
      "Ocean Promenade",
      "Temple Access",
      "Restrooms",
      "Wild Bean Cafe"
    ],
    "ports": [
      {
        "id": "p2801",
        "name": "Bay 01 (4W)",
        "type": "150kW Fast DC",
        "maxKw": 150,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p2802",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p2803",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p2804",
        "name": "Bay 04 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p2805",
        "name": "Bay 05 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-29",
    "vendorId": "vendor-voltgrid",
    "vendorName": "VoltGrid Direct Flagship",
    "vendorLogo": "🛡️",
    "vendorColor": "cyan",
    "city": "Sasan Gir",
    "name": "VoltGrid Sasan Gir Eco Wildlife Sanctuary Hub",
    "type": "Asiatic Lion National Reserve Eco Grid",
    "location": "Sinh Sadan Safari Gate Road, Sasan Gir Forest Reserve, Junagadh District, Gujarat 362135",
    "lat": 21.134,
    "lng": 70.5985,
    "mapsUrl": "https://maps.google.com/?q=21.1340,70.5985",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=21.1340,70.5985",
    "pricePerKwh": 23,
    "solar": true,
    "rating": 5,
    "amenities": [
      "100% Solar Canopy",
      "Forest Interpretation Center",
      "Quiet EV Charging",
      "Clean Restrooms"
    ],
    "ports": [
      {
        "id": "p2901",
        "name": "Bay 01 (4W)",
        "type": "120kW Fast DC",
        "maxKw": 120,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p2902",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p2903",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p2904",
        "name": "Bay 04 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p2905",
        "name": "Bay 05 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-30",
    "vendorId": "vendor-jiobp",
    "vendorName": "Jio-bp pulse",
    "vendorLogo": "⛽",
    "vendorColor": "blue",
    "city": "Kevadia",
    "name": "Jio-bp Statue of Unity Green Zone • Kevadia",
    "type": "100% Green Tourism Hub (2W & 4W)",
    "location": "Ekta Mall & Shrestha Bharat Bhavan, Ekta Nagar, Kevadia, Gujarat 393151",
    "lat": 21.838,
    "lng": 73.7191,
    "mapsUrl": "https://maps.google.com/?q=21.8380,73.7191",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=21.8380,73.7191",
    "pricePerKwh": 23,
    "solar": true,
    "rating": 5,
    "amenities": [
      "Tourist Information",
      "Solar Canopy",
      "EV Buggy Transfer",
      "Restrooms"
    ],
    "ports": [
      {
        "id": "p3001",
        "name": "Bay 01 (4W)",
        "type": "180kW Fast DC",
        "maxKw": 180,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p3002",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p3003",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p3004",
        "name": "Bay 04 (2W)",
        "type": "3.3kW 16A E-Scooter Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      },
      {
        "id": "p3005",
        "name": "Bay 05 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-31",
    "vendorId": "vendor-tata",
    "vendorName": "Tata Power EZ Charge",
    "vendorLogo": "⚡",
    "vendorColor": "emerald",
    "city": "Bhuj",
    "name": "Tata Power Bhuj Kutch Heritage Hub",
    "type": "Kutch Capital & Desert Tourism Gateway",
    "location": "Airport Road, Near Jubilee Ground & Prag Mahal, Bhuj, Kutch, Gujarat 370001",
    "lat": 23.2589,
    "lng": 69.6692,
    "mapsUrl": "https://maps.google.com/?q=23.2589,69.6692",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=23.2589,69.6692",
    "pricePerKwh": 24,
    "solar": true,
    "rating": 4.8,
    "amenities": [
      "Handicraft Center",
      "Kutch Tourism Desk",
      "Free Wi-Fi",
      "Restrooms"
    ],
    "ports": [
      {
        "id": "p3101",
        "name": "Bay 01 (4W)",
        "type": "120kW Fast DC",
        "maxKw": 120,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p3102",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p3103",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p3104",
        "name": "Bay 04 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p3105",
        "name": "Bay 05 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-32",
    "vendorId": "vendor-voltgrid",
    "vendorName": "VoltGrid Direct Flagship",
    "vendorLogo": "🛡️",
    "vendorColor": "cyan",
    "city": "Dhordo (White Rann)",
    "name": "VoltGrid White Rann Desert Supercharger • Dhordo",
    "type": "Rann Utsav Great Salt Desert Solar Grid",
    "location": "Tent City Entry Plaza, Dhordo, Great Rann of Kutch, Gujarat 370510",
    "lat": 23.829,
    "lng": 69.5135,
    "mapsUrl": "https://maps.google.com/?q=23.8290,69.5135",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=23.8290,69.5135",
    "pricePerKwh": 25,
    "solar": true,
    "rating": 5,
    "amenities": [
      "Tent City Entrance",
      "100% Desert Solar Power",
      "Rann Cultural Lounge",
      "Restrooms"
    ],
    "ports": [
      {
        "id": "p3201",
        "name": "Bay 01 (4W)",
        "type": "150kW Desert Ultra-DC",
        "maxKw": 150,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p3202",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p3203",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p3204",
        "name": "Bay 04 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p3205",
        "name": "Bay 05 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-33",
    "vendorId": "vendor-zeon",
    "vendorName": "Zeon Charging",
    "vendorLogo": "🔋",
    "vendorColor": "indigo",
    "city": "Gandhidham",
    "name": "Zeon Gandhidham Kandla Port Transit Oasis",
    "type": "Major Maritime Trade & Heavy Transit Hub",
    "location": "Oslo Circle, Tagore Road & NH 41, Gandhidham, Kutch, Gujarat 370201",
    "lat": 23.0753,
    "lng": 70.1337,
    "mapsUrl": "https://maps.google.com/?q=23.0753,70.1337",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=23.0753,70.1337",
    "pricePerKwh": 24,
    "solar": true,
    "rating": 4.8,
    "amenities": [
      "Port Logistics Rest Stop",
      "24x7 Security",
      "Diner",
      "Restrooms"
    ],
    "ports": [
      {
        "id": "p3301",
        "name": "Bay 01 (4W)",
        "type": "150kW Fast DC",
        "maxKw": 150,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p3302",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p3303",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p3304",
        "name": "Bay 04 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p3305",
        "name": "Bay 05 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  },
  {
    "id": "st-34",
    "vendorId": "vendor-statiq",
    "vendorName": "Statiq EV Fast Hub",
    "vendorLogo": "🚀",
    "vendorColor": "amber",
    "city": "Mehsana",
    "name": "Statiq Mehsana Sun Temple Expressway Hub",
    "type": "North Gujarat Highway & Heritage Super-Corridor",
    "location": "Radhanpur Cross Road, Ahmedabad-Palanpur Highway, Mehsana, Gujarat 384002",
    "lat": 23.588,
    "lng": 72.3693,
    "mapsUrl": "https://maps.google.com/?q=23.5880,72.3693",
    "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=23.5880,72.3693",
    "pricePerKwh": 24,
    "solar": true,
    "rating": 4.8,
    "amenities": [
      "Highway Food Court",
      "Clean Restrooms",
      "Modhera Temple Access",
      "EV Shaded Bays"
    ],
    "ports": [
      {
        "id": "p3401",
        "name": "Bay 01 (4W)",
        "type": "150kW Fast DC",
        "maxKw": 150,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p3402",
        "name": "Bay 02 (4W)",
        "type": "60kW Fast DC",
        "maxKw": 60,
        "status": "available",
        "connector": "CCS2",
        "vehicleType": "4W"
      },
      {
        "id": "p3403",
        "name": "Bay 03 (Dual)",
        "type": "22kW Type 2 AC",
        "maxKw": 22,
        "status": "available",
        "connector": "Type 2",
        "vehicleType": "BOTH"
      },
      {
        "id": "p3404",
        "name": "Bay 04 (2W)",
        "type": "Ather Grid Fast Point",
        "maxKw": 3.3,
        "status": "available",
        "connector": "Ather Type 6",
        "vehicleType": "2W"
      },
      {
        "id": "p3405",
        "name": "Bay 05 (2W)",
        "type": "3.3kW 16A Universal Socket",
        "maxKw": 3.3,
        "status": "available",
        "connector": "16A Smart Socket",
        "vehicleType": "2W"
      }
    ]
  }
];

const INITIAL_VENDORS = [
  {
    id: 'vendor-jiobp',
    name: 'Jio-bp pulse',
    logo: '⛽',
    color: 'blue',
    gstin: '24AAACJ1234F1Z8',
    bank: 'HDFC Bank • Account ending in 8841',
    rate: 0.15,
    rating: 4.9
  },
  {
    id: 'vendor-tata',
    name: 'Tata Power EZ Charge',
    logo: '⚡',
    color: 'emerald',
    gstin: '24AAACT2727Q1ZU',
    bank: 'State Bank of India • Account ending in 4109',
    rate: 0.15,
    rating: 4.9
  },
  {
    id: 'vendor-zeon',
    name: 'Zeon Charging',
    logo: '🔋',
    color: 'indigo',
    gstin: '24AAACZ9876K1ZP',
    bank: 'ICICI Bank • Account ending in 7732',
    rate: 0.15,
    rating: 4.8
  },
  {
    id: 'vendor-statiq',
    name: 'Statiq EV Fast Hub',
    logo: '🚀',
    color: 'amber',
    gstin: '24AAACS5544M1ZT',
    bank: 'Axis Bank • Account ending in 9021',
    rate: 0.15,
    rating: 4.8
  },
  {
    id: 'vendor-voltgrid',
    name: 'VoltGrid Direct Flagship',
    logo: '🛡️',
    color: 'cyan',
    gstin: '24AAACV1010A1Z5',
    bank: 'Kotak Mahindra Bank • Account ending in 3318',
    rate: 0.15,
    rating: 5.0
  }
];

const INITIAL_BOOKINGS = [
  {
    id: 'BK-98214',
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98250 12345',
    vehicleModel: 'MG ZS EV (50.3 kWh)',
    stationId: 'st-01',
    stationName: 'Jio-bp pulse SG Highway HyperHub • Ahmedabad',
    vendorId: 'vendor-jiobp',
    vendorName: 'Jio-bp pulse',
    portId: 'Bay 01 (4W)',
    energyKwh: 38.5,
    totalAmount: 1001,
    platformFee: 150,
    vendorPayout: 851,
    status: 'COMPLETED'
  },
  {
    id: 'BK-98215',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    customerName: 'Rohan Mehra',
    customerPhone: '+91 98980 54321',
    vehicleModel: 'Hyundai Ioniq 5 (72.6 kWh)',
    stationId: 'st-02',
    stationName: 'Tata Power GIFT City FinTech SuperHub • Gandhinagar',
    vendorId: 'vendor-tata',
    vendorName: 'Tata Power EZ Charge',
    portId: 'Bay 01 (4W)',
    energyKwh: 52.0,
    totalAmount: 1248,
    platformFee: 187,
    vendorPayout: 1061,
    status: 'COMPLETED'
  },
  {
    id: 'BK-98216',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    customerName: 'Kiran Patel',
    customerPhone: '+91 97240 98765',
    vehicleModel: 'Tata Punch EV (35 kWh)',
    stationId: 'st-12',
    stationName: 'VoltGrid VR Surat & Dumas Mega-Hub',
    vendorId: 'vendor-voltgrid',
    vendorName: 'VoltGrid Direct Flagship',
    portId: 'Bay 02 (4W)',
    energyKwh: 24.5,
    totalAmount: 588,
    platformFee: 88,
    vendorPayout: 500,
    status: 'CHARGING'
  },
  {
    id: 'BK-98217',
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    customerName: 'Priya Joshi',
    customerPhone: '+91 94260 11223',
    vehicleModel: 'Ather 450X Gen 3 (3.7 kWh)',
    stationId: 'st-08',
    stationName: 'Statiq NE-1 Expressway Gateway • Vadodara',
    vendorId: 'vendor-statiq',
    vendorName: 'Statiq EV Fast Hub',
    portId: 'Bay 04 (2W)',
    energyKwh: 3.2,
    totalAmount: 80,
    platformFee: 12,
    vendorPayout: 68,
    status: 'COMPLETED'
  }
];

const VoltGridDB = {
  channel: typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('voltgrid_db_sync') : null,
  syncCallbacks: [],

  // Load stations with auto-upgrade if fewer than 30
  getStations: function() {
    try {
      const saved = localStorage.getItem('voltgrid_stations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 30) {
          return parsed;
        }
      }
    } catch (e) {}
    // Seed fresh 34 Gujarat stations
    const fresh = JSON.parse(JSON.stringify(INITIAL_STATIONS));
    localStorage.setItem('voltgrid_stations', JSON.stringify(fresh));
    return fresh;
  },

  saveStations: function(stations) {
    try {
      localStorage.setItem('voltgrid_stations', JSON.stringify(stations));
      this.broadcast('STATIONS_UPDATED', stations);
    } catch (e) {
      console.warn('Failed to save stations to localStorage:', e);
    }

    // Persist changes to Cloud MongoDB via /api/stations
    try {
      if (typeof fetch !== 'undefined') {
        fetch('/api/stations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stations: stations })
        }).catch(function(err) {});
      }
    } catch(err) {}
  },

  syncFromCloud: function(callback) {
    try {
      if (typeof fetch !== 'undefined') {
        fetch('/api/stations')
          .then(function(res) { return res.json(); })
          .then(function(data) {
            if (data && data.stations && Array.isArray(data.stations) && data.stations.length >= 30) {
              localStorage.setItem('voltgrid_stations', JSON.stringify(data.stations));
              if (typeof callback === 'function') callback(data.stations);
              if (window.VoltGridDB) window.VoltGridDB.notifySync('STATIONS_UPDATED', data.stations);
            }
          })
          .catch(function(err) {});
      }
    } catch(e) {}
  },

  getVendors: function() {
    return JSON.parse(JSON.stringify(INITIAL_VENDORS));
  },

  getBookings: function() {
    try {
      const saved = localStorage.getItem('voltgrid_bookings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    const fresh = JSON.parse(JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem('voltgrid_bookings', JSON.stringify(fresh));
    return fresh;
  },

  saveBookings: function(bookings) {
    try {
      localStorage.setItem('voltgrid_bookings', JSON.stringify(bookings));
      this.broadcast('BOOKINGS_UPDATED', bookings);
    } catch (e) {
      console.warn('Failed to save bookings to localStorage:', e);
    }
  },

  addBooking: function(booking) {
    const list = this.getBookings();
    list.unshift(booking);
    this.saveBookings(list);
  },

  updateStationTariff: function(stationId, newPrice) {
    const stations = this.getStations();
    const st = stations.find(s => s.id === stationId);
    if (st) {
      st.pricePerKwh = Number(newPrice);
      this.saveStations(stations);
      return true;
    }
    return false;
  },

  addPortToStation: function(stationId, portData) {
    const stations = this.getStations();
    const st = stations.find(s => s.id === stationId);
    if (st) {
      if (!st.ports) st.ports = [];
      const newPortId = 'p' + stationId.replace(/[^0-9]/g, '') + '0' + (st.ports.length + 1);
      const newPort = {
        id: newPortId,
        name: portData.name || ('Bay 0' + (st.ports.length + 1)),
        type: portData.type || (portData.maxKw + 'kW Fast DC'),
        maxKw: Number(portData.maxKw) || 60,
        status: 'available',
        connector: portData.connector || 'CCS2',
        vehicleType: portData.vehicleType || '4W'
      };
      st.ports.push(newPort);
      this.saveStations(stations);
      return newPort;
    }
    return null;
  },

  togglePortMaintenance: function(stationId, portId) {
    const stations = this.getStations();
    const st = stations.find(s => s.id === stationId);
    if (st && st.ports) {
      const p = st.ports.find(x => x.id === portId);
      if (p) {
        p.status = p.status === 'maintenance' ? 'available' : 'maintenance';
        this.saveStations(stations);
        return p.status;
      }
    }
    return null;
  },

  forceReleasePort: function(stationId, portId) {
    const stations = this.getStations();
    const st = stations.find(s => s.id === stationId);
    if (st && st.ports) {
      const p = st.ports.find(x => x.id === portId);
      if (p) {
        p.status = 'available';
        p.vehicle = null;
        p.customer = null;
        p.soc = null;
        p.pin = null;
        p.holdUntil = null;
        p.chargingStartedAt = null;
        this.saveStations(stations);
        return true;
      }
    }
    return false;
  },

  broadcast: function(type, data) {
    if (this.channel) {
      this.channel.postMessage({ type, data, timestamp: Date.now() });
    }
    this.syncCallbacks.forEach(cb => {
      try { cb(type, data); } catch (err) {}
    });
  },

  onSync: function(callback) {
    if (typeof callback === 'function') {
      this.syncCallbacks.push(callback);
    }
  }
};

// Listen for cross-tab updates via BroadcastChannel
if (VoltGridDB.channel) {
  VoltGridDB.channel.onmessage = (event) => {
    if (event.data && event.data.type) {
      VoltGridDB.syncCallbacks.forEach(cb => {
        try { cb(event.data.type, event.data.data); } catch (err) {}
      });
    }
  };
}

// Listen for storage events (for browsers without BroadcastChannel)
window.addEventListener('storage', (e) => {
  if (e.key === 'voltgrid_stations' || e.key === 'voltgrid_bookings') {
    VoltGridDB.syncCallbacks.forEach(cb => {
      try { cb(e.key === 'voltgrid_stations' ? 'STATIONS_UPDATED' : 'BOOKINGS_UPDATED', null); } catch (err) {}
    });
  }
});

// Expose globally
window.VoltGridDB = VoltGridDB;
window.INITIAL_STATIONS = INITIAL_STATIONS;
window.INITIAL_VENDORS = INITIAL_VENDORS;
window.INITIAL_BOOKINGS = INITIAL_BOOKINGS;


// Auto-sync from cloud on load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', function() {
    if (window.VoltGridDB && window.VoltGridDB.syncFromCloud) {
      window.VoltGridDB.syncFromCloud();
    }
  });
}
