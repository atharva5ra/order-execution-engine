README – Order Execution Engine (Mock DEX Routing)



**Project Overview**



This project implements a backend order execution engine that processes Market Orders with automatic DEX routing and real-time WebSocket updates. The engine compares prices from Raydium and Meteora, selects the best execution venue, and simulates transaction settlement with realistic delays.



The focus of this implementation is on architecture, concurrency handling, routing logic, and live order lifecycle streaming rather than real blockchain execution.



**Chosen Order Type: Market Order**



I chose Market Orders because they are the simplest and most realistic way to demonstrate best-price routing, asynchronous execution, and real-time updates. Market orders execute immediately at the best available price, which makes them ideal for showing DEX comparison and execution flow.



Extending to other order types:



Limit Orders can be added by storing orders and executing them only when the market price reaches the target price.



Sniper Orders can be implemented by listening to on-chain events such as token launches or liquidity pool creation and triggering execution automatically.



The routing, queue, and execution layers would remain unchanged.



**High-Level Architecture**



Client submits order using HTTP POST

Order is stored in memory and queued

Queue controls concurrency (maximum 10 active orders)

Router fetches quotes from Raydium and Meteora

Best DEX is selected based on price plus fees

Executor simulates transaction settlement

Order updates are streamed to clients via WebSocket



**Order Execution Flow**



*Order Submission*

The client sends a POST request to /api/orders with token pair, amount, and slippage.

The API immediately returns an orderId and does not block on execution.



*Pending State*

As soon as the order is created, its status is set to "pending" and broadcast over WebSocket.



*Routing*

The router fetches quotes from both Raydium and Meteora in parallel and compares them to find the best execution price.



*Building*

Once the best DEX is selected, the system simulates transaction construction.



*Submitted*

The order is submitted to the executor for simulated settlement.



*Confirmed or Failed*

After a 2–3 second delay, the order is either confirmed with a mock transaction hash or marked as failed with an error reason.



**WebSocket Updates**



Clients connect to

ws://localhost:3000/ws?orderId=ORDER\_ID



Each client receives real-time updates for the order lifecycle:

pending

routing

building

submitted

confirmed (includes txHash and final price)

failed (includes error reason)



This allows the frontend or testing scripts to track progress without polling.



**DEX Routing Logic**



For each order:



Quotes are fetched from Raydium and Meteora



Each quote includes price, fee, timestamp, and validity window



The router selects the DEX with the lowest total cost (price + fee)



The selected DEX is logged for transparency



This ensures best execution for every market order.



Queue and Concurrency Management



The system uses a concurrency-limited queue:



Maximum 10 orders can execute at the same time



Additional orders wait in the queue



Orders are processed asynchronously



Each order has up to 3 retry attempts with exponential backoff



After 3 failures, the order is marked as failed and the reason is stored



This prevents system overload and simulates production-grade execution control.



Mock Execution



This project uses a mock execution engine:



Quote fetching delay: ~200–300 ms



Execution delay: ~2–3 seconds



Price variance between DEXs: ~2–5 percent



Mock transaction hash generated on success



This allows focus on architecture without relying on Solana devnet stability.



**Testing and Results Explanation**



A test script fires 20 orders almost simultaneously.



Observed behavior:



Orders are accepted immediately without blocking



Queue manages concurrency correctly



Routing decisions vary per order based on price



Orders complete out of submission order due to asynchronous execution



All orders eventually reach a terminal state



This proves:



*True concurrency*



*Non-blocking order intake*



*Correct routing logic*



*Reliable queue processing*



**Why the Console Output Looks Interleaved**



The interleaved logs are expected and correct.



Multiple orders are being:



Routed at the same time



Executed at the same time



Confirmed independently



This demonstrates that the engine is asynchronous and not processing orders sequentially.



**Tech Stack**



Node.js

TypeScript (NodeNext module system)

Express

WebSocket (ws library)



The design is modular and can be easily extended to Redis, PostgreSQL, and real Solana execution.



**How to Run**



Install dependencies

npm install



Start the server

npm run dev



Run the test script

tsx tests/test-engine.ts



Server runs on port 3000.



**Final Notes**



This project demonstrates a production-style order execution engine with:



Clean separation of concerns



Deterministic routing logic



Real-time order updates



Concurrency-safe execution



The architecture is designed to scale and to support real blockchain execution with minimal changes.

