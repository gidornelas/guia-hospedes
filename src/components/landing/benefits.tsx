const benefits = [
  { value: '90%', label: 'Menos tempo em instruções', desc: 'Automatize o que hoje ainda nasce em conversa manual.' },
  { value: '100%', label: 'Padronização', desc: 'Mesma clareza e mesma qualidade em todos os seus imóveis.' },
  { value: '5x', label: 'Mais profissionalismo', desc: 'Uma experiência mais premium para o hóspede e para a operação.' },
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
              Benefícios
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Benefícios que aparecem na rotina
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Não é só sobre economizar tempo. É sobre entregar uma experiência mais consistente, profissional e memorável para cada hóspede, em cada imóvel.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
