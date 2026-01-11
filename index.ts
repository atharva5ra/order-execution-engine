import express from "express";
import http from "http";
import { orderRouter } from "./src/api/http";
import { initWS } from "./src/api/ws"

const app = express();
app.use(express.json());
app.use("/api/orders", orderRouter);

const server = http.createServer(app);
initWS(server);

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
