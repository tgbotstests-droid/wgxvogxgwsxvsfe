// Demo data seeder for testing
import { storage } from "./storage";

const DEMO_USER_ID = "demo-user-1";

export async function seedDemoData() {
  try {
    console.log("Seeding demo data...");

    // Create demo user
    await storage.upsertUser({
      id: DEMO_USER_ID,
      email: "demo@example.com",
      firstName: "Demo",
      lastName: "User",
    });

    // Update bot status with demo metrics
    await storage.updateBotStatus(DEMO_USER_ID, {
      totalProfitUsd: "1234.56",
      successRate: "87.5",
      activeOpportunities: 3,
      gasCostUsd: "45.23",
      net24hUsd: "156.78",
      insuranceFundUsd: "500.00",
    });

    // Create demo arbitrage transactions
    const demoTransactions = [
      {
        txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
        tokenIn: "USDC",
        tokenOut: "USDT",
        amountIn: "10000",
        amountOut: "10150",
        profitUsd: "150.00",
        gasCostUsd: "2.50",
        netProfitUsd: "147.50",
        status: "SUCCESS",
        dexPath: "QuickSwap → 1inch",
      },
      {
        txHash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
        tokenIn: "WMATIC",
        tokenOut: "USDC",
        amountIn: "5000",
        amountOut: "5075",
        profitUsd: "75.00",
        gasCostUsd: "1.80",
        netProfitUsd: "73.20",
        status: "SUCCESS",
        dexPath: "SushiSwap → QuickSwap",
      },
      {
        txHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
        tokenIn: "WETH",
        tokenOut: "USDC",
        amountIn: "2000",
        amountOut: "2040",
        profitUsd: "40.00",
        gasCostUsd: "3.20",
        netProfitUsd: "36.80",
        status: "SUCCESS",
        dexPath: "1inch → QuickSwap",
      },
      {
        txHash: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
        tokenIn: "DAI",
        tokenOut: "USDC",
        amountIn: "8000",
        amountOut: "7980",
        profitUsd: "0.00",
        gasCostUsd: "2.10",
        netProfitUsd: "-2.10",
        status: "FAILED",
        dexPath: "QuickSwap → 1inch",
      },
      {
        txHash: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
        tokenIn: "USDT",
        tokenOut: "WMATIC",
        amountIn: "12000",
        amountOut: "12180",
        profitUsd: "180.00",
        gasCostUsd: "2.80",
        netProfitUsd: "177.20",
        status: "SUCCESS",
        dexPath: "1inch → SushiSwap",
      },
      {
        txHash: "0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a",
        tokenIn: "WBTC",
        tokenOut: "USDC",
        amountIn: "1000",
        amountOut: "1015",
        profitUsd: "15.00",
        gasCostUsd: "4.50",
        netProfitUsd: "10.50",
        status: "SUCCESS",
        dexPath: "QuickSwap → 1inch",
      },
      {
        txHash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
        tokenIn: "LINK",
        tokenOut: "USDC",
        amountIn: "3000",
        amountOut: "3060",
        profitUsd: "60.00",
        gasCostUsd: "2.20",
        netProfitUsd: "57.80",
        status: "SUCCESS",
        dexPath: "SushiSwap → QuickSwap",
      },
      {
        txHash: "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c",
        tokenIn: "AAVE",
        tokenOut: "USDC",
        amountIn: "1500",
        amountOut: "1485",
        profitUsd: "0.00",
        gasCostUsd: "3.50",
        netProfitUsd: "-3.50",
        status: "FAILED",
        dexPath: "1inch → QuickSwap",
      },
      {
        txHash: "0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d",
        tokenIn: "UNI",
        tokenOut: "USDC",
        amountIn: "4000",
        amountOut: "4100",
        profitUsd: "100.00",
        gasCostUsd: "2.60",
        netProfitUsd: "97.40",
        status: "SUCCESS",
        dexPath: "QuickSwap → SushiSwap",
      },
      {
        txHash: "0x0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e",
        tokenIn: "CRV",
        tokenOut: "USDC",
        amountIn: "6000",
        amountOut: "6090",
        profitUsd: "90.00",
        gasCostUsd: "1.90",
        netProfitUsd: "88.10",
        status: "SUCCESS",
        dexPath: "1inch → QuickSwap",
      },
    ];

    for (const tx of demoTransactions) {
      await storage.createArbitrageTransaction(DEMO_USER_ID, tx);
    }

    console.log("✅ Demo data seeded successfully!");
  } catch (error) {
    console.error("Error seeding demo data:", error);
  }
}
