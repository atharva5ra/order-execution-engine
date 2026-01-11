import { Router } from "express";
import { v4 as uuid } from "uuid";
import { enqueueOrder } from "../engine/queue.js"; // Add .js if using NodeNext
import { orderStore, updateOrder } from "../state/orders.js";

export const orderRouter = Router();

orderRouter.post("/", (req, res) => {
  const orderId = uuid();

  const order = {
    id: orderId,
    tokenIn: req.body.tokenIn,
    tokenOut: req.body.tokenOut,
    amount: req.body.amount,
    slippage: req.body.slippage ?? 0.01,  
    status: "pending"   
  };

  orderStore.set(orderId, order);

  updateOrder(orderId, {
    status: "pending"
  });
  
  // Log it so you see it in the terminal!
  console.log(` Order Created: ${orderId} (${order.tokenIn} -> ${order.tokenOut})`);

  // Move the call inside a try-catch to debug if it's still undefined
  try {
    if (typeof enqueueOrder !== 'function') {
        throw new Error("enqueueOrder is not loaded yet. Check for circular imports.");
    }
    enqueueOrder(order);
  } catch (error) {
    console.error("Critical Engine Error:", error);
    return res.status(500).json({ error: "Internal Engine Error" });
  }

  res.json({
    orderId,
    wsUrl: `ws://localhost:3000/ws?orderId=${orderId}`
  });
});