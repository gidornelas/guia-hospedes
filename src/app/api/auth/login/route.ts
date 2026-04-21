import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { createSessionToken, setSessionCookie } from '@/lib/session'

// Usuários de demonstração (mesmos do auth.ts anterior)
const DEMO_USERS = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@guiahospedes.com',
    password: 'senha123',
    role: 'ADMIN',
    organizationId: 'org-1',
    organizationName: 'GuiaHóspedes',
    image: null,
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@exemplo.com',
    password: 'senha123',
    role: 'MANAGER',
    organizationId: 'org-1',
    organizationName: 'GuiaHóspedes',
    image: null,
  },
  {
    id: '3',
    name: 'Carlos Lima',
    email: 'carlos@exemplo.com',
    password: 'senha123',
    role: 'HOST',
    organizationId: 'org-2',
    organizationName: 'Host Premium',
    image: null,
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-mail e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Tenta buscar do banco primeiro
    let user = null
    try {
      const dbUser = await db.user.findUnique({
        where: { email },
        include: { organization: true },
      })

      if (dbUser) {
        const isValid = await bcrypt.compare(password, dbUser.password)
        if (isValid) {
          user = {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
            organizationId: dbUser.organizationId,
            organizationName: dbUser.organization.name,
            image: dbUser.image,
          }
        }
      }
    } catch {
      // Banco não disponível, usa fallback
    }

    // Fallback para usuários de demonstração
    if (!user) {
      const demoUser = DEMO_USERS.find((u) => u.email === email)
      if (demoUser && demoUser.password === password) {
        user = {
          id: demoUser.id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
          organizationId: demoUser.organizationId,
          organizationName: demoUser.organizationName,
          image: demoUser.image,
        }
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'E-mail ou senha incorretos' },
        { status: 401 }
      )
    }

    // Cria sessão JWT
    const token = await createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
      organizationName: user.organizationName,
      image: user.image,
    })

    await setSessionCookie(token)

    return NextResponse.json({ success: true, user: { name: user.name, email: user.email } })
  } catch (error) {
    console.error('[LOGIN ERROR]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
