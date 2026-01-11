// tests/test-engine.ts
async function fireOrders() {
    console.log("🚀 Starting Bulk Order Simulation (20 Orders)...");

    // Generate 20 orders programmatically
    for (let i = 1; i <= 20; i++) {
        // Shorter delay (200-500ms) to show high concurrency/queuing
        const interOrderDelay = 200 + Math.random() * 300; 
        await new Promise(r => setTimeout(r, interOrderDelay));
        
        const amount = Math.floor(Math.random() * 50) + 1; // Random amount 1-50
        
        console.log(`[TEST SCRIPT] Sending Order #${i} for ${amount} SOL...`);
        
        // Don't 'await' the fetch so that they all hit the server simultaneously!
        fetch("http://localhost:3000/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tokenIn: "SOL",
                tokenOut: "USDC",
                amount: amount,
                slippage: 0.05 // Reduced to 5% as requested
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(`✅ Order #${i} Received. ID: ${data.orderId}`);
        })
        .catch(() => {
            console.error(`❌ Order #${i} Failed to send.`);
        });
    }
}

fireOrders();