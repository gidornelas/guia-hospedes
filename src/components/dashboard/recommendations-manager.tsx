'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Plus,
  Trash2,
  Edit3,
  MapPin,
  Instagram,
  ExternalLink,
  X,
  Save,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { RECOMMENDATION_CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import {
  createRecommendation,
  updateRecommendation,
  deleteRecommendation,
} from '@/app/actions/recommendations'

interface Recommendation {
  id: string
  name: string
  category: string
  description: string | null
  address: string | null
  mapUrl: string | null
  instagram: string | null
  image: string | null
  distance: string | null
}

interface RecommendationsManagerProps {
  propertyId: string
  recommendations: Recommendation[]
}

const categoryIcons: Record<string, string> = {
  RESTAURANT: '🍽️',
  CAFE: '☕',
  BAR: '🍸',
  BAKERY: '🥐',
  MARKET: '🛒',
  PHARMACY: '💊',
  SHOPPING: '🛍️',
  NIGHTCLUB: '🎵',
  ATTRACTION: '🎯',
  BEACH: '🏖️',
  PARK: '🌳',
  GYM: '💪',
  HOSPITAL: '🏥',
  TRANSPORT: '🚌',
}

export default function RecommendationsManager({
  propertyId,
  recommendations,
}: RecommendationsManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    address: '',
    mapUrl: '',
    instagram: '',
    image: '',
    distance: '',
  })

  const resetForm = () => {
    setForm({
      name: '',
      category: '',
      description: '',
      address: '',
      mapUrl: '',
      instagram: '',
      image: '',
      distance: '',
    })
    setEditingId(null)
  }

  const handleAddNew = () => {
    resetForm()
    setShowForm(true)
  }

  const handleEdit = (rec: Recommendation) => {
    setForm({
      name: rec.name,
      category: rec.category,
      description: rec.description || '',
      address: rec.address || '',
      mapUrl: rec.mapUrl || '',
      instagram: rec.instagram || '',
      image: rec.image || '',
      distance: rec.distance || '',
    })
    setEditingId(rec.id)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.category) {
      toast.error('Nome e categoria são obrigatórios')
      return
    }

    setIsSubmitting(true)
    try {
      let result
      if (editingId) {
        result = await updateRecommendation(editingId, {
          name: form.name,
          category: form.category,
          description: form.description,
          address: form.address,
          mapUrl: form.mapUrl,
          instagram: form.instagram,
          image: form.image,
          distance: form.distance,
        })
      } else {
        result = await createRecommendation({
          propertyId,
          name: form.name,
          category: form.category,
          description: form.description,
          address: form.address,
          mapUrl: form.mapUrl,
          instagram: form.instagram,
          image: form.image,
          distance: form.distance,
        })
      }

      if (result.success) {
        toast.success(
          editingId
            ? 'Recomendação atualizada!'
            : 'Recomendação adicionada!'
        )
        setShowForm(false)
        resetForm()
      } else {
        toast.error(result.error || 'Erro ao salvar')
      }
    } catch {
      toast.error('Erro inesperado')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta recomendação?')) return
    const result = await deleteRecommendation(id)
    if (result.success) {
      toast.success('Recomendação excluída')
    } else {
      toast.error(result.error || 'Erro ao excluir')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-semibold">Dicas da Região</h3>
          <p className="text-sm text-muted-foreground">
            Adicione restaurantes, bares, cafeterias, shoppings e outros lugares próximos
          </p>
        </div>
        {!showForm && (
          <Button className="gap-2" onClick={handleAddNew}>
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        )}
      </div>

      {/* Formulário inline */}
      {showForm && (
        <Card className="shadow-card border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">
                {editingId ? 'Editar recomendação' : 'Nova recomendação'}
              </h4>
              <Button variant="ghost" size="icon" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Nome */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do local *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Café Central"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                {/* Categoria */}
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v: string | null) => setForm({ ...form, category: v || '' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(RECOMMENDATION_CATEGORIES).map(
                        ([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {categoryIcons[key]} {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Café artesanal e pães frescos todos os dias..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={2}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Endereço */}
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    placeholder="Rua das Flores, 123"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>

                {/* Distância */}
                <div className="space-y-2">
                  <Label htmlFor="distance">Distância do imóvel</Label>
                  <Input
                    id="distance"
                    placeholder="Ex: 500m, 2 min a pé"
                    value={form.distance}
                    onChange={(e) => setForm({ ...form, distance: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Link do Mapa */}
                <div className="space-y-2">
                  <Label htmlFor="mapUrl">Link do Google Maps</Label>
                  <Input
                    id="mapUrl"
                    type="url"
                    placeholder="https://maps.google.com/..."
                    value={form.mapUrl}
                    onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
                  />
                </div>

                {/* Instagram */}
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    placeholder="@cafe.central"
                    value={form.instagram}
                    onChange={(e) =>
                      setForm({ ...form, instagram: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Foto */}
              <div className="space-y-2">
                <Label htmlFor="image">URL da foto</Label>
                <Input
                  id="image"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
                {form.image && (
                  <div className="mt-2 rounded-lg border overflow-hidden h-32 w-full max-w-xs">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  <Save className="h-4 w-4" />
                  {isSubmitting
                    ? 'Salvando...'
                    : editingId
                      ? 'Atualizar'
                      : 'Adicionar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista */}
      {recommendations.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
          <MapPin className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-muted-foreground">
            Nenhuma recomendação cadastrada
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Clique em "Adicionar" para cadastrar bares, restaurantes, cafeterias, shoppings e outros lugares próximos ao imóvel
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((rec) => (
            <Card
              key={rec.id}
              className="shadow-card overflow-hidden transition-shadow hover:shadow-card-hover"
            >
              {rec.image && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={rec.image}
                    alt={rec.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <CardContent className={cn('p-4', !rec.image && 'pt-5')}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-lg">
                        {categoryIcons[rec.category] || '📍'}
                      </span>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {RECOMMENDATION_CATEGORIES[
                          rec.category as keyof typeof RECOMMENDATION_CATEGORIES
                        ] || rec.category}
                      </span>
                    </div>
                    <p className="font-semibold text-sm truncate">
                      {rec.name}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleEdit(rec)}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => handleDelete(rec.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {rec.description && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {rec.description}
                  </p>
                )}

                <div className="mt-3 space-y-1.5">
                  {rec.address && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{rec.address}</span>
                    </div>
                  )}
                  {rec.distance && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span>{rec.distance}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {rec.mapUrl && (
                    <a
                      href={rec.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Maps
                    </a>
                  )}
                  {rec.instagram && (
                    <a
                      href={
                        rec.instagram.startsWith('http')
                          ? rec.instagram
                          : `https://instagram.com/${rec.instagram.replace('@', '')}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-pink-50 px-2 py-1 text-[10px] font-medium text-pink-700 hover:bg-pink-100 transition-colors"
                    >
                      <Instagram className="h-3 w-3" />
                      Instagram
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
