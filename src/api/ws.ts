import { WebSocketServer, WebSocket } from "ws"; 
import { IncomingMessage } from "http";
import { subscribe, OrderUpdate } from "../state/orders.js";

let wss: WebSocketServer;

export function initWS(server: any) {
  wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req: IncomingMessage, socket: any, head: any) => {
    if (!req.url?.startsWith("/ws")) return;

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });

  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    const url = req.url || "";
    const query = url.split("?")[1];
    const params = new URLSearchParams(query);
    const orderId = params.get("orderId");

    const unsubscribe = subscribe((update: OrderUpdate) => {
      if (!orderId || update.orderId === orderId) {
        ws.send(JSON.stringify(update));
      }
    });

    ws.on("close", () => {
    });
  });
}