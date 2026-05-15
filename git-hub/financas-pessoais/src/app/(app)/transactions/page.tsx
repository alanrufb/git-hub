import { createClient } from '@/lib/supabase/server'
import { TransactionDialog } from '@/components/transaction-dialog'
import { TransactionList } from '@/components/transaction-list'
import { TransactionFilters } from '@/components/transaction-filters'
import { Transaction } from '@/types'

interface TransactionsPageProps {
  searchParams: Promise<{
    month?: string
    type?: string
    category?: string
  }>
}

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase.from('transactions').select('*')

  if (params.month) {
    const [year, month] = params.month.split('-')
    const start = `${year}-${month}-01`
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate()
    const end = `${year}-${month}-${String(lastDay).padStart(2, '0')}`
    query = query.gte('date', start).lte('date', end)
  }

  if (params.type && params.type !== 'all') {
    query = query.eq('type', params.type)
  }

  if (params.category && params.category !== 'all') {
    query = query.eq('category', params.category)
  }

  const { data } = await query.order('date', { ascending: false })
  const transactions = (data ?? []) as Transaction[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Transações</h1>
        <TransactionDialog />
      </div>
      <TransactionFilters />
      <TransactionList transactions={transactions} />
    </div>
  )
}
