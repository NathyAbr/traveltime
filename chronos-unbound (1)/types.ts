
export interface Destination {
  id: string;
  title: string;
  period: string;
  coords: string;
  description: string;
  longDescription: string;
  image: string;
  color: string;
  price: number;
  tags: string[];
  features: string[];
}

export interface CartItem extends Destination {
  bookingId: string;
  date: string;
  crew: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
