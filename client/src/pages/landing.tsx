import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Shield, Zap, TrendingUp, Lock, Code } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16 space-y-6">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <Activity className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-tight">
            Flash Loan Arbitrage Bot
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Профессиональная панель управления арбитражным ботом с поддержкой Ledger Hardware Wallet и Gnosis Safe Multisig
          </p>
          <div className="pt-4">
            <Button
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              data-testid="button-login"
            >
              <Lock className="mr-2 h-5 w-5" />
              Войти в Панель
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Быстрые Арбитражи</CardTitle>
              <CardDescription>
                Автоматический поиск и выполнение арбитражных возможностей на Polygon
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Безопасность</CardTitle>
              <CardDescription>
                Ledger Hardware Wallet и Gnosis Safe для максимальной защиты средств
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Аналитика</CardTitle>
              <CardDescription>
                Детальные метрики, графики доходности и история транзакций
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Activity className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Real-time Мониторинг</CardTitle>
              <CardDescription>
                Отслеживание статуса бота и транзакций в реальном времени
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Multisig Управление</CardTitle>
              <CardDescription>
                Интеграция с Gnosis Safe для подтверждения критических операций
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Code className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Гибкая Настройка</CardTitle>
              <CardDescription>
                Все параметры бота настраиваются через удобный веб-интерфейс
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Технологический Стек</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
              <div>• Polygon Network</div>
              <div>• Aave Flash Loans</div>
              <div>• 1inch & GeckoTerminal</div>
              <div>• Gnosis Safe</div>
              <div>• Ledger Hardware</div>
              <div>• MetaMask</div>
              <div>• Telegram Alerts</div>
              <div>• PostgreSQL</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
