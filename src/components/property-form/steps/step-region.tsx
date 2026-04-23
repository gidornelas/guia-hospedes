'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChevronUp,
  ChevronDown,
  Plus,
  Trash2,
  MapPin,
  Info,
} from 'lucide-react'
import { RECOMMENDATION_CATEGORIES } from '@/lib/constants'
import { Recommendation } from '../types'

interface StepRegionProps {
  recommendations: Recommendation[]
  addRecommendation: () => void
  removeRecommendation: (index: number) => void
  moveRecommendation: (index: number, direction: 'up' | 'down') => void
  updateRecommendation: (index: number, field: keyof Recommendation, value: string) => void
}

export function StepRegion({ recommendations, addRecommendation, removeRecommendation, moveRecommendation, updateRecommendation }: StepRegionProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-brand-50 border border-brand-100 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-brand-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-brand-800">Dicas da Região</p>
            <p className="text-sm text-brand-700 mt-1">Adicione restaurantes, bares, cafeterias, shoppings, praias e outros lugares próximos ao imóvel.</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Recomendações</h3>
        <Button type="button" variant="outline" size="sm" onClick={addRecommendation} className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar local
        </Button>
      </div>
      {recommendations.map((rec, index) => (
        <Card key={index} className="shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-medium">Local {index + 1}</h4>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={index === 0}
                  onClick={() => moveRecommendation(index, 'up')}
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={index === recommendations.length - 1}
                  onClick={() => moveRecommendation(index, 'down')}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => removeRecommendation(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                placeholder="Nome do local *"
                value={rec.name}
                onChange={(e) => updateRecommendation(index, 'name', e.target.value)}
              />
              <Select
                value={rec.category}
                onValueChange={(v: string | null) => updateRecommendation(index, 'category', v || '')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Categoria *" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(RECOMMENDATION_CATEGORIES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="Descrição"
              value={rec.description}
              onChange={(e) => updateRecommendation(index, 'description', e.target.value)}
              rows={2}
            />
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                placeholder="Endereço"
                value={rec.address}
                onChange={(e) => updateRecommendation(index, 'address', e.target.value)}
              />
              <Input
                placeholder="Distância do imóvel (ex: 500m)"
                value={rec.distance}
                onChange={(e) => updateRecommendation(index, 'distance', e.target.value)}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                placeholder="Link do Google Maps"
                value={rec.mapUrl}
                onChange={(e) => updateRecommendation(index, 'mapUrl', e.target.value)}
              />
              <Input
                placeholder="Instagram (@nome)"
                value={rec.instagram}
                onChange={(e) => updateRecommendation(index, 'instagram', e.target.value)}
              />
            </div>
            <Input
              placeholder="URL da foto"
              value={rec.image}
              onChange={(e) => updateRecommendation(index, 'image', e.target.value)}
            />
            {rec.image && (
              <div className="rounded-lg border overflow-hidden h-32 w-full max-w-xs">
                <img
                  src={rec.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      {recommendations.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Nenhuma recomendação adicionada</p>
          <Button type="button" variant="outline" size="sm" onClick={addRecommendation} className="mt-2 gap-2">
            <Plus className="h-4 w-4" />
            Adicionar local
          </Button>
        </div>
      )}
    </div>
  )
}
