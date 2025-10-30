import TelegramBot from "node-telegram-bot-api";
import { storage } from "./storage";

let botInstance: TelegramBot | null = null;

export async function initializeTelegramBot(userId: string) {
  try {
    const config = await storage.getBotConfig(userId);
    
    if (!config?.telegramBotToken || !config?.telegramChatId) {
      console.log("Telegram bot not configured - skipping initialization");
      return null;
    }

    // Stop existing bot if any
    if (botInstance) {
      await botInstance.stopPolling();
      botInstance = null;
    }

    // Create new bot instance
    botInstance = new TelegramBot(config.telegramBotToken, { polling: false });
    
    console.log("Telegram bot initialized successfully");
    return botInstance;
  } catch (error) {
    console.error("Error initializing Telegram bot:", error);
    return null;
  }
}

export async function sendTelegramMessage(
  userId: string, 
  message: string, 
  messageType: string = "notification",
  metadata?: any
) {
  try {
    const config = await storage.getBotConfig(userId);
    
    if (!config?.telegramBotToken || !config?.telegramChatId) {
      console.log("Telegram not configured");
      
      // Log failed attempt
      await storage.createTelegramMessage(userId, {
        message,
        messageType,
        success: false,
        error: "Telegram not configured",
        metadata,
      });
      
      return { success: false, error: "Telegram not configured" };
    }

    const bot = new TelegramBot(config.telegramBotToken, { polling: false });
    
    // Parse Chat ID (support negative values for groups)
    const chatIdStr = config.telegramChatId.toString();
    let chatIdToUse: string | number = config.telegramChatId;
    
    if (typeof chatIdStr === 'string') {
      chatIdToUse = chatIdStr.startsWith('-') ? parseInt(chatIdStr, 10) : chatIdStr;
    }
    
    await bot.sendMessage(chatIdToUse, message, { parse_mode: "HTML" });
    
    console.log("Telegram message sent successfully");
    
    // Log successful message
    await storage.createTelegramMessage(userId, {
      message,
      messageType,
      success: true,
      metadata,
    });
    
    return { success: true };
  } catch (error: any) {
    console.error("Error sending Telegram message:", error);
    
    // Log failed message
    await storage.createTelegramMessage(userId, {
      message,
      messageType,
      success: false,
      error: error.message,
      metadata,
    });
    
    return { success: false, error: error.message };
  }
}

export async function testTelegramConnection(userId: string) {
  try {
    const config = await storage.getBotConfig(userId);
    
    if (!config?.telegramBotToken || !config?.telegramChatId) {
      return { 
        success: false, 
        error: "Пожалуйста, укажите Bot Token и Chat ID в настройках" 
      };
    }

    const bot = new TelegramBot(config.telegramBotToken, { polling: false });
    
    // Test bot connection
    const me = await bot.getMe();
    
    // Parse Chat ID (support negative values for groups)
    // Negative Chat IDs start with "-" and are normal for group chats
    const chatIdStr = config.telegramChatId.toString();
    let chatIdToUse: string | number = config.telegramChatId;
    
    // Convert string Chat ID to number (handles negative IDs for groups)
    if (typeof chatIdStr === 'string') {
      chatIdToUse = chatIdStr.startsWith('-') ? parseInt(chatIdStr, 10) : chatIdStr;
    }
    
    console.log(`Testing Telegram connection to Chat ID: ${chatIdToUse} (original: ${config.telegramChatId})`);
    
    // Send test message with commands
    await bot.sendMessage(
      chatIdToUse,
      `✅ <b>Telegram бот подключен успешно!</b>\n\n` +
      `🤖 Бот: @${me.username}\n` +
      `📱 Chat ID: ${chatIdToUse}\n` +
      `💬 Тип: ${chatIdStr.toString().startsWith('-') ? 'Группа/Канал' : 'Личный чат'}\n\n` +
      `Уведомления настроены и работают.\n\n` +
      `<b>Доступные команды:</b>\n` +
      `/start - Начать работу\n` +
      `/status - Статус бота\n` +
      `/stats - Статистика\n` +
      `/config - Конфигурация\n` +
      `/stop - Остановить бота\n` +
      `/help - Помощь`,
      { parse_mode: "HTML" }
    );
    
    return { 
      success: true, 
      botUsername: me.username,
      chatId: config.telegramChatId 
    };
  } catch (error: any) {
    console.error("Telegram connection test failed:", error);
    
    let errorMessage = "Не удалось подключиться к Telegram";
    if (error.message.includes("401")) {
      errorMessage = "Неверный Bot Token. Проверьте токен в @BotFather";
    } else if (error.message.includes("400") || error.message.includes("chat not found")) {
      errorMessage = "Неверный Chat ID. Отправьте /start боту и получите Chat ID через @userinfobot";
    }
    
    return { success: false, error: errorMessage };
  }
}

export function getTelegramBot() {
  return botInstance;
}
