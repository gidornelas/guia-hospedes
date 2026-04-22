import { CheckCircle } from 'lucide-react'

const airbnbFeatures = [
  'Sincronizacao de calendario via iCal',
  'Mapeamento entre imoveis internos e listings',
  'Logs detalhados de cada sincronizacao',
  'Arquitetura preparada para API oficial',
]

export function LandingAirbnb() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-elevated">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF5A5F] text-sm font-bold text-white">
                    air
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Airbnb</p>
                    <p className="text-xs text-muted-foreground">Integracao ativa</p>
                  </div>
                </div>
                <div className="flex h-6 items-center rounded-full bg-emerald-100 px-3 text-xs font-medium text-emerald-700">
                  Conectado
                </div>
              </div>

              <div className="space-y-3">
                {['Sincronizacao iCal', 'Mapeamento de imoveis', 'Logs de sincronizacao'].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="text-sm text-foreground">{item}</span>
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Integracao
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Conecte sua operacao
              <br />
              <span className="text-primary">ao Airbnb</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Sincronize dados com seu anuncio do Airbnb via iCal, vincule listings internos e externos e mantenha a operacao mais alinhada.
            </p>
            <div className="mt-8 space-y-4">
              {airbnbFeatures.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
