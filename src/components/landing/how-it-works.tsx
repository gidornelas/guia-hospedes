const steps = [
  {
    step: '01',
    title: 'Cadastre o imovel',
    desc: 'Preencha check-in, Wi-Fi, regras, equipamentos, contatos e dicas locais em um fluxo estruturado.',
  },
  {
    step: '02',
    title: 'Revise e publique',
    desc: 'O guia ganha forma automaticamente, com preview real para validar antes de colocar no ar.',
  },
  {
    step: '03',
    title: 'Compartilhe com o hospede',
    desc: 'Envie por WhatsApp, e-mail, link ou QR Code. O hospede acessa tudo no celular, sem instalar nada.',
  },
]

export function LandingHowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-24 bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Como funciona
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tres passos simples para colocar o guia na operacao
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            O fluxo foi desenhado para reduzir atrito na criacao, dar seguranca na publicacao e acelerar o envio ao hospede.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((item) => (
            <div
              key={item.step}
              className="relative rounded-2xl border border-border/70 bg-background p-8 text-center shadow-card"
            >
              <div className="absolute -top-4 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm">
                {item.step}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
