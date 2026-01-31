'use client'

import * as React from 'react'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Utensils,
  Car,
  Film,
  Lightbulb,
  HeartPulse,
  ShoppingBag,
  DollarSign,
  Briefcase,
  Laptop,
  Smartphone,
  Plane,
  Home,
  Shield,
  Book,
  Dumbbell,
  Pizza,
  Fuel,
  ShoppingCart,
  Tag,
  type LucideIcon,
} from 'lucide-react'


export const CATEGORY_ICONS = {
  Food: Utensils,
  Transportation: Car,
  Entertainment: Film,
  Utilities: Lightbulb,
  Healthcare: HeartPulse,
  Shopping: ShoppingBag,
  Income: DollarSign,
  Salary: Briefcase,
  Freelance: Laptop,
  Subscription: Smartphone,
  Travel: Plane,
  Rent: Home,
  Insurance: Shield,
  Education: Book,
  Fitness: Dumbbell,
  Dining: Pizza,
  Gas: Fuel,
  Groceries: ShoppingCart,
  Other: Tag,
} as const

type CategoryKey = keyof typeof CATEGORY_ICONS


interface CategoryManagerProps {
  categories: string[]
  onAddCategory: (category: string) => void
}


export default function CategoryManager({
  categories,
  onAddCategory,
}: CategoryManagerProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryKey>('Other')

  const [customName, setCustomName] = useState('')

  const SelectedIcon = CATEGORY_ICONS[selectedCategory]

  const handleAdd = () => {
    let finalName: string

    if (selectedCategory === 'Other') {
      if (!customName.trim()) {
        alert('Please enter category name')
        return
      }
      finalName = customName.trim()
    } else {
      finalName = selectedCategory
    }

    if (categories.includes(finalName)) {
      alert('Category already exists')
      return
    }

    onAddCategory(finalName)
    setCustomName('')
  }


  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-bold">Add Category</h3>

          <Select
            value={selectedCategory}
            onValueChange={(value) =>
              setSelectedCategory(value as CategoryKey)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <SelectedIcon className="w-5 h-5 text-primary" />
                  <span>{selectedCategory}</span>
                </div>
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              {(Object.entries(CATEGORY_ICONS) as [
                CategoryKey,
                LucideIcon
              ][]).map(([name, Icon]) => (
                <SelectItem key={name} value={name}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <span>{name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedCategory === 'Other' && (
            <Input
              placeholder="Enter custom category name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
          )}

          <Button className="w-full" onClick={handleAdd}>
            Add Category
          </Button>
        </div>
      </Card>

      <Card className="border-border bg-card">
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4">Your Categories</h3>

          {categories.length === 0 ? (
            <p className="text-muted-foreground text-center">
              No categories yet
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.map((category) => {
                const Icon =
                  CATEGORY_ICONS[category as CategoryKey] ?? Tag

                return (
                  <div
                    key={category}
                    className="p-4 rounded-lg border border-border bg-muted hover:bg-accent/10 transition text-center"
                  >
                    <div className="flex justify-center mb-2">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <p className="text-sm font-medium">{category}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
