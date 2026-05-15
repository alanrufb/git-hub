'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { CATEGORIES, CATEGORY_COLORS, Transaction } from '@/types'

interface CategoryChartProps {
  transactions: Transaction[]
}

export function CategoryChart({ transactions }: CategoryChartProps) {
  const expenses = transactions.filter((t) => t.type === 'expense')

  const categoryTotals = expenses.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + t.amount
    return acc
  }, {})

  const data = Object.entries(categoryTotals)
    .map(([cat, value]) => ({
      name: CATEGORIES.find((c) => c.value === cat)?.label ?? cat,
      value,
      color: CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] ?? '#6b7280',
    }))
    .sort((a, b) => b.value - a.value)

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        Nenhuma despesa no período
      </div>
    )
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        <Legend
          formatter={(value) => <span className="text-xs text-gray-700">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
