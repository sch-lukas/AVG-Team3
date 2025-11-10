export type OrderItem = { productId: string; quantity: number; price: number };
export type Address = { street: string; city: string; zipCode: string; country: string };
export type Customer = { customerId: string; prename: string; name: string };

export type Order = {
  orderId: string;
  customer: Customer;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: Address;
};

// Inventory Antwort: Liste pro Artikel
export type InventoryAvailability = {
  productId: string;
  requested: number;
  available: number;
  isAvailable: boolean;
  statusMessage: string;
};

// Payment Antwort
export type PaymentResponse = {
  orderId: string;
  paymentStatus: string; // "approved" | "declined"
};
