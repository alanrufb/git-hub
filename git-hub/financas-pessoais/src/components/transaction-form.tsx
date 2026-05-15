'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CATEGORIES, Transaction, TransactionFormData, TransactionType } from '@/types'
import { createTransaction, updateTransaction } from '@/app/actions/transactions'

interface TransactionFormProps {
  transaction?: Transaction
  onSuccess?: () => void
}

export function TransactionForm({ transaction, onSuccess }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(transaction?.type ?? 'expense')
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : '')
  const [description, setDescription] = useState(transaction?.description ?? '')
  const [category, setCategory] = useState(transaction?.category ?? '')
  const [date, setDate] = useState(transaction?.date ?? new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const filteredCategories = CATEGORIES.filter((c) => c.type.includes(type))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const parsedAmount = parseFloat(amount.replace(',', '.'))
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Informe um valor válido.')
      setLoading(false)
      return
    }
    if (!category) {
      setError('Selecione uma categoria.')
      setLoading(false)
      return
    }

    const data: TransactionFormData = {
      type,
      amount: parsedAmount,
      description,
      category: category as TransactionFormData['category'],
      date,
    }

    const result = transaction
      ? await updateTransaction(transaction.id, data)
      : await createTransaction(data)

    if (result.error) {
      setError(result.error)
    } else {
      onSuccess?.()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => { setType('income'); setCategory('') }}
          className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            type === 'income'
              ? 'bg-green-100 text-green-700 border-2 border-green-400'
              : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
          }`}
        >
          Receita
        </button>
        <button
          type="button"
          onClick={() => { setType('expense'); setCategory('') }}
          className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            type === 'expense'
              ? 'bg-red-100 text-red-700 border-2 border-red-400'
              : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
          }`}
        >
          Despesa
        </button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Valor (R$)</Label>
        <Input
          id="amount"
          type="text"
          inputMode="decimal"
          placeholder="0,00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          placeholder="Ex: Supermercado, Salário..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select value={category} onValueChange={(v) => setCategory(v ?? '')}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Data</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Salvando...' : transaction ? 'Atualizar' : 'Adicionar transação'}
      </Button>
    </form>
  )
}
