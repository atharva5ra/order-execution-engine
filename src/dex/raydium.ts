import { Dex } from "./dex.ts";

export const raydium: Dex = {
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
      dex: "Raydium",
      price: base * (0.995 + Math.random() * 0.01),
      fee: 0.003,
      latencyMs: 50,
      timestamp: now,
      ttlMs: 500
    };
  }
};
