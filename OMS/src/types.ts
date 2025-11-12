// Ein Orderitem von einer Order
export type OrderItem = { productId: string; quantity: number; price: number };
// Typ der Adresse
export type Address = { street: string; city: string; zipCode: string; country: string };
// Typ eines Kunden
export type Customer = { customerId: string; prename: string; name: string };
// Typ der Order
export type Order = {
  orderId: string;
  customer: Customer;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: string;
};
// Typ der Antwort von Payment Service auf Anfrage 
export type PaymentResponse = {
  orderId: string;
  paymentStatus: "approved" | "declined";
};
