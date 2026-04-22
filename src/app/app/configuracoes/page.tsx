import { AlertTriangle, Settings } from 'lucide-react'
import { db } from '@/lib/db'
import { EmptyState } from '@/components/shared/empty-state'
import SettingsClient from './settings-client'

export default async function SettingsPage() {
  const organization = await db.organization.findFirst()

  if (!organization) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={Settings}
          title="Nenhuma organização encontrada"
          description="As configurações ficam disponíveis assim que a organização base for criada. Sem isso, domínio, marca e mensagens ainda não podem ser gerenciados."
          hint="Execute o seed inicial para continuar"
          secondaryActionLabel="Voltar ao dashboard"
          secondaryActionHref="/app"
          className="min-h-[24rem]"
        />

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800">Pré-requisito</p>
              <p className="mt-1 text-xs text-amber-700">
                Depois de rodar o seed, esta tela passa a mostrar domínio,
                identidade visual, preferências de mensagens e dependências da
                operação.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <SettingsClient organization={organization} />
}
