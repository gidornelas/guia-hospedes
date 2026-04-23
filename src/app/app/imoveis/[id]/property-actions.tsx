'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Power, Trash2 } from 'lucide-react'
import type { GuideStatus } from '@prisma/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { deleteProperty } from '@/app/actions/delete-property'
import { toggleGuideStatus } from '@/app/actions/toggle-guide-status'
import { ROUTES } from '@/lib/constants'
import { toast } from 'sonner'

interface PropertyActionsProps {
  propertyId: string
  guideStatus?: GuideStatus
}

export function PropertyActions({
  propertyId,
  guideStatus,
}: PropertyActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteProperty(propertyId)
      if (result.success) {
        toast.success('Imóvel excluído com sucesso')
        router.push(ROUTES.imoveis)
      } else {
        toast.error(result.error || 'Erro ao excluir imóvel')
      }
    } catch {
      toast.error('Erro inesperado ao excluir')
    } finally {
      setIsDeleting(false)
      setOpen(false)
    }
  }

  const handleToggle = async () => {
    setIsToggling(true)
    try {
      const result = await toggleGuideStatus(propertyId)
      if (result.success) {
        const message =
          result.status === 'PUBLISHED'
            ? 'Guia publicado!'
            : 'Guia despublicado!'
        toast.success(message)
        router.refresh()
      } else {
        toast.error(result.error || 'Erro ao alterar status')
      }
    } catch {
      toast.error('Erro inesperado')
    } finally {
      setIsToggling(false)
    }
  }

  const isPublished = guideStatus === 'PUBLISHED'

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
      {guideStatus && (
        <Button
          variant={isPublished ? 'secondary' : 'default'}
          className="w-full gap-2 sm:w-auto"
          onClick={handleToggle}
          disabled={isToggling}
        >
          {isToggling ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Power className="h-4 w-4" />
          )}
          {isPublished ? 'Despublicar' : 'Publicar'}
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button
              variant="outline"
              className="w-full gap-2 text-destructive hover:text-destructive sm:w-auto"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir imóvel</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este imóvel? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Excluir'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
