import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TransactionDialog } from '@/components/transaction-dialog'
import { CategoryChart } from '@/components/category-chart'
import { Transaction } from '@/types'
import { ArrowUpCircle, ArrowDownCircle, Wallet, TrendingUp } from 'lucide-react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const now = new Date()
  const monthStart = startOfMonth(now).toISOString().split('T')[0]
  const monthEnd = endOfMonth(now).toISOString().split('T')[0]

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .gte('date', monthStart)
    .lte('date', monthEnd)
    .order('date', { ascending: false })

  const txList = (transactions ?? []) as Transaction[]

  const totalIncome = txList
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = txList
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  const monthLabel = format(now, 'MMMM yyyy', { locale: ptBR })
    .replace(/^\w/, (c) => c.toUpperCase())

  const recentTransactions = txList.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">{monthLabel}</p>
        </div>
        <TransactionDialog />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Receitas</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
              </div>
              <ArrowUpCircle className="h-10 w-10 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Despesas</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
              </div>
              <ArrowDownCircle className="h-10 w-10 text-red-200" />
            </div>
          </CardContent>
        </Card>
        <Card className={`border-l-4 ${balance >= 0 ? 'border-l-blue-500' : 'border-l-orange-500'}`}>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Saldo</p>
                <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  {formatCurrency(balance)}
                </p>
              </div>
              <Wallet className={`h-10 w-10 ${balance >= 0 ? 'text-blue-200' : 'text-orange-200'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Despesas por categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryChart transactions={txList} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Últimas transações</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-8">
                Nenhuma transação este mês
              </div>
            ) : (
              <ul className="space-y-3">
                {recentTransactions.map((t) => (
                  <li key={t.id} className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{t.description}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(t.date + 'T00:00:00'), 'dd/MM/yyyy')}
                      </p>
                    </div>
                    <span className={`text-sm font-semibold ml-3 ${
                      t.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
