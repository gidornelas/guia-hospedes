import { db } from '@/lib/db'
import SettingsClient from './settings-client'

export default async function SettingsPage() {
  const organization = await db.organization.findFirst()

  if (!organization) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Nenhuma organização encontrada. Execute o seed primeiro.
          </p>
        </div>
      </div>
    )
  }

  return <SettingsClient organization={organization} />
}
