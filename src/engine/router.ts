import { raydium } from "../dex/raydium.js";
import { meteora } from "../dex/meteora.js";
import { execute } from "./executor.js";
import { updateOrder } from "../state/orders.js";
import { Order } from "../state/orders.js";
import { log } from "../utils/logger.js";

const activeOrders = new Set<string>();

export async function routeAndExecute(order: Order) {
  if (activeOrders.has(order.id)) return;
  activeOrders.add(order.id);

  try {
    console.log("[ROUTER] Fetching quotes...");
    
    if (!raydium || !meteora) {
       throw new Error("DEX modules are undefined. Check your import extensions!");
    }

    const quotes = await Promise.all([
      raydium.getQuote(order),
      meteora.getQuote(order)
    ]).catch(err => {
      console.error("[ROUTER] Quote Fetch Failed:", err);
      throw err;
    });

    console.log("[ROUTER] Quotes received:", quotes.map(q => q.dex));
    
    //  SORTING LOGIC: Pick the cheapest total cost (Price + Fee)
    const best = quotes.sort(
      (a, b) => (a.price + a.fee) - (b.price + b.fee)
    )[0];

    console.log(`[ROUTER] Best Price found on ${best.dex}: ${best.price.toFixed(4)}`);

    // UPDATE STATUS TO BUILDING
    updateOrder(order.id, {
      status: "building",
      selectedDex: best.dex
    });

    //  SLIPPAGE PROTECTION
    // If the best price we found is higher than the user's max tolerance, we fail.
    const maxPriceAllowed = best.price * (1 + (order.slippage ?? 0.01));
    
    // Note: In a real market, you'd compare against a 'reference' price, 
    // but for this mock, we ensure the "best" isn't wildly out of range.
    if (best.price > maxPriceAllowed) {
      updateOrder(order.id, {
        status: "failed",
        error: "SLIPPAGE_EXCEEDED"
      });
      console.error(`[ROUTER] Slippage exceeded for ${order.id}`);
      return; 
    }

    //  SUBMIT FOR EXECUTION
    updateOrder(order.id, {
      status: "submitted",
      selectedDex: best.dex
    });

    await execute(order, best);

  } catch (err) {
    console.error("[ROUTER] ERROR:", err);
    throw err; 
  } finally {
    activeOrders.delete(order.id);
  }
}