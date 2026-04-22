import { Building, Hotel, House } from 'lucide-react'

const audiences = [
  {
    title: 'Anfitrioes do Airbnb',
    desc: 'Automatize as boas-vindas e pare de repetir as mesmas orientacoes em toda reserva.',
    icon: House,
  },
  {
    title: 'Gestores de imoveis',
    desc: 'Padronize a experiencia em varios imoveis com guias profissionais e centralizados.',
    icon: Building,
  },
  {
    title: 'Operacoes de hospedagem',
    desc: 'Reduza perguntas repetidas e ganhe escala sem sacrificar clareza nem qualidade.',
    icon: Hotel,
  },
]

export function LandingAudience() {
  return (
    <section className="bg-gradient-brand-soft py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Para quem e
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Feito para quem recebe hospedes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Do anfitriao individual a operacoes com multiplos imoveis e equipe.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {audiences.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-background p-8 text-center shadow-card">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
