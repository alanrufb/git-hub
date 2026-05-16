'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Transaction } from '@/types'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface MonthlyBarChartProps {
  transactions: Transaction[]
}

export function MonthlyBarChart({ transactions }: MonthlyBarChartProps) {
  const now = new Date()

  const data = Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(now, 5 - i)
    const start = startOfMonth(month).toISOString().split('T')[0]
    const end = endOfMonth(month).toISOString().split('T')[0]

    const inRange = transactions.filter((t) => t.date >= start && t.date <= end)
    const income = inRange.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = inRange.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

    return {
      name: format(month, 'MMM', { locale: ptBR }).replace(/^\w/, (c) => c.toUpperCase()),
      Receitas: income,
      Despesas: expense,
    }
  })

  const hasData = data.some((d) => d.Receitas > 0 || d.Despesas > 0)

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">
        Nenhuma transação nos últimos 6 meses
      </div>
    )
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barGap={4} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) =>
            v >= 1000 ? `R$${(v / 1000).toFixed(0)}k` : `R$${v}`
          }
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          width={52}
        />
        <Tooltip
          formatter={(value, name) => [formatCurrency(Number(value)), String(name)]}
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            fontSize: '13px',
          }}
        />
        <Legend
          formatter={(value) => (
            <span style={{ fontSize: 12, color: '#6b7280' }}>{value}</span>
          )}
        />
        <Bar dataKey="Receitas" fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Despesas" fill="#f87171" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
