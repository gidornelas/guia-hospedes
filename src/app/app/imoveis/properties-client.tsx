'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Search,
  Eye,
  Edit,
  BookOpen,
  Building2,
  MapPin,
  SlidersHorizontal,
  LayoutGrid,
  List,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileEdit,
} from 'lucide-react'
import { PROPERTY_STATUS, GUIDE_STATUS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

interface Property {
  id: string
  name: string
  internalCode: string | null
  city: string | null
  state: string | null
  status: string
  type: string
  coverImage: string | null
  guide: { status: string } | null
}

interface PropertiesClientProps {
  properties: Property[]
}

export default function PropertiesClient({ properties }: PropertiesClientProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch =
        property.name.toLowerCase().includes(search.toLowerCase()) ||
        (property.internalCode?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (property.city?.toLowerCase() || '').includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'with-guide' && property.guide) ||
        (statusFilter === 'without-guide' && !property.guide) ||
        property.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [properties, search, statusFilter])

  const stats = useMemo(() => {
    return {
      total: properties.length,
      withGuide: properties.filter((p) => p.guide).length,
      published: properties.filter((p) => p.guide?.status === 'PUBLISHED').length,
      draft: properties.filter((p) => p.guide?.status === 'DRAFT').length,
    }
  }, [properties])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Imóveis"
        description="Gerencie todos os seus imóveis e seus guias"
      >
        <Link href="/app/imoveis/novo">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Imóvel
          </Button>
        </Link>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: Building2, color: 'text-brand-600' },
          { label: 'Com Guia', value: stats.withGuide, icon: CheckCircle2, color: 'text-emerald-600' },
          { label: 'Publicados', value: stats.published, icon: BookOpen, color: 'text-blue-600' },
          { label: 'Rascunho', value: stats.draft, icon: FileEdit, color: 'text-amber-600' },
        ].map((stat) => (
          <Card key={stat.label} className="shadow-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <stat.icon className={cn('h-5 w-5', stat.color)} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, código ou cidade..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || 'all')}>
                <SelectTrigger className="w-full sm:w-40">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="with-guide">Com Guia</SelectItem>
                  <SelectItem value="without-guide">Sem Guia</SelectItem>
                  <SelectItem value="ACTIVE">Ativo</SelectItem>
                  <SelectItem value="DRAFT">Rascunho</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-9 w-9 rounded-none rounded-l-md"
                  onClick={() => setViewMode('table')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-9 w-9 rounded-none rounded-r-md"
                  onClick={() => setViewMode('cards')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProperties.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="Nenhum imóvel encontrado"
              description={
                search || statusFilter !== 'all'
                  ? 'Tente ajustar os filtros ou termos de busca.'
                  : 'Comece criando seu primeiro imóvel para gerar guias digitais para seus hóspedes.'
              }
              actionLabel="Criar Imóvel"
              actionHref="/app/imoveis/novo"
            />
          ) : viewMode === 'table' ? (
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imóvel</TableHead>
                    <TableHead className="hidden sm:table-cell">Código</TableHead>
                    <TableHead className="hidden md:table-cell">Cidade</TableHead>
                    <TableHead>Status do Guia</TableHead>
                    <TableHead className="hidden lg:table-cell">Publicação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => {
                    const statusConfig = PROPERTY_STATUS[property.status as keyof typeof PROPERTY_STATUS]
                    const guideStatus = property.guide
                      ? GUIDE_STATUS[property.guide.status as keyof typeof GUIDE_STATUS]
                      : null

                    return (
                      <TableRow key={property.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                              {property.coverImage ? (
                                <img
                                  src={property.coverImage}
                                  alt={property.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">{property.name}</p>
                              <p className="text-xs text-muted-foreground">{property.type}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground hidden sm:table-cell">
                          {property.internalCode || '-'}
                        </TableCell>
                        <TableCell className="text-muted-foreground hidden md:table-cell">
                          {property.city ? `${property.city}, ${property.state}` : '-'}
                        </TableCell>
                        <TableCell>
                          {guideStatus ? (
                            <Badge
                              variant={
                                guideStatus.color === 'success'
                                  ? 'default'
                                  : guideStatus.color === 'warning'
                                    ? 'secondary'
                                    : guideStatus.color === 'destructive'
                                      ? 'destructive'
                                      : 'outline'
                              }
                              className={cn(
                                guideStatus.color === 'success' && 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                              )}
                            >
                              {guideStatus.label}
                            </Badge>
                          ) : (
                            <Badge variant="outline">Sem guia</Badge>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge
                            variant={property.status === 'ACTIVE' ? 'default' : 'secondary'}
                            className={cn(
                              property.status === 'ACTIVE' && 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                            )}
                          >
                            {statusConfig?.label || property.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Link href={`/app/imoveis/${property.id}`}>
                              <Button variant="ghost" size="icon" title="Visualizar">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/app/imoveis/${property.id}/editar`}>
                              <Button variant="ghost" size="icon" title="Editar">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            {property.guide && (
                              <Link href={`/app/imoveis/${property.id}/preview`}>
                                <Button variant="ghost" size="icon" title="Preview">
                                  <BookOpen className="h-4 w-4" />
                                </Button>
                              </Link>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProperties.map((property) => {
                const statusConfig = PROPERTY_STATUS[property.status as keyof typeof PROPERTY_STATUS]
                const guideStatus = property.guide
                  ? GUIDE_STATUS[property.guide.status as keyof typeof GUIDE_STATUS]
                  : null

                return (
                  <Card key={property.id} className="shadow-card hover:shadow-card-hover transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                          {property.coverImage ? (
                            <img
                              src={property.coverImage}
                              alt={property.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{property.name}</p>
                          <p className="text-xs text-muted-foreground">{property.type}</p>
                          {property.city && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" />
                              {property.city}, {property.state}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        {guideStatus ? (
                          <Badge
                            variant={guideStatus.color === 'success' ? 'default' : 'outline'}
                            className={cn(
                              guideStatus.color === 'success' && 'bg-emerald-100 text-emerald-700'
                            )}
                          >
                            {guideStatus.label}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Sem guia</Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {statusConfig?.label || property.status}
                        </Badge>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Link href={`/app/imoveis/${property.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            Ver
                          </Button>
                        </Link>
                        <Link href={`/app/imoveis/${property.id}/editar`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full gap-1">
                            <Edit className="h-3.5 w-3.5" />
                            Editar
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
