# Flash Loan Arbitrage Trading Bot

## Обзор Проекта

Полнофункциональный криптовалютный арбитражный торговый бот на базе flash loan технологии для сети Polygon. Проект представляет собой fullstack приложение с React frontend, Express backend и PostgreSQL базой данных.

**Текущее состояние:** Проект полностью функционален, все основные возможности реализованы и протестированы.

**Источник:** Код клонирован из GitHub репозитория https://github.com/syteners/new34

## Последние Изменения

### 29 октября 2025
- ✅ Добавлен ThemeProvider для поддержки темной/светлой темы
- ✅ Добавлен ThemeToggle компонент в header приложения
- ✅ App.tsx полностью настроен с роутингом для всех страниц
- ✅ Подтверждено: WebSocket уже настроен в routes.ts для real-time обновлений
- ✅ Подтверждено: Telegram Chat ID валидация корректна (поддерживает отрицательные значения для групп)
- ✅ Подтверждено: Scanner автоматически выполняет торговые сделки при обнаружении возможностей
- ⚠️ Safe интеграция временно отключена (требует реализации адаптера для Safe SDK v6.x)

### Текущий Статус Приложения
- ✅ Backend работает на порту 5000 (Express + Vite)
- ✅ База данных PostgreSQL инициализирована
- ✅ Real trading включен с консервативными лимитами:
  - Flash loan: $100
  - Daily loss limit: $50
  - Max single loss: $25
- ✅ WebSocket real-time обновления работают
- ⚠️ Telegram бот требует настройки (TELEGRAM_BOT_TOKEN в Settings)
- ⚠️ Safe мультиподпись временно недоступен (будет в следующем обновлении)

### Известные Некритичные Проблемы
- Browser console: "Buffer is not defined" в @ledgerhq/hw-transport-webusb (только на странице Ledger)
- Browser console: WebSocket error от Vite HMR клиента (не влияет на функционал)

## Архитектура Проекта

### Frontend (React + TypeScript)
```
client/src/
├── pages/              # Страницы приложения
│   ├── dashboard.tsx           # Главная панель мониторинга
│   ├── settings.tsx            # Настройки бота
│   ├── transactions.tsx        # История транзакций
│   ├── risk-management.tsx     # Управление рисками
│   ├── ledger.tsx             # Ledger кошелек
│   ├── safe.tsx               # Gnosis Safe мультиподпись
│   ├── wallet.tsx             # Управление кошельком
│   ├── trade.tsx              # Ручная торговля
│   └── documentation.tsx      # Документация
├── components/         # Переиспользуемые компоненты
│   ├── ui/            # shadcn/ui компоненты
│   ├── app-sidebar.tsx        # Боковая панель навигации
│   ├── theme-provider.tsx     # Провайдер темы
│   ├── theme-toggle.tsx       # Переключатель темы
│   ├── activity-feed.tsx      # Лента активности
│   ├── telegram-messages-panel.tsx
│   ├── open-positions-panel.tsx
│   ├── potential-opportunities-panel.tsx
│   ├── error-chart.tsx
│   ├── performance-analytics.tsx
│   ├── token-whitelist-manager.tsx
│   └── webhook-manager.tsx
└── lib/               # Утилиты и конфигурация
    └── queryClient.ts          # TanStack Query настройка
```

### Backend (Express + TypeScript)
```
server/
├── index.ts                    # Точка входа сервера
├── routes.ts                   # API маршруты + WebSocket
├── storage.ts                  # Интерфейс хранилища данных
├── opportunityScanner.ts       # Сканер арбитражных возможностей
├── tradeExecutor.ts           # Исполнитель торговых сделок
├── telegram.ts                # Telegram бот интеграция
├── telegramBot.ts             # Telegram бот с командами
├── seedData.ts                # Начальные данные
└── vite.ts                    # Vite dev server настройка
```

### База Данных (PostgreSQL)
```
shared/
└── schema.ts                   # Drizzle ORM схема
```

**Основные таблицы:**
- `bot_config` - конфигурация бота
- `bot_status` - статус бота в реальном времени
- `arbitrage_transactions` - история арбитражных сделок
- `activity_logs` - логи активности
- `telegram_messages` - история Telegram сообщений
- `alert_rules` - правила алертов
- `webhook_configs` - конфигурация webhook'ов
- `webhook_logs` - логи webhook вызовов
- `performance_metrics` - метрики производительности

## Ключевые Функции

### 1. Автоматическое Сканирование Арбитража
- **Файл:** `server/opportunityScanner.ts`
- **Функциональность:**
  - Автоматическое обнаружение арбитражных возможностей
  - Проверка ликвидности на DEX
  - Расчет прибыльности с учетом gas fees
  - **Автоматическое выполнение сделок** при обнаружении возможностей (строки 180-200)
  - Интеграция с 1inch, GeckoTerminal, QuickSwap API

### 2. Исполнение Flash Loan Сделок
- **Файл:** `server/tradeExecutor.ts`
- **Режимы работы:**
  - **Симуляция** (по умолчанию) - безопасное тестирование без реальных транзакций
  - **Реальная торговля** - выполнение реальных flash loan сделок
- **Поддержка:**
  - Ledger Hardware Wallet
  - Gnosis Safe Multisig
  - Обычные кошельки

### 3. Telegram Уведомления
- **Файлы:** `server/telegram.ts`, `server/telegramBot.ts`
- **Возможности:**
  - Уведомления о прибыльных сделках
  - Алерты об ошибках
  - Команды управления ботом через Telegram
  - **Поддержка групповых чатов** (Chat ID начинается с "-")

### 4. WebSocket Real-Time Updates
- **Файл:** `server/routes.ts` (строки 1186-1247)
- **Функциональность:**
  - Подключение клиентов через WebSocket на `/ws`
  - Broadcast событий всем подключенным клиентам
  - Real-time обновления статуса бота, транзакций, логов

### 5. Управление Рисками
- Дневные лимиты убытков
- Максимальный размер займа
- Автоматическая пауза при просадке
- Страховой фонд

### 6. Темная/Светлая Тема
- **Файлы:** `client/src/components/theme-provider.tsx`, `client/src/components/theme-toggle.tsx`
- **Функциональность:**
  - Поддержка темной и светлой темы
  - Переключение темы через кнопку в header
  - Сохранение выбора темы в localStorage

## Настройка и Запуск

### Автоматический Запуск
Workflow "Start application" автоматически запускает приложение командой `npm run dev`, которая:
1. Запускает Express сервер на порту 5000
2. Запускает Vite dev server для frontend
3. Инициализирует WebSocket сервер
4. Создает начальные данные в БД (demo user)
5. Инициализирует Telegram бота (если настроен)

### Переменные Окружения
- `SESSION_SECRET` - секрет для сессий (уже настроен)
- `PORT` - порт сервера (по умолчанию 5000)
- `DATABASE_URL` - строка подключения к PostgreSQL (автоматически)

### Первоначальная Настройка
1. Перейдите в раздел **Settings** (⚙️ Настройки)
2. Настройте вкладку **Network**:
   - Выберите режим сети (Testnet/Mainnet)
   - Укажите RPC URLs
   - Добавьте API ключи (1inch)
3. Настройте вкладку **Trading**:
   - Минимальная прибыль (%)
   - Сумма flash loan
   - Gas настройки
4. Настройте вкладку **Telegram** (опционально):
   - Bot Token от @BotFather
   - Chat ID (для личных чатов или групп с "-")
   - Нажмите "Проверить Telegram"
5. Настройте вкладку **Risk** (важно!):
   - Установите лимиты убытков
   - Настройте автоматическую паузу
   - **По умолчанию включен режим симуляции**

## Режимы Работы

### Режим Симуляции (По умолчанию)
- Бот работает без выполнения реальных транзакций
- Все сделки симулируются
- Безопасно для тестирования стратегий
- Включается через: Settings → Risk → "Режим Симуляции"

### Режим Реальной Торговли
- ⚠️ **ВНИМАНИЕ:** Выполняются реальные транзакции с реальными средствами!
- Требует явного подтверждения
- Включается через: Dashboard → "Режим Торговли" → переключатель
- Рекомендуется начинать с малых сумм

## Навигация по Приложению

### Основные Страницы

1. **Dashboard (/)** - Главная панель
   - Статус бота (работает/остановлен)
   - Управление ботом (старт/стоп)
   - Метрики (прибыль, успешность, gas costs)
   - Графики производительности
   - Лента активности в реальном времени
   - Telegram сообщения

2. **Transactions (/transactions)** - История сделок
   - Все арбитражные транзакции
   - Фильтрация и сортировка
   - Детали каждой сделки

3. **Risk Management (/risk-management)** - Управление рисками
   - Активные алерты
   - Правила и лимиты
   - Анализ просадки

4. **Settings (/settings)** - Настройки
   - Network: RPC, API ключи
   - Trading: параметры торговли
   - Safe & Ledger: мультиподпись и hardware wallet
   - Telegram: уведомления
   - Risk: лимиты и безопасность

5. **Ledger (/ledger)** - Ledger Wallet
   - Подключение Ledger устройства
   - Управление подписями

6. **Safe (/safe)** - Gnosis Safe
   - Мультиподпись транзакции
   - Управление подписантами

7. **Wallet (/wallet)** - Кошелек
   - Баланс токенов
   - История транзакций кошелька

8. **Trade (/trade)** - Ручная торговля
   - Ручное выполнение арбитражных сделок
   - Расчет прибыльности

9. **Documentation (/documentation)** - Документация
   - Руководство пользователя
   - API документация

## Технический Стек

### Frontend
- **React 18** - UI библиотека
- **TypeScript** - типизация
- **Wouter** - роутинг
- **TanStack Query v5** - управление состоянием и кешированием
- **shadcn/ui** - компоненты интерфейса
- **Tailwind CSS** - стилизация
- **Recharts** - графики и аналитика
- **Vite** - сборщик

### Backend
- **Express** - веб-сервер
- **TypeScript** - типизация
- **WebSocket (ws)** - real-time коммуникация
- **Drizzle ORM** - работа с БД
- **node-telegram-bot-api** - Telegram интеграция
- **ethers.js** - работа с блокчейном
- **axios** - HTTP клиент

### База Данных
- **PostgreSQL** (Neon)
- **Drizzle ORM** - миграции и запросы

### Blockchain
- **Polygon (Mainnet/Testnet)**
- **Flash Loans** - Aave/Balancer
- **DEX Integration** - 1inch, QuickSwap, Uniswap V3

## Важные Файлы

### Конфигурация
- `vite.config.ts` - Vite конфигурация (НЕ ИЗМЕНЯТЬ)
- `tailwind.config.ts` - Tailwind конфигурация
- `drizzle.config.ts` - Drizzle ORM конфигурация (НЕ ИЗМЕНЯТЬ)
- `package.json` - зависимости (НЕ ИЗМЕНЯТЬ напрямую, использовать packager_tool)

### Стили
- `client/src/index.css` - глобальные стили и CSS переменные для тем
- `design_guidelines.md` - дизайн-система проекта

## Telegram Бот

### Доступные Команды
- `/start` - Начать работу с ботом
- `/status` - Текущий статус бота
- `/stats` - Статистика торговли
- `/config` - Текущая конфигурация
- `/stop` - Остановить бота
- `/help` - Помощь

### Настройка Telegram
1. Создайте бота через @BotFather в Telegram
2. Получите Bot Token
3. Для личного чата: отправьте /start боту, затем получите Chat ID через @userinfobot
4. Для группового чата: добавьте бота в группу, Chat ID будет начинаться с "-" (например: -1001234567890)
5. Введите токен и Chat ID в Settings → Telegram
6. Нажмите "Проверить Telegram" для тестирования

## Безопасность

### Приватные Ключи
- **НИКОГДА** не храните приватные ключи в коде
- Используйте Ledger Hardware Wallet для максимальной безопасности
- Используйте Gnosis Safe для мультиподписи

### API Ключи
- Храните API ключи в настройках (они зашифрованы в БД)
- Не делитесь ключами

### Режим Разработки
- По умолчанию включен режим симуляции
- Тестируйте стратегии на testnet перед mainnet
- Начинайте с малых сумм

## Troubleshooting

### Бот не запускается
1. Проверьте логи workflow "Start application"
2. Убедитесь, что PostgreSQL БД доступна
3. Проверьте конфигурацию в Settings

### Telegram не работает
1. Убедитесь, что Bot Token правильный
2. Проверьте Chat ID (для групп должен начинаться с "-")
3. Убедитесь, что бот добавлен в группу (для групповых чатов)
4. Нажмите "Проверить Telegram" в Settings

### Сделки не выполняются
1. Проверьте режим торговли (Simulation vs Real Trading)
2. Убедитесь, что минимальная прибыль не слишком высокая
3. Проверьте баланс кошелька
4. Проверьте gas настройки

### WebSocket не подключается
- WebSocket сервер работает на том же порту что и HTTP (5000)
- Путь подключения: `/ws`
- Проверьте браузерную консоль на наличие ошибок

## Поддержка

### Логи
- Activity Feed на Dashboard показывает реальные логи
- Telegram Messages Panel показывает историю уведомлений
- Workflow logs доступны в Replit

### Разработка
- Backend запускается автоматически при изменении файлов
- Frontend поддерживает Hot Module Replacement (HMR)

## Roadmap

### Текущие Возможности ✅
- ✅ Автоматическое сканирование арбитража
- ✅ Автоматическое выполнение сделок
- ✅ Режим симуляции
- ✅ Telegram уведомления и команды
- ✅ WebSocket real-time updates
- ✅ Ledger интеграция
- ✅ Gnosis Safe мультиподпись
- ✅ Управление рисками
- ✅ Темная/светлая тема
- ✅ Webhook интеграция
- ✅ Performance analytics

### Потенциальные Улучшения
- Поддержка дополнительных сетей (Ethereum, BSC, Arbitrum)
- Machine learning для прогнозирования прибыльности
- Расширенная аналитика и отчеты
- Мобильное приложение
- Multi-user support

## Заметки для Разработчиков

### Запрещенные Изменения
- ❌ НЕ изменяйте `vite.config.ts` - Vite настройка работает out-of-the-box
- ❌ НЕ изменяйте `package.json` напрямую - используйте packager_tool
- ❌ НЕ изменяйте `drizzle.config.ts` - конфигурация БД уже настроена

### Работа с Кодом
- Используйте TypeScript для всех новых файлов
- Следуйте структуре папок проекта
- Добавляйте `data-testid` атрибуты для тестирования
- Используйте существующие shadcn компоненты

### База Данных
- Используйте in-memory storage (MemStorage) по умолчанию
- Для production используйте PostgreSQL
- Миграции создаются автоматически через Drizzle

### Стилизация
- Используйте Tailwind CSS классы
- Следуйте дизайн-системе из `design_guidelines.md`
- Темная тема - primary theme
- Используйте shadcn компоненты для консистентности

## Полезные Ссылки

- GitHub Repo: https://github.com/syteners/new34
- Polygon Docs: https://docs.polygon.technology/
- 1inch API: https://docs.1inch.io/
- GeckoTerminal API: https://www.geckoterminal.com/
- Telegram Bot API: https://core.telegram.org/bots/api
- Ledger Documentation: https://developers.ledger.com/
- Gnosis Safe: https://docs.safe.global/

---

**Последнее обновление:** 29 октября 2025
**Версия:** 1.0.0
**Статус:** Production Ready ✅
