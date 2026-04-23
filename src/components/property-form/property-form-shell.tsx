'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Save,
  CheckCircle2,
  Circle,
  Eye,
  RotateCcw,
  Check,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/shared/page-header'
import { ReactNode } from 'react'

interface StepDef {
  id: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

interface CompletionCheck {
  label: string
  filled: boolean
  step: number
}

interface CompletionStatus {
  checks: CompletionCheck[]
  progress: number
  filledCount: number
  total: number
}

interface PropertyFormShellProps {
  children: ReactNode
  steps: StepDef[]
  currentStep: number
  setCurrentStep: (step: number) => void
  completionStatus: CompletionStatus
  onNext: () => void
  onPrevious: () => void
  onSubmit: () => void
  onSaveDraft?: () => void
  isLoading: boolean
  isSavingDraft?: boolean
  showPreview: boolean
  setShowPreview: (show: boolean) => void
  lastSaved: Date | null
  onClearDraft?: () => void
  submitLabel: string
  pageTitle: string
  pageDescription: string
  backHref: string
  summaryTitle: string
  propertyName: string
  propertyCity: string
  propertyState: string
  welcomeMessage: string
  checkInTime: string
  checkOutTime: string
  wifiNetwork: string
  contactsCount: number
  contacts: Array<{ name: string; role: string }>
  showInfoCard?: boolean
  showPreviewCard?: boolean
}

export function PropertyFormShell({
  children,
  steps,
  currentStep,
  setCurrentStep,
  completionStatus,
  onNext,
  onPrevious,
  onSubmit,
  onSaveDraft,
  isLoading,
  isSavingDraft,
  showPreview,
  setShowPreview,
  lastSaved,
  onClearDraft,
  submitLabel,
  pageTitle,
  pageDescription,
  backHref,
  summaryTitle,
  propertyName,
  propertyCity,
  propertyState,
  welcomeMessage,
  checkInTime,
  checkOutTime,
  wifiNetwork,
  contactsCount,
  contacts,
  showInfoCard = false,
  showPreviewCard = false,
}: PropertyFormShellProps) {
  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        eyebrow="Cadastro guiado"
        title={pageTitle}
        description={pageDescription}
        meta={
          <>
            <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
              Etapa {currentStep + 1} de {steps.length}
            </span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
              {completionStatus.progress}% completo
            </span>
            {lastSaved && (
              <span className="flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                <Check className="h-3 w-3 text-emerald-500" />
                Salvo às {lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </>
        }
      >
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Link href={backHref} className="w-full sm:w-auto">
            <Button variant="outline" className="w-full gap-2 sm:w-auto">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          {onClearDraft && (
            <Button variant="outline" onClick={onClearDraft} className="w-full gap-2 sm:w-auto">
              <RotateCcw className="h-4 w-4" />
              Limpar rascunho
            </Button>
          )}
          {showPreviewCard && (
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="w-full gap-2 sm:w-auto"
            >
              <Eye className="h-4 w-4" />
              {showPreview ? 'Ocultar preview' : 'Abrir preview'}
            </Button>
          )}
        </div>
      </PageHeader>

      {showInfoCard && (
        <Card className="border-brand-200 bg-brand-50/40 shadow-card">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
              <div className="space-y-1">
                <p className="font-medium text-brand-900">Próximo melhor passo</p>
                <p className="text-sm text-brand-800">
                  Complete nome, tipo, Wi-Fi e pelo menos um contato para sair do cadastro com um guia realmente utilizável.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Etapa {currentStep + 1} de {steps.length}: <span className="font-medium text-foreground">{steps[currentStep].label}</span>
          </span>
          <span className="text-muted-foreground">{completionStatus.progress}% completo</span>
        </div>
        <Progress value={completionStatus.progress} className="h-2" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stepper */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {steps.map((step, i) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(i)}
                className={cn(
                  'flex items-center gap-2 shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  i === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : i < currentStep
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                <span className="h-5 w-5 rounded-full flex items-center justify-center text-xs shrink-0 bg-white/20">
                  {i < currentStep ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            ))}
          </div>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                {(() => {
                  const Icon = steps[currentStep].icon
                  return <Icon className="h-5 w-5 text-primary" />
                })()}
                <h2 className="font-semibold text-lg">{steps[currentStep].label}</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6">{steps[currentStep].description}</p>
              {children}
            </CardContent>
          </Card>

          {/* Actions - Desktop */}
          <div className="hidden lg:flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={onPrevious}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              {onSaveDraft && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSaveDraft}
                  disabled={isSavingDraft || !propertyName}
                  className="text-muted-foreground"
                >
                  {isSavingDraft ? 'Salvando...' : 'Salvar rascunho'}
                </Button>
              )}
            </div>
            {!isLastStep ? (
              <Button onClick={onNext} className="gap-2">
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={onSubmit} disabled={isLoading} className="gap-2">
                <Save className="h-4 w-4" />
                {isLoading ? 'Salvando...' : submitLabel}
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar - Summary */}
        <div className="space-y-6">
          <Card className="shadow-card sticky top-24 z-20">
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm mb-4">{summaryTitle}</h3>
              <div className="space-y-2">
                {completionStatus.checks.map((check) => (
                  <button
                    key={check.label}
                    onClick={() => setCurrentStep(check.step)}
                    className={cn(
                      'flex items-center gap-2 w-full text-left text-sm py-1.5 px-2 rounded-md transition-colors',
                      check.filled ? 'text-foreground' : 'text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {check.filled ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <span className={cn(!check.filled && 'line-through opacity-60')}>
                      {check.label}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completude</span>
                  <span className="font-semibold">{completionStatus.progress}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {showPreview && showPreviewCard && (
            <Card className="shadow-card border-primary/20">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">Preview do guia</h3>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 p-4 space-y-3">
                  <div>
                    <p className="font-heading text-lg font-bold text-foreground">
                      {propertyName || 'Nome do imóvel'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {propertyCity ? `${propertyCity}${propertyState ? `, ${propertyState}` : ''}` : 'Cidade, Estado'}
                    </p>
                  </div>
                  {welcomeMessage && (
                    <p className="text-sm text-muted-foreground italic line-clamp-3">
                      &ldquo;{welcomeMessage}&rdquo;
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    {checkInTime && (
                      <div className="rounded-md bg-background/80 p-2 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Check-in</p>
                        <p className="text-sm font-semibold">{checkInTime}</p>
                      </div>
                    )}
                    {checkOutTime && (
                      <div className="rounded-md bg-background/80 p-2 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Check-out</p>
                        <p className="text-sm font-semibold">{checkOutTime}</p>
                      </div>
                    )}
                    {wifiNetwork && (
                      <div className="rounded-md bg-background/80 p-2 text-center col-span-2">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Wi-Fi</p>
                        <p className="text-sm font-semibold">{wifiNetwork}</p>
                      </div>
                    )}
                  </div>
                  {contactsCount > 0 && (
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Contatos</p>
                      {contacts.slice(0, 2).map((c, i) => (
                        <p key={i} className="text-sm">{c.name} <span className="text-xs text-muted-foreground">({c.role})</span></p>
                      ))}
                      {contactsCount > 2 && (
                        <p className="text-xs text-muted-foreground">+{contactsCount - 2} mais</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Sticky Actions - Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t p-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={currentStep === 0}
            className="flex-1 gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          {onSaveDraft && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSaveDraft}
              disabled={isSavingDraft || !propertyName}
              className="text-muted-foreground px-2"
            >
              Rascunho
            </Button>
          )}
          {!isLastStep ? (
            <Button onClick={onNext} className="flex-1 gap-2">
              Próximo
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={onSubmit} disabled={isLoading} className="flex-1 gap-2">
              <Save className="h-4 w-4" />
              {isLoading ? 'Salvando...' : submitLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Spacer for sticky mobile actions */}
      <div className="lg:hidden h-20" />
    </div>
  )
}
