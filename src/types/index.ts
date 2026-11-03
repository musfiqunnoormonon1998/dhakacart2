export type ProductSpecs = Record<string, string | undefined>;

export interface Product {
  id: string;
  name: string;
  banglaName: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  origin: string;
  badge: string;
  stock: number;
  tags: string[];
  description: string;
  specs: ProductSpecs;
  color: string;
  accentColor: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DeliveryDetails {
  fullName: string;
  phone: string;
  division: string;
  district: string;
  thana: string;
  address: string;
  deliveryArea: 'dhaka' | 'outside';
  paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'cod' | 'card';
  notes?: string;
}

export interface PlacedOrder {
  orderId: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  deliveryDetails: DeliveryDetails;
}
