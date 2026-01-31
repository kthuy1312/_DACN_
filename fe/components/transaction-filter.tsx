'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
}

interface TransactionFilterProps {
  transactions: Transaction[];
  categories: string[];
  onFilter: (filtered: Transaction[]) => void;
}

export default function TransactionFilter({
  transactions,
  categories,
  onFilter,
}: TransactionFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilter = () => {
    let filtered = transactions;

    if (searchQuery) {
      filtered = filtered.filter((t) =>
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter((t) => t.type === selectedType);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    if (minAmount) {
      filtered = filtered.filter((t) => t.amount >= parseFloat(minAmount));
    }

    if (maxAmount) {
      filtered = filtered.filter((t) => t.amount <= parseFloat(maxAmount));
    }

    if (startDate) {
      filtered = filtered.filter((t) => t.date >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter((t) => t.date <= endDate);
    }

    onFilter(filtered);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCategory('all');
    setMinAmount('');
    setMaxAmount('');
    setStartDate('');
    setEndDate('');
    onFilter(transactions);
  };

  return (
    <Card className="border-border bg-card shadow-sm p-6">
      <h3 className="text-lg font-bold text-foreground mb-6">Filter Transactions</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Search</label>
          <Input
            type="text"
            placeholder="Search description..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleFilter();
            }}
            className="bg-input border-border text-foreground"
          />
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Type</label>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value as 'all' | 'income' | 'expense');
              handleFilter();
            }}
            className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              handleFilter();
            }}
            className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Min Amount */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Min Amount</label>
          <div className="flex items-center gap-2">
            <span className="text-foreground">$</span>
            <Input
              type="number"
              placeholder="0.00"
              value={minAmount}
              onChange={(e) => {
                setMinAmount(e.target.value);
                handleFilter();
              }}
              step="0.01"
              min="0"
              className="bg-input border-border text-foreground"
            />
          </div>
        </div>

        {/* Max Amount */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Max Amount</label>
          <div className="flex items-center gap-2">
            <span className="text-foreground">$</span>
            <Input
              type="number"
              placeholder="9999.99"
              value={maxAmount}
              onChange={(e) => {
                setMaxAmount(e.target.value);
                handleFilter();
              }}
              step="0.01"
              min="0"
              className="bg-input border-border text-foreground"
            />
          </div>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              handleFilter();
            }}
            className="bg-input border-border text-foreground"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              handleFilter();
            }}
            className="bg-input border-border text-foreground"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleFilter}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors font-semibold"
        >
          Apply Filters
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-border transition-colors font-semibold"
        >
          Reset
        </button>
      </div>
    </Card>
  );
}
