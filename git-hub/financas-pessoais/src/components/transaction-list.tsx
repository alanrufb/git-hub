'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Pencil } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CATEGORIES, CATEGORY_COLORS, Transaction } from '@/types'
import { TransactionDialog } from '@/components/transaction-dialog'
import { DeleteTransactionButton } from '@/components/delete-transaction-button'

interface TransactionListProps {
  transactions: Transaction[]
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-400">Nenhuma transação encontrada.</p>
          <p className="text-sm text-gray-400 mt-1">
            Adicione uma nova transação para começar.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {transactions.map((t) => {
        const categoryLabel = CATEGORIES.find((c) => c.value === t.category)?.label ?? t.category
        const categoryColor = CATEGORY_COLORS[t.category as keyof typeof CATEGORY_COLORS] ?? '#6b7280'

        return (
          <Card key={t.id} className="hover:shadow-md transition-shadow">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="h-3 w-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: categoryColor }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{t.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">
                        {format(new Date(t.date + 'T00:00:00'), "dd 'de' MMM. yyyy", { locale: ptBR })}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-xs px-1.5 py-0"
                        style={{ backgroundColor: categoryColor + '20', color: categoryColor }}
                      >
                        {categoryLabel}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className={`text-sm font-bold ${
                    t.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                  <TransactionDialog
                    transaction={t}
                    trigger={
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <DeleteTransactionButton id={t.id} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
