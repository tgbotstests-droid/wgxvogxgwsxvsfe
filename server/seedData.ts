// Initialize database with demo user and real trading configuration
import { storage } from "./storage";

export async function seedInitialData() {
  try {
    console.log("🌱 Seeding initial data...");

    // Create demo user
    const user = await storage.upsertUser({
      id: "demo-user-1",
      email: "demo@arbitrage.bot",
      firstName: "Demo",
      lastName: "User",
    });
    console.log(`✅ User created: ${user.email}`);

    // Get environment variables
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN || "";
    const telegramChatId = process.env.TELEGRAM_CHAT_ID || "";
    const polygonRpcUrl = process.env.POLYGON_RPC_URL || "";
    const oneInchApiKey = process.env.ONEINCH_API_KEY || "";
    const insuranceWalletAddress = process.env.INSURANCE_WALLET_ADDRESS || "";

    // Create bot configuration with REAL TRADING enabled
    const config = await storage.upsertBotConfig(user.id, {
      // REAL TRADING MODE
      enableRealTrading: true,
      useSimulation: false,
      networkMode: "mainnet",

      // API Keys and connections
      polygonRpcUrl,
      telegramBotToken,
      telegramChatId,
      oneInchApiKey,
      insuranceWalletAddress,

      // Conservative trading parameters for safety
      minProfitPercent: 0.5,      // Require 0.5% minimum profit
      minNetProfitPercent: 0.3,   // Require 0.3% net profit after fees
      flashLoanAmount: 100,        // Start with small $100 flash loans
      
      // Risk management - VERY CONSERVATIVE LIMITS
      dailyLossLimit: 50,          // Max $50 daily loss (SAFETY)
      maxSingleLossUsd: 25,        // Max $25 single transaction loss (SAFETY)
      maxLoanUsd: 500,             // Max $500 loan size (SAFETY)
      
      // Gas settings
      maxGasPriceGwei: 100,        // Max 100 gwei gas price
      priorityFeeGwei: 30,         // 30 gwei priority fee
      
      // Other settings
      scanInterval: 10000,         // Scan every 10 seconds
      autoPauseEnabled: true,      // Enable auto-pause on losses
      emergencyPauseDrawdownPercent: 10, // Pause on 10% drawdown
      
      // Telegram notifications
      telegramProfitThresholdUsd: 1, // Notify on $1+ profit
      telegramFailedTxSummaryIntervalMinutes: 60,
      
      // Ledger settings (disabled by default)
      ledgerEnabled: false,
      ledgerTelegramFallback: true,
      
      // Safe multisig (disabled if not configured)
      gnosisSafeAddress: "",
      safeAutoSignEnabled: false,
    });

    console.log(`✅ Bot config created with REAL TRADING mode`);
    console.log(`   - Network: ${config.networkMode}`);
    console.log(`   - Real Trading: ${config.enableRealTrading}`);
    console.log(`   - Simulation: ${config.useSimulation}`);
    console.log(`   - Daily Loss Limit: $${config.dailyLossLimit}`);
    console.log(`   - Max Single Loss: $${config.maxSingleLossUsd}`);

    // Initialize bot status
    const status = await storage.updateBotStatus(user.id, {
      isRunning: false,
      isPaused: false,
      totalProfitUsd: 0,
      net24hUsd: 0,
      gasCostUsd: 0,
      insuranceFundUsd: 0,
      activeOpportunities: 0,
      successRate: 0,
    });
    console.log(`✅ Bot status initialized`);

    // Initialize risk limits tracking
    const riskTracking = await storage.updateRiskLimitsTracking(user.id, {
      dailyLossUsd: 0,
      consecutiveLosses: 0,
      lastResetDate: new Date(),
    });
    console.log(`✅ Risk tracking initialized`);

    console.log("\n🎉 Initial data seeded successfully!");
    console.log(`\n⚠️  IMPORTANT: Real trading is ENABLED with conservative limits:`);
    console.log(`   - Flash loan: $${config.flashLoanAmount}`);
    console.log(`   - Daily loss limit: $${config.dailyLossLimit}`);
    console.log(`   - Max single loss: $${config.maxSingleLossUsd}`);
    console.log(`   - Max loan size: $${config.maxLoanUsd}`);
    console.log(`\n   Monitor carefully and adjust limits as needed!\n`);

  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  }
}

// Export for direct execution
export default seedInitialData;
