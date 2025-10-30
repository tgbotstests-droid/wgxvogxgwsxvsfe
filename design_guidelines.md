# Design Guidelines: Flash Loan Arbitrage Trading Bot Platform

## Design Approach

**Selected Framework:** Design System Approach with Professional Financial Trading Focus

**Primary Design References:**
- **Binance/Coinbase Pro**: Industry-standard crypto trading interfaces for trust and familiarity
- **TradingView**: Professional real-time data visualization and charting
- **Linear**: Clean, modern dashboard aesthetics with excellent hierarchy
- **Notion**: Organized data presentation and intuitive navigation

**Justification:** This utility-focused, data-intensive application demands clarity, real-time monitoring capabilities, and instant access to critical trading information. Users need to rapidly assess arbitrage opportunities, monitor bot performance, and manage financial risk with confidence.

## Typography System

**Font Stack:**
- **Primary (UI/Interface)**: Inter via Google Fonts CDN - `font-sans`
- **Monospace (Data/Numbers)**: JetBrains Mono via Google Fonts CDN - `font-mono`

**Hierarchy:**
- **H1 (Page Titles)**: `text-3xl font-bold` - Dashboard headers
- **H2 (Section Headers)**: `text-xl font-semibold` - Card titles, panel headers
- **H3 (Subsections)**: `text-lg font-medium` - Table headers, grouped labels
- **Body**: `text-base font-normal` - Descriptions, explanatory content
- **Data/Financial**: `text-sm font-mono` - Prices, percentages, addresses, transaction hashes
- **Labels/Badges**: `text-xs font-medium uppercase tracking-wide` - Status indicators, timestamps

## Layout Architecture

**Spacing Primitives:** Tailwind units of **2, 4, 6, 8**
- Card padding: `p-6`
- Component gaps: `gap-4`, `gap-6`
- Section spacing: `mb-6`, `mb-8`
- Grid gaps: `gap-4`

**Application Structure:**
- **Sidebar Navigation**: Fixed left sidebar (`w-64`) with collapsible menu, icon + label pattern
- **Main Content**: `max-w-7xl mx-auto` with responsive padding (`px-4 md:px-6 lg:px-8`)
- **Dashboard Grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` for metrics
- **Full-Width Data**: Tables and opportunity lists span full content width

## Core Components

### Dashboard Layout
**Hero Section - Bot Control Panel** (90vh):
- **Large Status Indicator**: Current bot state (Running/Stopped/Simulation) with pulsing animation
- **Quick Controls**: Start/Stop toggle, Emergency Stop button, Mode selector (Simulation/Real)
- **Critical Metrics Row**: 4-column grid showing Total Profit, Active Opportunities, Success Rate, Daily P/L
- **Real-Time Status Bar**: Last scan time, next scan countdown, gas price indicator, MATIC balance

**Arbitrage Opportunities Panel** (Primary Section):
- **Live Opportunity Cards**: Each showing token pair (e.g., MATIC/USDC), profit %, buy/sell DEX, estimated profit in USD
- **Action Buttons**: "Execute Trade" button on each card, disabled if balance/gas insufficient
- **Sort/Filter Controls**: By profit %, token pair, liquidity
- **Empty State**: Helpful message when no opportunities detected with scanner status

**Detailed Logging Panel**:
- **Real-Time Log Stream**: Reverse chronological with monospace font
- **Log Level Indicators**: Color-coded badges (ERROR-red, WARN-yellow, INFO-blue, SUCCESS-green)
- **Trade Process Stages**: Visual indicators for Detection → Validation → Preparation → Execution → Result
- **Error Details**: Expandable entries showing full error messages, stack traces, and recommended actions
- **Filter Controls**: Toggle between log levels, search functionality

**Activity Feed & System Status**:
- Recent transactions with status badges
- Network status indicators (Polygon mainnet connection, API health)
- Gas price trends mini-chart
- WebSocket connection status

### Metric Cards
- **Large Number Display**: `text-3xl font-bold font-mono` for primary value
- **Trend Indicator**: Arrow icon + percentage change with conditional styling
- **Sparkline Chart**: Embedded mini chart showing 24h trend
- **Label**: `text-sm text-muted-foreground` above value
- **Timestamp**: Last updated time below

### Trading Opportunity Cards
- **Header**: Token pair as prominent title (text-lg font-semibold)
- **Profit Highlight**: Large profit percentage with + prefix, vibrant styling
- **DEX Information**: Buy exchange → Sell exchange with arrow icon
- **Liquidity Check**: Badge indicating sufficient/insufficient liquidity
- **Action Button**: Primary button "Execute" or disabled state with reason
- **Metadata Row**: Estimated gas cost, expected profit in USD, timestamp

### Error & Log Components
**Error Detail Cards** (replacing error count chart):
- **Error Header**: Timestamp + error type badge + severity indicator
- **Description**: Plain language explanation of what went wrong
- **Technical Details**: Collapsible section with full error message, relevant parameters
- **Recommended Actions**: Bullet list of suggested fixes
- **Quick Links**: Jump to relevant settings if applicable

### Data Tables
- **Sticky Headers**: Fixed row on scroll with sort indicators
- **Alternating Rows**: Subtle striping for readability
- **Monospace Columns**: Right-aligned for numerical data (amounts, percentages)
- **Action Column**: Icon buttons for view details, re-execute, export
- **Pagination**: Bottom controls for large datasets
- **Loading Skeleton**: Shimmer effect during data fetch

### Forms & Settings
- **Grouped Sections**: Cards containing related settings
- **Label Pattern**: `text-sm font-medium mb-2` above each input
- **Input States**: Clear focus rings, validation indicators, helper text
- **Telegram Integration**: Chat ID input supporting negative values (groups), test connection button
- **Wallet Configuration**: Private key input (password field), Gnosis Safe address input, balance display
- **Risk Controls**: Sliders for max loan size, daily loss limits with current usage indicators

### Status Indicators
- **Bot Status Badge**: `rounded-full px-3 py-1` with pulsing dot for "Running"
- **Transaction Status**: Icon + label (Pending, Confirmed, Failed, Reverted)
- **Network Health**: Traffic light system (green/yellow/red) with tooltip explanations
- **Balance Warnings**: Alert badges when MATIC balance < minimum for operations

### Real-Time Updates
- **WebSocket Indicator**: Small pulsing green dot in header showing live connection
- **Auto-Refresh Timestamps**: "Updated X seconds ago" with countdown
- **Optimistic Updates**: Immediate UI feedback before server confirmation
- **Loading States**: Inline spinners, skeleton screens, progress indicators

## Page-Specific Designs

**Dashboard**: 
- Bot control panel at top
- Opportunities grid as primary content (70% of viewport)
- Split panel: Activity log (40%) + Error details (60%)

**Settings**: 
- Tabbed interface (General, Telegram, API Keys, Risk Management, Wallet)
- Each tab shows grouped cards with related settings
- Sticky save bar at bottom

**Transactions/History**:
- Full-width data table with comprehensive filtering
- Export functionality prominent
- Detail modal for expanded transaction view

**Documentation**:
- Two-column layout: Fixed navigation sidebar + scrollable content
- Code examples with syntax highlighting
- Step-by-step setup guides with screenshots

## Responsive Behavior
- **Desktop (lg:)**: Full multi-column with persistent sidebar
- **Tablet (md:)**: Collapsible sidebar, 2-col grids → single column
- **Mobile**: Hamburger menu, stacked cards, horizontal scroll tables

## Visual Hierarchy Priorities
1. **Critical**: Bot status, emergency controls (always visible)
2. **Primary**: Active opportunities, execute buttons
3. **Secondary**: Metrics, recent activity, error logs
4. **Tertiary**: Settings, documentation links

## Icons
Use **Lucide React** icons throughout (already in dependencies):
- Activity/status: `Activity`, `Zap`, `AlertCircle`
- Trading: `TrendingUp`, `TrendingDown`, `DollarSign`
- Actions: `Play`, `Pause`, `StopCircle`, `RefreshCw`