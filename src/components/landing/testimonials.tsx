import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Ana Paula R.',
    role: 'Gestora de 12 imoveis',
    text: 'Economizo horas toda semana. Antes eu enviava tudo manualmente; agora virou um fluxo organizado e muito mais profissional.',
  },
  {
    name: 'Ricardo M.',
    role: 'Anfitriao Airbnb',
    text: 'O preview me da seguranca antes de publicar. O hospede recebe tudo pronto e eu deixo de responder as mesmas perguntas toda hora.',
  },
  {
    name: 'Juliana F.',
    role: 'Operadora de hospedagem',
    text: 'Padronizamos a experiencia em varios imoveis sem perder agilidade. A equipe entende o proximo passo e o hospede percebe a diferenca.',
  },
]

export function LandingTestimonials() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Prova social
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            O que gestores e anfitrioes querem ganhar com isso
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-border/70 bg-background p-6 shadow-card"
            >
              <div className="mb-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="mb-4 text-sm leading-7 text-muted-foreground">&quot;{item.text}&quot;</p>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
