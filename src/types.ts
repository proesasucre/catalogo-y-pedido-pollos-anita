export interface Category {
  id: string;
  name: string;
  shortTitle: string;
  column: 'left' | 'right';
  order: number;
  image: string;
  description: string;
  badge?: string;
}

export interface ProductOption {
  name: string;
  required?: boolean;
  choices: {
    label: string;
    extraPrice?: number;
  }[];
}

export interface ProductExtra {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  isAvailable: boolean;
  isPopular?: boolean;
  badge?: string;
  accompaniments: string;
  options?: ProductOption[];
  extras?: ProductExtra[];
}

export interface CartItem {
  cartId: string;
  productId: string;
  name: string;
  basePrice: number;
  price: number;
  quantity: number;
  image: string;
  selectedOptions: Record<string, string>;
  selectedExtras: ProductExtra[];
  notes?: string;
}

export type PaymentMethod = 'efectivo' | 'qr' | 'tarjeta';

export interface OrderForm {
  customerName: string;
  phone: string;
  address: string;
  reference: string;
  paymentMethod: PaymentMethod;
  cashAmountNeeded: string;
  orderNotes: string;
}

export interface RestaurantSettings {
  name: string;
  slogan: string;
  phoneWhatsapp: string;
  address: string;
  hours: string;
  isOpen: boolean;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  currencySymbol: string;
  announcement: string;
}
