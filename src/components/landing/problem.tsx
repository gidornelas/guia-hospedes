import { BarChart3, Clock, MessageCircle, Shield, Smartphone } from 'lucide-react'

const problems = [
  {
    icon: Clock,
    title: 'Toda reserva, a mesma mensagem',
    desc: 'Voce digita as instrucoes manualmente a cada check-in e perde tempo em repeticao.',
  },
  {
    icon: MessageCircle,
    title: 'O Wi-Fi ficou para depois?',
    desc: 'Informacoes importantes somem no meio da correria e viram nova mensagem de suporte.',
  },
  {
    icon: Shield,
    title: 'Cada imovel com um formato diferente',
    desc: 'Sem padronizacao, a experiencia muda demais entre imoveis e entre pessoas da equipe.',
  },
  {
    icon: Smartphone,
    title: 'O hospede pergunta sempre as mesmas coisas',
    desc: 'Endereco, acesso, regras e contatos voltam como duvida toda semana.',
  },
  {
    icon: BarChart3,
    title: 'Sem controle do que foi enviado',
    desc: 'Fica dificil saber o que foi publicado, compartilhado ou revisado antes da chegada.',
  },
]

export function LandingProblem() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            O problema atual
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Voce ainda manda instrucoes manualmente?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Muitos gestores ainda gastam energia repetindo as mesmas orientacoes para cada hospede e cada reserva.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-background p-6 shadow-card">
              <item.icon className="mb-4 h-8 w-8 text-destructive" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
