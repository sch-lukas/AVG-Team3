export type OrderItem = { productId: string; quantity: number; price: number };
export type Address = { street: string; city: string; zipCode: string; country: string };
export type Customer = { customerId: string; prename: string; name: string };
export type Order = {
orderId: string;
customer: Customer;
items: OrderItem[];
totalAmount: number;
shippingAddress: Address;
};