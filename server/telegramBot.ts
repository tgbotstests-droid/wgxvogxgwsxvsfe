// Telegram Bot with Command Handlers
import TelegramBot, { Message } from "node-telegram-bot-api";
import { storage } from "./storage";

// Default admin user ID - can access bot from any chat
const DEFAULT_ADMIN_ID = "861887555";

let botInstance: TelegramBot | null = null;
let botConfig: { token: string; chatId: string } | null = null;

export async function initializeTelegramBotWithCommands(userId: string) {
  try {
    const config = await storage.getBotConfig(userId);
    
    if (!config?.telegramBotToken || !config?.telegramChatId) {
      console.log("⚠️ Telegram bot не настроен - пропускаю инициализацию команд");
      return null;
    }

    // Store config for validation
    botConfig = {
      token: config.telegramBotToken,
      chatId: config.telegramChatId,
    };

    // Stop existing bot if any
    if (botInstance) {
      await botInstance.stopPolling();
      botInstance = null;
    }

    // Create new bot instance with polling
    botInstance = new TelegramBot(config.telegramBotToken, { 
      polling: {
        interval: 1000,
        autoStart: true,
      }
    });

    // Register command handlers
    registerCommandHandlers(botInstance, userId, config.telegramChatId);
    
    console.log("✅ Telegram бот с командами успешно инициализирован");
    return botInstance;
  } catch (error) {
    console.error("❌ Ошибка инициализации Telegram бота:", error);
    return null;
  }
}

function registerCommandHandlers(
  bot: TelegramBot, 
  userId: string, 
  authorizedChatId: string
) {
  // Middleware to check if message is from authorized chat or default admin
  const isAuthorized = (msg: Message): boolean => {
    // Allow default admin from any chat
    if (msg.from && msg.from.id.toString() === DEFAULT_ADMIN_ID) {
      console.log(`✅ Авторизован default admin: ${DEFAULT_ADMIN_ID}`);
      return true;
    }
    
    // Support negative Chat IDs for group chats
    const chatId = msg.chat.id.toString();
    const isMatch = chatId === authorizedChatId || chatId === authorizedChatId.replace('-', '');
    
    if (isMatch) {
      console.log(`✅ Авторизован через Chat ID: ${chatId}`);
    } else {
      console.log(`⛔ Неавторизованный доступ: Chat ID ${chatId}, From ID ${msg.from?.id}`);
    }
    
    return isMatch;
  };

  // /start command
  bot.onText(/\/start/, async (msg) => {
    if (!isAuthorized(msg)) {
      await bot.sendMessage(msg.chat.id, "⛔ Доступ запрещен. Этот бот настроен для другого пользователя.");
      return;
    }

    const welcomeMessage = 
      `🤖 <b>Flash Loan Arbitrage Bot</b>\n\n` +
      `Добро пожаловать! Я помогу вам управлять арбитражным ботом.\n\n` +
      `<b>Доступные команды:</b>\n` +
      `/status - Текущий статус бота\n` +
      `/stats - Статистика и метрики\n` +
      `/config - Показать конфигурацию\n` +
      `/stop - Остановить бота\n` +
      `/help - Помощь и документация\n\n` +
      `Используйте эти команды для управления ботом в режиме реального времени! 📊`;

    await bot.sendMessage(msg.chat.id, welcomeMessage, { parse_mode: "HTML" });
  });

  // /status command
  bot.onText(/\/status/, async (msg) => {
    if (!isAuthorized(msg)) {
      await bot.sendMessage(msg.chat.id, "⛔ Доступ запрещен.");
      return;
    }

    try {
      const status = await storage.getBotStatus(userId);
      const config = await storage.getBotConfig(userId);

      if (!status) {
        await bot.sendMessage(msg.chat.id, "❌ Не удалось получить статус бота");
        return;
      }

      const statusEmoji = status.isRunning ? "🟢" : "🔴";
      const statusText = status.isRunning ? "Работает" : "Остановлен";
      const pausedInfo = status.isPaused ? `\n⏸️ <b>На паузе:</b> ${status.pauseReason || "Неизвестная причина"}` : "";

      const message = 
        `${statusEmoji} <b>Статус бота: ${statusText}</b>\n` +
        `${pausedInfo}\n\n` +
        `<b>Режим:</b> ${config?.networkMode === 'mainnet' ? '🔴 Mainnet' : '🟡 Testnet'}\n` +
        `<b>Активные возможности:</b> ${status.activeOpportunities || 0}\n` +
        `<b>Последний запуск:</b> ${status.lastStartedAt ? new Date(status.lastStartedAt).toLocaleString('ru-RU') : 'Никогда'}\n` +
        `<b>Последняя остановка:</b> ${status.lastStoppedAt ? new Date(status.lastStoppedAt).toLocaleString('ru-RU') : 'Никогда'}`;

      await bot.sendMessage(msg.chat.id, message, { parse_mode: "HTML" });
    } catch (error) {
      console.error("Error in /status command:", error);
      await bot.sendMessage(msg.chat.id, "❌ Ошибка получения статуса");
    }
  });

  // /stats command
  bot.onText(/\/stats/, async (msg) => {
    if (!isAuthorized(msg)) {
      await bot.sendMessage(msg.chat.id, "⛔ Доступ запрещен.");
      return;
    }

    try {
      const status = await storage.getBotStatus(userId);
      const transactions = await storage.getArbitrageTransactions(userId, 100);

      if (!status) {
        await bot.sendMessage(msg.chat.id, "❌ Не удалось получить статистику");
        return;
      }

      const successCount = transactions.filter(t => t.status === 'SUCCESS').length;
      const failedCount = transactions.filter(t => t.status === 'FAILED').length;
      const totalCount = transactions.length;

      const message = 
        `📊 <b>Статистика торговли</b>\n\n` +
        `💰 <b>Общая прибыль:</b> $${Number(status.totalProfitUsd || 0).toFixed(2)}\n` +
        `📈 <b>Прибыль за 24ч:</b> $${Number(status.net24hUsd || 0).toFixed(2)}\n` +
        `⛽ <b>Затраты на gas:</b> $${Number(status.gasCostUsd || 0).toFixed(2)}\n` +
        `🛡️ <b>Страховой фонд:</b> $${Number(status.insuranceFundUsd || 0).toFixed(2)}\n\n` +
        `<b>Транзакции:</b>\n` +
        `✅ Успешных: ${successCount} (${totalCount > 0 ? ((successCount / totalCount) * 100).toFixed(1) : 0}%)\n` +
        `❌ Неудачных: ${failedCount}\n` +
        `📝 Всего: ${totalCount}\n` +
        `🎯 <b>Success Rate:</b> ${Number(status.successRate || 0).toFixed(1)}%`;

      await bot.sendMessage(msg.chat.id, message, { parse_mode: "HTML" });
    } catch (error) {
      console.error("Error in /stats command:", error);
      await bot.sendMessage(msg.chat.id, "❌ Ошибка получения статистики");
    }
  });

  // /config command
  bot.onText(/\/config/, async (msg) => {
    if (!isAuthorized(msg)) {
      await bot.sendMessage(msg.chat.id, "⛔ Доступ запрещен.");
      return;
    }

    try {
      const config = await storage.getBotConfig(userId);

      if (!config) {
        await bot.sendMessage(msg.chat.id, "❌ Конфигурация не найдена");
        return;
      }

      const message = 
        `⚙️ <b>Конфигурация бота</b>\n\n` +
        `<b>Сеть:</b> ${config.networkMode === 'mainnet' ? '🔴 Mainnet (Polygon)' : '🟡 Testnet (Amoy)'}\n` +
        `<b>RPC:</b> ${config.networkMode === 'mainnet' ? config.polygonRpcUrl : config.polygonTestnetRpcUrl}\n\n` +
        `<b>Параметры торговли:</b>\n` +
        `• Min profit: ${config.minProfitPercent}%\n` +
        `• Min net profit: ${config.minNetProfitPercent}%\n` +
        `• Flash loan amount: $${config.flashLoanAmount}\n` +
        `• Scan interval: ${config.scanInterval}s\n\n` +
        `<b>Лимиты безопасности:</b>\n` +
        `• Max loan: $${config.maxLoanUsd}\n` +
        `• Daily loss limit: $${config.dailyLossLimit}\n` +
        `• Max single loss: $${config.maxSingleLossUsd}\n` +
        `• Insurance fund: ${config.insuranceFundPercent}%\n\n` +
        `<b>Gas настройки:</b>\n` +
        `• Max gas price: ${config.maxGasPriceGwei} Gwei\n` +
        `• Priority fee: ${config.priorityFeeGwei} Gwei\n` +
        `• Min net profit: $${config.minNetProfitUsd}\n\n` +
        `<b>Режимы:</b>\n` +
        `• Real trading: ${config.enableRealTrading ? '✅ Включен' : '❌ Выключен'}\n` +
        `• Simulation: ${config.useSimulation ? '✅ Включен' : '❌ Выключен'}\n` +
        `• Auto pause: ${config.autoPauseEnabled ? '✅ Включен' : '❌ Выключен'}`;

      await bot.sendMessage(msg.chat.id, message, { parse_mode: "HTML" });
    } catch (error) {
      console.error("Error in /config command:", error);
      await bot.sendMessage(msg.chat.id, "❌ Ошибка получения конфигурации");
    }
  });

  // /stop command
  bot.onText(/\/stop/, async (msg) => {
    if (!isAuthorized(msg)) {
      await bot.sendMessage(msg.chat.id, "⛔ Доступ запрещен.");
      return;
    }

    try {
      const status = await storage.updateBotStatus(userId, {
        isRunning: false,
        lastStoppedAt: new Date(),
      });

      await bot.sendMessage(
        msg.chat.id, 
        `⏹️ <b>Бот остановлен</b>\n\nВсе активные операции завершены.`,
        { parse_mode: "HTML" }
      );
    } catch (error) {
      console.error("Error in /stop command:", error);
      await bot.sendMessage(msg.chat.id, "❌ Ошибка остановки бота");
    }
  });

  // /help command
  bot.onText(/\/help/, async (msg) => {
    if (!isAuthorized(msg)) {
      await bot.sendMessage(msg.chat.id, "⛔ Доступ запрещен.");
      return;
    }

    const helpMessage = 
      `📚 <b>Справка по командам</b>\n\n` +
      `<b>/start</b> - Приветственное сообщение и список команд\n` +
      `Покажет основную информацию о боте и доступные команды\n\n` +
      `<b>/status</b> - Текущий статус бота\n` +
      `Показывает: работает ли бот, режим сети, активные возможности\n\n` +
      `<b>/stats</b> - Статистика торговли\n` +
      `Показывает: прибыль, затраты на gas, количество сделок, success rate\n\n` +
      `<b>/config</b> - Конфигурация\n` +
      `Показывает: параметры торговли, лимиты безопасности, настройки gas\n\n` +
      `<b>/stop</b> - Остановить бота\n` +
      `Останавливает все активные операции (можно запустить через веб-интерфейс)\n\n` +
      `<b>/help</b> - Эта справка\n\n` +
      `💡 <b>Совет:</b> Используйте веб-интерфейс для детальной настройки и запуска бота.\n` +
      `Telegram команды предназначены для быстрого мониторинга!`;

    await bot.sendMessage(msg.chat.id, helpMessage, { parse_mode: "HTML" });
  });

  // Handle unknown commands
  bot.on('message', async (msg) => {
    // Ignore non-text messages
    if (!msg.text) return;
    
    // Ignore known commands (already handled)
    if (msg.text.startsWith('/start') || 
        msg.text.startsWith('/status') || 
        msg.text.startsWith('/stats') ||
        msg.text.startsWith('/config') ||
        msg.text.startsWith('/stop') ||
        msg.text.startsWith('/help')) {
      return;
    }

    // Check if it's a command
    if (msg.text.startsWith('/')) {
      if (!isAuthorized(msg)) {
        await bot.sendMessage(msg.chat.id, "⛔ Доступ запрещен.");
        return;
      }

      await bot.sendMessage(
        msg.chat.id,
        `❓ Неизвестная команда: ${msg.text}\n\nИспользуйте /help для списка доступных команд.`
      );
    }
  });

  console.log("✅ Обработчики команд Telegram зарегистрированы");
}

export async function stopTelegramBot() {
  if (botInstance) {
    try {
      await botInstance.stopPolling();
      botInstance = null;
      botConfig = null;
      console.log("✅ Telegram бот остановлен");
    } catch (error) {
      console.error("❌ Ошибка остановки Telegram бота:", error);
    }
  }
}

export function getTelegramBotInstance() {
  return botInstance;
}
