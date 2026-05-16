'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CATEGORIES, Transaction } from '@/types'
import { format } from 'date-fns'

interface ExportCsvButtonProps {
  transactions: Transaction[]
}

export function ExportCsvButton({ transactions }: ExportCsvButtonProps) {
  function handleExport() {
    if (transactions.length === 0) return

    const header = ['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor (R$)']

    const rows = transactions.map((t) => {
      const date = format(new Date(t.date + 'T00:00:00'), 'dd/MM/yyyy')
      const type = t.type === 'income' ? 'Receita' : 'Despesa'
      const category = CATEGORIES.find((c) => c.value === t.category)?.label ?? t.category
      const amount = t.amount.toFixed(2).replace('.', ',')
      return [date, type, category, `"${t.description.replace(/"/g, '""')}"`, amount]
    })

    const csv = [header, ...rows].map((r) => r.join(';')).join('\n')
    const bom = '﻿'
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `financas-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={transactions.length === 0}
      className="gap-2 text-gray-600 dark:text-gray-300"
      title={transactions.length === 0 ? 'Nenhuma transação para exportar' : `Exportar ${transactions.length} transação(ões)`}
    >
      <Download className="h-4 w-4" />
      Exportar CSV
      {transactions.length > 0 && (
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium px-1.5 py-0.5 rounded">
          {transactions.length}
        </span>
      )}
    </Button>
  )
}
