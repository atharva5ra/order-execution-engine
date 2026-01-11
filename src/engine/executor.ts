import { updateOrder } from "../state/orders.js";

function generateMockTxHash() {
  return "MOCK_" + Math.random().toString(36).slice(2);
}

export async function execute(order: any, route: any) {
  console.log(`[EXECUTOR] Starting swap on ${route.dex} for ${order.id}...`);
  
  // Simulate 2–3s blockchain settlement
  await new Promise(r => setTimeout(r, 2000 + Math.random() * 1000));

  const finalPrice = route.price * (0.999 + Math.random() * 0.002);
  const txHash = generateMockTxHash();

  console.log(`✅ [EXECUTOR] Confirmed! Hash: ${txHash}`);

  updateOrder(order.id, {
    status: "confirmed",
    txHash,
    price: finalPrice
  });
}
