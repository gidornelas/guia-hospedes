const benefits = [
  { value: '90%', label: 'Menos tempo em instrucoes', desc: 'Automatize o que hoje ainda nasce em conversa manual.' },
  { value: '100%', label: 'Padronizacao', desc: 'Mesma clareza e mesma qualidade em todos os seus imoveis.' },
  { value: '5x', label: 'Mais profissionalismo', desc: 'Uma experiencia mais premium para o hospede e para a operacao.' },
  { value: '24/7', label: 'Controle centralizado', desc: 'Saiba o que foi publicado, revisado e compartilhado.' },
]

export function LandingBenefits() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="grid gap-6 sm:grid-cols-2">
              {benefits.map((item) => (
                <div key={item.label} className="rounded-2xl border border-border bg-background p-6 shadow-card">
                  <p className="text-3xl font-bold text-primary">{item.value}</p>
                  <p className="mt-2 font-semibold text-foreground">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Beneficios
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Beneficios que aparecem na rotina
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Nao e so sobre economizar tempo. E sobre entregar uma experiencia mais consistente, profissional e memoravel para cada hospede, em cada imovel.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
