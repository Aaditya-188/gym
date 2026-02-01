
export interface Trainer {
  id: string;
  name: string;
  specialty: string;
  image: string;
  description: string;
}

export interface Facility {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  color: string;
}

export interface Lead {
  name: string;
  contact: string;
  plan: string;
  months: number;
  date: string;
  totalPrice: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  avatar: string;
}
