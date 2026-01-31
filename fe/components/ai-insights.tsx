'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lightbulb, Pin, Sparkles } from 'lucide-react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
}

interface AIInsightsProps {
  transactions: Transaction[];
  categories: string[];
}

export default function AIInsights({
  transactions,
  categories,
}: AIInsightsProps) {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const analytics = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenseByCategory: { [key: string]: number } = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
      });

    const topCategory = Object.entries(expenseByCategory).sort(
      ([, a], [, b]) => b - a,
    )[0];

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      expenseByCategory,
      topCategory,
      transactionCount: transactions.length,
    };
  }, [transactions]);

  const generateInsights = async () => {
    setLoading(true);
    setInsights([]);

    try {
      const insightsList: string[] = [];

      if (analytics.transactionCount > 0) {
        const avgExpense = (
          analytics.totalExpense / transactions.filter((t) => t.type === 'expense').length
        ).toFixed(2);
        insightsList.push(
          `Your average expense per transaction is $${avgExpense}. Try to keep it under control by setting a daily budget.`,
        );
      }

      if (analytics.topCategory) {
        const [category, amount] = analytics.topCategory;
        const percentage = ((amount / analytics.totalExpense) * 100).toFixed(1);
        insightsList.push(
          `Your top spending category is ${category} with $${amount.toFixed(2)} (${percentage}% of total expenses). Consider optimizing this area.`,
        );
      }

      if (analytics.balance > 0) {
        insightsList.push(
          `Great job! Your current balance is positive at $${analytics.balance.toFixed(2)}. Keep up this positive trend!`,
        );
      } else if (analytics.balance < 0) {
        insightsList.push(
          `Your expenses exceed income by $${Math.abs(analytics.balance).toFixed(2)}. Consider reducing discretionary spending.`,
        );
      }

      if (analytics.expenseByCategory['Entertainment'] !== undefined) {
        const entertainmentSpend = analytics.expenseByCategory['Entertainment'];
        insightsList.push(
          `You're spending $${entertainmentSpend.toFixed(2)} on entertainment. If you reduced this by 20%, you could save $${(entertainmentSpend * 0.2).toFixed(2)}.`,
        );
      }

      const categoryCount = Object.keys(analytics.expenseByCategory).length;
      insightsList.push(
        `You have expenses in ${categoryCount} categories. Good diversification! Track each category carefully.`,
      );

      setInsights(insightsList);

      const suggestionsList: string[] = [
        'Set monthly budgets for each spending category',
        'Track your daily expenses to identify spending patterns',
        'Create savings goals and automate transfers',
        'Review and adjust categories monthly',
        'Look for subscription services you might not be using',
      ]

      setSuggestions(suggestionsList);
    } catch (error) {
      console.error('[v0] Error generating insights:', error);
      setInsights([
        'Error generating insights. Please try again.',
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Insights Card */}
      <Card className="border-border bg-gradient-to-br from-card to-muted shadow-sm">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI-Powered Insights
              </h3>
              <p className="text-secondary text-sm mt-1">
                Get personalized financial recommendations
              </p>
            </div>
            <Button
              onClick={generateInsights}
              disabled={loading}
              className="bg-primary hover:bg-accent text-primary-foreground font-semibold transition-colors"
            >
              {loading ? 'Analyzing...' : 'Generate Insights'}
            </Button>
          </div>

          {insights.length > 0 && (
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="p-4 bg-background border border-border rounded-lg hover:border-primary transition-colors"
                >
                  <p className="text-foreground text-sm leading-relaxed flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <span className="font-semibold">Insight {index + 1}:</span> {insight}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}

          {insights.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-secondary">
                Click the button above to generate personalized insights based on your
                transactions
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Actionable Suggestions */}
      {suggestions.length > 0 && (
        <Card className="border-border bg-card shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Actionable Tips</h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 flex items-center gap-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <Pin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-foreground text-sm">
                    {suggestion}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border bg-card shadow-sm">
          <div className="p-6">
            <h4 className="text-sm font-medium text-secondary mb-4">Financial Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-foreground">Total Income:</span>
                <span className="font-bold text-green-600">
                  ${analytics.totalIncome.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground">Total Expenses:</span>
                <span className="font-bold text-red-600">
                  ${analytics.totalExpense.toFixed(2)}
                </span>
              </div>
              <div className="pt-2 border-t border-border flex justify-between items-center">
                <span className="text-foreground font-semibold">Balance:</span>
                <span
                  className={`font-bold text-lg ${analytics.balance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                  ${analytics.balance.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <div className="p-6">
            <h4 className="text-sm font-medium text-secondary mb-4">Spending Breakdown</h4>
            <div className="space-y-2">
              {Object.entries(analytics.expenseByCategory)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([category, amount]) => (
                  <div
                    key={category}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-foreground">{category}:</span>
                    <span className="font-semibold text-foreground">
                      ${amount.toFixed(2)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
