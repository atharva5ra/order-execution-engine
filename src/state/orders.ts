// 1️⃣ Define what an Order looks like
export type Order = {
  id: string;
  status: string;
  tokenIn: string;
  tokenOut: string;
  amount: number;
  slippage: number;
  dex?: string;
  price?: number;
  txHash?: string;
  error?: string;
  routingMs?: number;
  selectedDex?: string;
};

// 2️⃣ Define what we send over WebSocket
export type OrderUpdate = {
  orderId: string;
  status: string;
  data?: Partial<Order>;
};

//  In-memory store
export const orderStore = new Map<string, Order>();

// Typed subscribers
type Subscriber = (update: OrderUpdate) => void;
const listeners: Subscriber[] = [];

//  Subscribe function
export function subscribe(fn: Subscriber) {
  listeners.push(fn);
}

//  Notify function (used by engine)
export function notify(update: OrderUpdate) {
  listeners.forEach(fn => fn(update));
}

// Update order helper
export function updateOrder(id: string, patch: Partial<Order>) {
  const order = orderStore.get(id);
  if (!order) return;

  Object.assign(order, patch);

  notify({
    orderId: id,
    status: order.status,
    data: patch
  });
}
