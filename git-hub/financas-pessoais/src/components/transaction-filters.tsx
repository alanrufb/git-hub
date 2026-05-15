'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CATEGORIES } from '@/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function TransactionFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all' || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const value = format(d, 'yyyy-MM')
    const label = format(d, 'MMMM yyyy', { locale: ptBR })
      .replace(/^\w/, (c) => c.toUpperCase())
    return { value, label }
  })

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={searchParams.get('month') ?? 'all'}
        onValueChange={(v) => updateParam('month', v ?? '')}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Todos os meses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os meses</SelectItem>
          {months.map((m) => (
            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get('type') ?? 'all'}
        onValueChange={(v) => updateParam('type', v ?? '')}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Todos os tipos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os tipos</SelectItem>
          <SelectItem value="income">Receitas</SelectItem>
          <SelectItem value="expense">Despesas</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get('category') ?? 'all'}
        onValueChange={(v) => updateParam('category', v ?? '')}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Todas as categorias" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
