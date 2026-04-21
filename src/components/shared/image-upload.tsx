'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import { uploadPropertyCover } from '@/app/actions/upload-image'
import { toast } from 'sonner'

interface ImageUploadProps {
  propertyId: string
  currentImage?: string | null
  onUploaded?: (url: string) => void
}

export function ImageUpload({ propertyId, currentImage, onUploaded }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview local
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const result = await uploadPropertyCover(propertyId, formData)

      if (result.success && result.url) {
        toast.success('Imagem salva com sucesso!')
        onUploaded?.(result.url)
        // Atualiza preview com URL do servidor
        setPreview(result.url)
      } else {
        toast.error(result.error || 'Erro ao salvar imagem')
        // Reverte preview se falhar
        setPreview(currentImage || null)
      }
    } catch {
      toast.error('Erro inesperado ao fazer upload')
      setPreview(currentImage || null)
    } finally {
      setIsUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      <Label>Imagem de Capa</Label>

      {preview ? (
        <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border bg-muted">
          <img
            src={preview}
            alt="Preview da capa"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center w-full max-w-md aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted hover:bg-muted/80 cursor-pointer transition-colors"
        >
          <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Clique para adicionar uma imagem</p>
          <p className="text-xs text-muted-foreground mt-1">JPEG, PNG ou WEBP ate 5MB</p>
        </div>
      )}

      <Input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {preview && !isUploading && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          className="gap-2"
        >
          <ImagePlus className="h-4 w-4" />
          Alterar imagem
        </Button>
      )}

      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Enviando imagem...
        </div>
      )}
    </div>
  )
}
