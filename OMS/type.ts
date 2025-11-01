export type OrderItem = { productId: string; quantity: number; price: number };

export type Order = {
  orderId: string;
  customer: { customerId: string; prename: string; name: string };
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: { street: string; city: string; zipCode: string; country: string };
};
