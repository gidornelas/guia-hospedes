/**
 * Configuração de ambiente — leitura direta de process.env
 *
 * Desenvolvimento: variáveis do arquivo .env local (gitignored)
 * Produção: variáveis configuradas no dashboard da plataforma de deploy (Vercel, Railway, etc.)
 *
 * Nunca faça commit do arquivo .env. Use .env.example como template.
 */

interface EnvConfig {
  databaseUrl: string
  nextauthUrl: string
  nextauthSecret: string
  smtpHost: string
  smtpPort: string
  smtpUser: string
  smtpPass: string
  emailFrom: string
  appUrl: string
  appName: string
  storageProvider: string
  airbnbIcalEnabled: string
  whatsappBusinessAccountId: string
  whatsappPhoneNumberId: string
  whatsappAccessToken: string
  redisUrl: string
}

function loadEnv(): EnvConfig {
  return {
    databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
    nextauthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    nextauthSecret: process.env.NEXTAUTH_SECRET || 'dev-secret-change-in-production',
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: process.env.SMTP_PORT || '587',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    emailFrom: process.env.EMAIL_FROM || 'noreply@guiahospedes.com',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'GuiaHóspedes',
    storageProvider: process.env.STORAGE_PROVIDER || 'local',
    airbnbIcalEnabled: process.env.AIRBNB_ICAL_ENABLED || 'true',
    whatsappBusinessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
    whatsappPhoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    whatsappAccessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
    redisUrl: process.env.REDIS_URL || '',
  }
}

const env = loadEnv()

export { env }
export type { EnvConfig }
