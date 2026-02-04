'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Icon from '@/lib/icon';

interface Category {
  _id: string
  name: string
  icon: string
}
interface TransactionFormProps {
  categories: Category[];
  onAddTransaction: (
    description: string,
    amount: number,
    category: string,
    type: 'income' | 'expense',
    date: string,
  ) => void;
}

export default function TransactionForm({
  categories,
  onAddTransaction,
}: TransactionFormProps) {

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (categories.length > 0) {
      setCategory(categories[0]._id);
    }
  }, [categories]);

  //cho phần chọn category
  const [open, setOpen] = useState(false)
  const selectedCategory = categories.find(c => c._id === category)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !amount || !category || !date) {
      alert('Please fill in all fields');
      return;
    }

    onAddTransaction(description, parseFloat(amount), category, type, date);

    setDescription('');
    setAmount('');
    setCategory(categories[0]?._id || '');
    setType('expense');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <Card className="border-border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground">
        Add Transaction
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex w-fit rounded-lg border border-border bg-muted p-1">
          {(['expense', 'income'] as const).map((value) => (
            <label
              key={value}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors',
                type === value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <input
                type="radio"
                value={value}
                checked={type === value}
                onChange={() => setType(value)}
                className="hidden"
              />
              {value === 'expense' ? 'Expense' : 'Income'}
            </label>
          ))}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Description
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Grocery shopping"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Amount
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>

          <div className="relative">
            <label className="text-sm font-medium text-foreground mb-1 block">
              Category
            </label>

            {/* Selected */}
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="
                   w-full
                   flex items-center justify-between
                   rounded-md border border-border
                   bg-input
                   px-3 py-2
                   text-sm
                   text-foreground
                   hover:bg-muted
                 "
            >
              <div className="flex items-center gap-2">
                {selectedCategory?.icon && (
                  <Icon name={selectedCategory.icon} />
                )}
                <span>{selectedCategory?.name || 'Select category'}</span>
              </div>
              <span className="text-muted-foreground">▾</span>
            </button>

            {/* Dropdown */}
            {open && (
              <ul
                className="
                     absolute z-50 mt-1 w-full
                     rounded-md border border-border
                     bg-popover
                     shadow-md
                     max-h-60
                     overflow-y-auto
                   "
              >
                {categories.map((cat) => (
                  <li
                    key={cat._id}
                    onClick={() => {
                      setCategory(cat._id)
                      setOpen(false)
                    }}
                    className="
                         flex items-center gap-2
                         px-3 py-2
                         text-sm
                         cursor-pointer
                         hover:bg-muted
                       "
                  >
                    {cat.icon && <Icon name={cat.icon} />}
                    <span>{cat.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>


          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Add {type === 'income' ? 'Income' : 'Expense'}
        </Button>
      </form>
    </Card>
  );
}
