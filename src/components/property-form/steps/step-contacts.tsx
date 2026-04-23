'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Phone,
  Info,
} from 'lucide-react'
import { Contact } from '../types'

interface StepContactsProps {
  contacts: Contact[]
  addContact: () => void
  removeContact: (index: number) => void
  moveContact: (index: number, direction: 'up' | 'down') => void
  updateContact: (index: number, field: keyof Contact, value: string) => void
}

export function StepContacts({ contacts, addContact, removeContact, moveContact, updateContact }: StepContactsProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-brand-50 border border-brand-100 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-brand-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-brand-800">Contatos</p>
            <p className="text-sm text-brand-700 mt-1">Adicione pessoas de apoio que o hóspede pode contatar.</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Contatos</h3>
        <Button type="button" variant="outline" size="sm" onClick={addContact} className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </div>
      {contacts.map((contact, index) => (
        <Card key={index} className="shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-medium">Contato {index + 1}</h4>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={index === 0}
                  onClick={() => moveContact(index, 'up')}
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={index === contacts.length - 1}
                  onClick={() => moveContact(index, 'down')}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => removeContact(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                placeholder="Nome"
                value={contact.name}
                onChange={(e) => updateContact(index, 'name', e.target.value)}
              />
              <Select
                value={contact.role}
                onValueChange={(v) => {
                  if (!v) return
                  updateContact(index, 'role', v)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOST">Anfitrião</SelectItem>
                  <SelectItem value="SUPPORT">Suporte</SelectItem>
                  <SelectItem value="MAINTENANCE">Manutenção</SelectItem>
                  <SelectItem value="CONCIERGE">Portaria</SelectItem>
                  <SelectItem value="EMERGENCY">Emergência</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                placeholder="Telefone"
                value={contact.phone}
                onChange={(e) => updateContact(index, 'phone', e.target.value)}
              />
              <Input
                placeholder="WhatsApp"
                value={contact.whatsapp}
                onChange={(e) => updateContact(index, 'whatsapp', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      ))}
      {contacts.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <Phone className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Nenhum contato adicionado</p>
          <Button type="button" variant="outline" size="sm" onClick={addContact} className="mt-2 gap-2">
            <Plus className="h-4 w-4" />
            Adicionar contato
          </Button>
        </div>
      )}
    </div>
  )
}
