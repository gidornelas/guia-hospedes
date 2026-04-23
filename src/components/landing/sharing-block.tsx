import { Mail, MessageCircle, QrCode } from 'lucide-react'

export function LandingSharing() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Compartilhamento
              </span>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Um link. Um clique.
                <br />
                <span className="text-primary">O hóspede recebe tudo.</span>
              </h2>
              <p className="text-lg leading-8 text-muted-foreground">
                Compartilhe o guia no canal que mais faz sentido para a reserva. WhatsApp, e-mail, link direto ou QR Code, sempre com acesso imediato no celular.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-background p-4 shadow-card">
                <MessageCircle className="h-8 w-8 text-green-500" />
                <p className="mt-3 font-semibold text-foreground">WhatsApp</p>
                <p className="mt-1 text-sm text-muted-foreground">Mensagem pronta para envio</p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-4 shadow-card">
                <Mail className="h-8 w-8 text-blue-500" />
                <p className="mt-3 font-semibold text-foreground">E-mail</p>
                <p className="mt-1 text-sm text-muted-foreground">Template mais formal</p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-4 shadow-card">
                <QrCode className="h-8 w-8 text-primary" />
                <p className="mt-3 font-semibold text-foreground">QR Code</p>
                <p className="mt-1 text-sm text-muted-foreground">Ideal para recepção e impresso</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-border/70 bg-card p-4 shadow-elevated">
              <div className="space-y-3 rounded-[1.5rem] border border-green-500/20 bg-green-500/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">WhatsApp</p>
                    <p className="text-xs text-muted-foreground">Agora</p>
                  </div>
                </div>
                <div className="space-y-2 rounded-2xl bg-background p-4 text-sm leading-6">
                  <p>Olá, Maria.</p>
                  <p>Seu guia digital da estadia já está pronto:</p>
                  <p className="text-primary underline underline-offset-4">
                    guiahospedes.com/g/flat-elegance...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Wi-Fi, check-in, regras e dicas locais em um só lugar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
