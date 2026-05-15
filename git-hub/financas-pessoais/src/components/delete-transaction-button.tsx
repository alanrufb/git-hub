'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { deleteTransaction } from '@/app/actions/transactions'

interface DeleteTransactionButtonProps {
  id: string
}

export function DeleteTransactionButton({ id }: DeleteTransactionButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    await deleteTransaction(id)
    setOpen(false)
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </Button>
      } />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Excluir transação</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-2 justify-end mt-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
