import dotenv from 'dotenv';
dotenv.config();

import { Review } from '../models/Review.js';

export async function seedReviews() {
  const count = await Review.countDocuments();
  if (count > 0) {
    console.log(`[Seed Reviews] Reviews already exist (${count}). Skipping.`);
    return;
  }

  const initialReviews = [
    {
      userName: 'Manish Saran',
      userCity: 'Ahmedabad',
      vehicleModel: 'MG ZS EV Excite',
      stationName: 'Ahmedabad SG Highway Superhub',
      rating: 5,
      comment:
        'One of the most trusted charging platforms across Gujarat! The 15-min instant slot hold worked flawlessly on the SG Highway hub — reserved while on SG Road and bay was locked with my PIN upon arrival. Highly recommended for every EV owner.',
      verifiedDriver: true
    },
    {
      userName: 'Rajeshbabu Dodda',
      userCity: 'Vadodara',
      vehicleModel: 'Tata Nexon EV Max',
      stationName: 'NE1 Express Highway Vadodara Hub',
      rating: 5,
      comment:
        'Best EV charging network experience in Gujarat. Clean modern interface, real-time bay availability, and the CCS-2 charger gave a full 120kW burst. Zero wait time on the Ahmedabad-Vadodara expressway.',
      verifiedDriver: true
    },
    {
      userName: 'Sohan Patel',
      userCity: 'Surat',
      vehicleModel: 'Mahindra XUV400 EL',
      stationName: 'Surat Ring Road Fast Charging Terminal',
      rating: 5,
      comment:
        'VoltGrid is the best charging platform because they guarantee your plug with the 15-minute PIN lock. Other networks make you wait in queues, but here my port was locked and waiting for me. Instant GST receipt on my phone too!',
      verifiedDriver: true
    },
    {
      userName: 'Priya Mehra',
      userCity: 'Rajkot',
      vehicleModel: 'Hyundai Ioniq 5',
      stationName: 'Rajkot Bypass Fast Terminal',
      rating: 5,
      comment:
        'Traveled from Rajkot to Dwarka without a hint of range anxiety. High power 150kW chargers, seamless digital pass on arrival, and clear transparent ₹24/kWh pricing.',
      verifiedDriver: true
    }
  ];

  await Review.insertMany(initialReviews);
  console.log(`[Seed Reviews] Seeded ${initialReviews.length} verified reviews.`);
}
