'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { TransactionForm } from '@/components/transaction-form'
import { Transaction } from '@/types'

interface TransactionDialogProps {
  transaction?: Transaction
  trigger?: React.ReactElement
}

export function TransactionDialog({ transaction, trigger }: TransactionDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger ?? (
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="h-4 w-4" />
          Nova transação
        </Button>
      )} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {transaction ? 'Editar transação' : 'Nova transação'}
          </DialogTitle>
        </DialogHeader>
        <TransactionForm
          transaction={transaction}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
