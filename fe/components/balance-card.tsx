'use client';

import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface BalanceCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
}

export default function BalanceCard({ title, amount, type }: BalanceCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'income':
        return <TrendingUp className="h-6 w-6" />;
      case 'expense':
        return <TrendingDown className="h-6 w-6" />;
      case 'balance':
        return <Wallet className="h-6 w-6" />;
    }
  };

  return (
    <div
      className="
        rounded-xl border border-border
        bg-muted/40 dark:bg-muted/20
        p-6 shadow-sm
        hover:shadow-md transition-all
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </p>

          <p className="mt-3 text-3xl font-semibold text-foreground">
            ${amount.toFixed(2)}
          </p>
        </div>

        <div className="text-muted-foreground">
          {getIcon()}
        </div>
      </div>
    </div>
  );
}
