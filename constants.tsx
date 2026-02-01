
import { Trainer, Facility, Plan, Review } from './types';

/**
 * CONFIGURATION: REPLACE THESE URLS WITH YOUR OWN IMAGE LINKS
 * 1. Upload your image to Imgur/Cloudinary/PostImages
 * 2. Copy the "Direct Link" (ends in .jpg, .png, etc.)
 * 3. Paste it here.
 */
export const IMAGE_ASSETS = {
  heroBackground: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1920',
  philosophySection: 'https://i.postimg.cc/pLJyBWdq/IMG-2403.jpg',
  trainers: {
    kenji: 'https://i.postimg.cc/RhJ2MZ8H/IMG-2408.png',
    sonia: 'https://i.postimg.cc/JzzvnxSv/IMG-2410.png',
    leo: 'https://i.postimg.cc/RVKKtzxT/IMG-2412.png',
  }
};

export const CONTACT_INFO = {
  address: "851, Hare Krishna vihar , Nipania, Indore",
  phone: "+91 898929993",
  instagram: "@ninja.fitz",
  instagramLink: "https://www.instagram.com/ninja.fitz?igsh=cXVpenBhNWR3YnZl&utm_source=qr"
};

export const OPERATING_HOURS = [
  { day: 'Monday', hours: '24-Hours', status: '' },
  { day: 'Tuesday', hours: '24-Hours', status: '' },
  { day: 'Wednesday', hours: '24-Hours', status: '' },
  { day: 'Thursday', hours: '24-Hours', status: ''},
  { day: 'Friday', hours: '24-Hours', status: '' },
  { day: 'Saturday', hours: '24-Hours', status: '' },
  { day: 'Sunday', hours: 'Open Till Morning 11 am', status: '' },
];

export const TRAINER_TIMINGS = [
  { shift: 'Morning Protocol', hours: '06:00 AM - 11:00 AM', focus: 'Genneral Training' },
  { shift: 'Evening Protocol', hours: '05:00 PM - 9:30 PM', focus: 'Genneral Training' },
  { shift: 'Personal Training', hours: 'By Session Time', focus: 'Custom Bio-Optimization' },
];

export const CATEGORIES = [
  { id: 'single', name: 'Single Warrior' },
  { id: 'couple', name: 'Couples Offer' },
  { id: 'student', name: 'Students Offer' },
  { id: 'pt', name: 'Personal Training' },
];

export const DURATIONS = [
  { id: 12, name: '1 Year' },
  { id: 6, name: '6 Months' },
  { id: 3, name: '3 Months' },
  { id: 1, name: '1 Month' },
];

export const PRICE_MATRIX: Record<string, Record<number, number>> = {
  single: {
    1: 1500,
    3: 4200,
    6: 6000,
    12: 9000
  },
  couple: {
    1: 2600,
    3: 7500,
    6: 11000,
    12: 16000
  },
  student: {
    1: 1300,
    3: 3800,
    6: 5500,
    12: 8000
  },
  pt: {
    1: 9999,
    3: 24999
  }
};

export const TRAINERS: Trainer[] = [
  {
    id: '1',
    name: 'Fatloss in 4 months',
    specialty: 'By Mahendra Sir.',
    image: IMAGE_ASSETS.trainers.kenji,
    description: 'Mr Tarun-“From excuses to abs, his consistency and hard work changed everything.”'
  },
  {
    id: '2',
    name: '20kg Weight Loss',
    specialty: 'By Vaibhav Sir.',
    image: IMAGE_ASSETS.trainers.sonia,
    description: 'Miss Tanisha-“She lost 20 kg with pure dedication, discipline, and never missing a day.”'
  },
  {
    id: '3',
    name: 'Skinny Fat To Muscular',
    specialty: 'By Genral Training.',
    image: IMAGE_ASSETS.trainers.leo,
    description: 'Mr Aaditya-“A clear example of how consistency and smart training can turn skinny-fat into elite.”'
  }
];

export const FACILITIES: Facility[] = [
  {
    id: 'f1',
    title: 'Female Friendly Training Enivorment',
    description: 'Comfortable, supportive atmosphere with workouts and guidance designed keeping women’s fitness needs in mind.',
    icon: '🧘'
  },
  {
    id: 'f2',
    title: '24-Hour Access',
    description: 'Train at your convenience, whether early morning or late night, fitness that fits your schedule.',
    icon: '⏱️'
  },
  {
    id: 'f3',
    title: 'Group Workout & Zumba Sessions',
    description: 'High-energy group classes that keep workouts fun, motivating, and consistent, suitable for all fitness levels.',
    icon: '👥'
  },
  {
    id: 'f4',
    title: 'Muscle-Specific Stations',
    description: 'Multiple stations for focused and efficient muscle training.',
    icon: '💪'
  }
];

export const GYM_PHOTOS = [
  {
    url: 'https://i.postimg.cc/tTT1TKpr/IMG-2394-(1).jpg',
    caption: 'Dedicated Cardio Arena'
  },
  {
    url: 'https://i.postimg.cc/RVcwjzFy/IMG-2393.jpg',
    caption: 'Two Executive Dumbbell Zone'
  },
  {
    url: 'https://i.postimg.cc/Y9YShMTm/IMG-2398.jpg',
    caption: 'Open Cross-Fit And Zumba Area'
  },
  {
    url: 'https://i.postimg.cc/Hn9Fhh77/IMG-2397.jpg',
    caption: '35+ Strength Stations'
  },
  {
    url: 'https://i.postimg.cc/PJfkTHH8/IMG-2396.jpg',
    caption: 'Changing Room & Steam Facilities'
  },
  {
    url: 'https://i.postimg.cc/Zqz2JmFm/IMG-2399.jpg',
    caption: '6000+ Square Fit Area'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Arjun Mehta',
    rating: 5,
    comment: 'The environment here is unmatched. 24/7 access has changed my life!',
    avatar: 'https://i.pravatar.cc/150?u=arjun'
  },
  {
    id: 'r2',
    author: 'Priya Sharma',
    rating: 5,
    comment: 'Master Kenji is incredible. I saw more results in 1 month than in a year elsewhere.',
    avatar: 'https://i.pravatar.cc/150?u=priya'
  },
  {
    id: 'r3',
    author: 'Rohan Das',
    rating: 4,
    comment: 'Top-tier equipment. Best gym in the city for serious athletes.',
    avatar: 'https://i.pravatar.cc/150?u=rohan'
  }
];
