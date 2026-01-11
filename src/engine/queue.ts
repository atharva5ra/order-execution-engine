import { routeAndExecute } from "./router.ts"; // Added .js extension for NodeNext
import { updateOrder, Order } from "../state/orders.ts";

const queue: Order[] = [];
const MAX_CONCURRENT = 10;
let active = 0;

export function enqueueOrder(order: Order) {
  console.log(`[QUEUE] Adding order ${order.id}. Current queue size: ${queue.length + 1}`);
  queue.push(order);
  console.log("[QUEUE] Calling processQueue()");
  processQueue(); // Use a unique name
}

async function tryExecute(order: Order, attempt = 1): Promise<void> {
  try {
    await routeAndExecute(order);
  } catch (e) {
    if (attempt >= 3) {
      updateOrder(order.id, {
        status: "failed",
        error: String(e)
      });
      return;
    }
    const delay = Math.pow(2, attempt) * 500;
    await new Promise(r => setTimeout(r, delay));
    return tryExecute(order, attempt + 1);
  }
}

async function processQueue() {
  console.log("[QUEUE] processQueue() entered");

  if (queue.length === 0) {
    console.log("[QUEUE] empty queue");
    return;
  }

  if (active >= MAX_CONCURRENT) {
    console.log("[QUEUE] concurrency limit reached");
    return;
  }

  active++;

  const order = queue.shift()!;
  console.log("[QUEUE] Dequeued order", order.id);

  try {
    await tryExecute(order);
  } finally {
    active--;
    processQueue();
  }
}