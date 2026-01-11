import { Dex } from "./dex.ts";

export const meteora: Dex = {
  async getQuote(order) {
    await new Promise(r => setTimeout(r, 200 + Math.random() * 100));
    const now = Date.now();
    let base = 100;
    if (order.tokenIn === "SOL" && order.tokenOut === "USDC") {
      base = 100;
    } else if (order.tokenIn === "BTC" && order.tokenOut === "USDC") {
      base = 42000;
    }

    return {
      dex: "Meteora",
      price: base * (0.990 + Math.random() * 0.015),
      fee: 0.002,
      latencyMs: 70,
      timestamp: now,
      ttlMs: 500
    };
  }
};
