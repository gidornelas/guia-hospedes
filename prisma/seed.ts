import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Limpa dados existentes
  await prisma.syncLog.deleteMany()
  await prisma.airbnbPropertyMapping.deleteMany()
  await prisma.airbnbConnection.deleteMany()
  await prisma.integration.deleteMany()
  await prisma.messageTemplate.deleteMany()
  await prisma.shareLog.deleteMany()
  await prisma.guideVersion.deleteMany()
  await prisma.guide.deleteMany()
  await prisma.passwordResetToken.deleteMany()
  await prisma.propertyMedia.deleteMany()
  await prisma.propertyLink.deleteMany()
  await prisma.localRecommendation.deleteMany()
  await prisma.propertyContact.deleteMany()
  await prisma.propertyDevice.deleteMany()
  await prisma.propertyRules.deleteMany()
  await prisma.propertyWiFi.deleteMany()
  await prisma.propertyCheckOut.deleteMany()
  await prisma.propertyCheckIn.deleteMany()
  await prisma.property.deleteMany()
  await prisma.user.deleteMany()
  await prisma.organization.deleteMany()

  // Organizações
  const orgGuiaHospedes = await prisma.organization.create({
    data: {
      name: 'GuiaHóspedes',
      slug: 'guiahospedes',
      domain: 'guia.guiahospedes.com',
      brandSettings: JSON.stringify({
        primaryColor: '#059669',
        logo: '/logo.svg',
        font: 'DM Sans',
      }),
    },
  })

  const orgHostPremium = await prisma.organization.create({
    data: {
      name: 'Host Premium',
      slug: 'host-premium',
      domain: 'guia.hostpremium.com',
      brandSettings: JSON.stringify({
        primaryColor: '#0f172a',
        logo: '/logo-hp.svg',
        font: 'Inter',
      }),
    },
  })

  console.log('✅ Organizações criadas')

  console.log('ℹ️ Seed sem usuários demo: use cadastro real ou login com Google')

  // Imóveis
  const properties = await Promise.all([
    prisma.property.create({
      data: {
        name: 'Flat Elegance Paulista',
        internalCode: 'FEP-001',
        type: 'APARTMENT',
        address: 'Av. Paulista, 1000, Apto 1502',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil',
        welcomeMessage: 'Seja muito bem-vindo ao Flat Elegance Paulista! Esperamos que sua estadia seja incrível.',
        shortDescription: 'Apartamento sofisticado na Av. Paulista com vista panorâmica.',
        organizationId: orgGuiaHospedes.id,
        slug: 'flat-elegance-paulista',
        status: 'ACTIVE',
        coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      },
    }),
    prisma.property.create({
      data: {
        name: 'Casa do Lago',
        internalCode: 'CDL-002',
        type: 'HOUSE',
        address: 'Rua das Flores, 45, Lagoa da Conceição',
        city: 'Florianópolis',
        state: 'SC',
        country: 'Brasil',
        welcomeMessage: 'Bem-vindo à Casa do Lago! Aproveite a tranquilidade e a natureza.',
        shortDescription: 'Casa aconchegante próxima à Lagoa da Conceição.',
        organizationId: orgGuiaHospedes.id,
        slug: 'casa-do-lago',
        status: 'ACTIVE',
        coverImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800',
      },
    }),
    prisma.property.create({
      data: {
        name: 'Chalé Monte Verde',
        internalCode: 'CMV-003',
        type: 'CHALET',
        address: 'Estrada da Montanha, KM 12',
        city: 'Monte Verde',
        state: 'MG',
        country: 'Brasil',
        welcomeMessage: 'Bem-vindo ao Chalé Monte Verde! Aconchego e charme nas montanhas.',
        shortDescription: 'Chalé romântico com lareira e vista para as montanhas.',
        organizationId: orgGuiaHospedes.id,
        slug: 'chale-monte-verde',
        status: 'ACTIVE',
        coverImage: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800',
      },
    }),
    prisma.property.create({
      data: {
        name: 'Apt Copa Beach',
        internalCode: 'ACB-004',
        type: 'APARTMENT',
        address: 'Av. Nossa Senhora de Copacabana, 500, Apto 302',
        city: 'Rio de Janeiro',
        state: 'RJ',
        country: 'Brasil',
        welcomeMessage: 'Seja bem-vindo ao Apt Copa Beach! A praia está a poucos passos.',
        shortDescription: 'Apartamento moderno a 2 minutos da praia de Copacabana.',
        organizationId: orgGuiaHospedes.id,
        slug: 'apt-copa-beach',
        status: 'ACTIVE',
        coverImage: 'https://images.unsplash.com/photo-1512918760513-95f1928756a7?w=800',
      },
    }),
    prisma.property.create({
      data: {
        name: 'Sítio Paraíso',
        internalCode: 'SP-005',
        type: 'FARM',
        address: 'Estrada do Sítio, S/N, Zona Rural',
        city: 'Belo Horizonte',
        state: 'MG',
        country: 'Brasil',
        welcomeMessage: 'Bem-vindo ao Sítio Paraíso! Desconecte e aproveite a natureza.',
        shortDescription: 'Sítio com piscina, churrasqueira e área verde ampla.',
        organizationId: orgHostPremium.id,
        slug: 'sitio-paraiso',
        status: 'DRAFT',
        coverImage: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800',
      },
    }),
  ])

  console.log('✅ Imóveis criados')

  // Check-in, Check-out, Wi-Fi, Regras para cada imóvel
  for (const property of properties) {
    await prisma.propertyCheckIn.create({
      data: {
        propertyId: property.id,
        time: '15:00',
        instructions: 'O check-in é feito de forma autônoma. Você receberá o código da fechadura digital por mensagem.',
        accessMethod: 'Fechadura digital',
        notes: 'Em caso de dúvidas, entre em contato pelo WhatsApp.',
      },
    })

    await prisma.propertyCheckOut.create({
      data: {
        propertyId: property.id,
        time: '11:00',
        instructions: 'Deixe as chaves na mesa da sala e feche a porta. Não é necessário encontrar o anfitrião.',
        exitChecklist: 'Desligue ar-condicionado e luzes. Feche janelas. Deixe lixo no container externo.',
      },
    })

    await prisma.propertyWiFi.create({
      data: {
        propertyId: property.id,
        networkName: `${property.name.replace(/\s+/g, '')}_WiFi`,
        password: Math.random().toString(36).substring(2, 10),
        notes: 'Wi-Fi de alta velocidade 300Mbps. Senha disponível no app.',
      },
    })

    await prisma.propertyRules.create({
      data: {
        propertyId: property.id,
        silence: 'Silêncio entre 22h e 8h. Respeite os vizinhos.',
        visits: 'Visitas permitidas até 22h. Informe com antecedência.',
        pets: property.type === 'FARM',
        smoking: false,
        parties: false,
        trash: 'Separe o lixo reciclável. Coleta às terças e quintas.',
        equipmentUse: 'Utilize os equipamentos com cuidado. Desligue quando não estiver usando.',
        notes: 'O imóvel é monitorado por câmeras externas para segurança.',
      },
    })

    // Dispositivos
    await prisma.propertyDevice.createMany({
      data: [
        { propertyId: property.id, name: 'Ar-condicionado', type: 'AC', instructions: 'Use o controle remoto. Temperatura ideal: 23°C.', brand: 'LG' },
        { propertyId: property.id, name: 'TV Smart', type: 'TV', instructions: 'Netflix e YouTube disponíveis. Login salvo.', brand: 'Samsung' },
        { propertyId: property.id, name: 'Fechadura Digital', type: 'LOCK', instructions: 'Digite o código e pressione #. Toque para trancar ao sair.', brand: 'Yale' },
        { propertyId: property.id, name: 'Chuveiro Elétrico', type: 'SHOWER', instructions: 'Ligue o disjuntor antes de usar. Não misture água quente com fria simultaneamente.', brand: 'Lorenzetti' },
      ],
    })

    // Contatos
    await prisma.propertyContact.createMany({
      data: [
        { propertyId: property.id, name: 'João Silva', role: 'HOST', phone: '(11) 98765-4321', email: 'joao@guiahospedes.com', whatsapp: '5511987654321' },
        { propertyId: property.id, name: 'Suporte 24h', role: 'SUPPORT', phone: '(11) 3000-1234', email: 'suporte@guiahospedes.com', whatsapp: '551130001234' },
        { propertyId: property.id, name: 'Manutenção', role: 'MAINTENANCE', phone: '(11) 98765-0000', email: 'manutencao@guiahospedes.com' },
      ],
    })

    // Recomendações locais
    await prisma.localRecommendation.createMany({
      data: [
        { propertyId: property.id, name: 'Restaurante Bom Sabor', category: 'RESTAURANT', description: 'Comida caseira de excelente qualidade. Prato do dia a R$ 35.', link: 'https://maps.google.com', distance: '500m' },
        { propertyId: property.id, name: 'Café Central', category: 'CAFE', description: 'Café artesanal e pães frescos todos os dias.', link: 'https://maps.google.com', distance: '200m' },
        { propertyId: property.id, name: 'Supermercado Plus', category: 'MARKET', description: 'Aberto 24h. Delivery disponível.', link: 'https://maps.google.com', distance: '800m' },
        { propertyId: property.id, name: 'Farmácia Popular', category: 'PHARMACY', description: 'Farmácia 24h com delivery.', link: 'https://maps.google.com', distance: '300m' },
      ],
    })

    // Links
    await prisma.propertyLink.createMany({
      data: [
        { propertyId: property.id, label: 'Localização no Maps', url: 'https://maps.google.com', type: 'GOOGLE_MAPS' },
        { propertyId: property.id, label: 'WhatsApp do Anfitrião', url: 'https://wa.me/5511987654321', type: 'WHATSAPP' },
        { propertyId: property.id, label: 'Instagram', url: 'https://instagram.com/guiahospedes', type: 'INSTAGRAM' },
      ],
    })
  }

  console.log('✅ Detalhes dos imóveis criados')

  // Guias
  const guides = await Promise.all([
    prisma.guide.create({
      data: {
        propertyId: properties[0].id,
        status: 'PUBLISHED',
        slug: `guia-${properties[0].slug}`,
        version: 1,
        publishedAt: new Date(),
      },
    }),
    prisma.guide.create({
      data: {
        propertyId: properties[1].id,
        status: 'PUBLISHED',
        slug: `guia-${properties[1].slug}`,
        version: 2,
        publishedAt: new Date(),
      },
    }),
    prisma.guide.create({
      data: {
        propertyId: properties[2].id,
        status: 'DRAFT',
        slug: `guia-${properties[2].slug}`,
        version: 1,
      },
    }),
    prisma.guide.create({
      data: {
        propertyId: properties[3].id,
        status: 'REVIEW',
        slug: `guia-${properties[3].slug}`,
        version: 1,
      },
    }),
    prisma.guide.create({
      data: {
        propertyId: properties[4].id,
        status: 'UNPUBLISHED',
        slug: `guia-${properties[4].slug}`,
        version: 1,
        publishedAt: new Date('2024-01-01'),
      },
    }),
  ])

  console.log('✅ Guias criados')

  // Templates de mensagem
  await prisma.messageTemplate.createMany({
    data: [
      {
        organizationId: orgGuiaHospedes.id,
        type: 'WELCOME',
        name: 'Boas-vindas',
        subject: 'Seja bem-vindo ao {{propertyName}}!',
        body: 'Olá {{guestName}}!\n\nSeja muito bem-vindo ao {{propertyName}}. Estamos felizes em recebê-lo!\n\nSeu guia digital está pronto: {{guideLink}}\n\nQualquer dúvida, estamos à disposição.',
        variables: JSON.stringify(['guestName', 'propertyName', 'guideLink']),
      },
      {
        organizationId: orgGuiaHospedes.id,
        type: 'PRE_CHECKIN',
        name: 'Pré-check-in',
        subject: 'Seu check-in no {{propertyName}} amanhã',
        body: 'Olá {{guestName}}!\n\nSeu check-in no {{propertyName}} é amanhã. Preparamos um guia digital completo para você:\n\n{{guideLink}}\n\nAcesse pelo celular para ter todas as informações na palma da mão.',
        variables: JSON.stringify(['guestName', 'propertyName', 'guideLink']),
      },
      {
        organizationId: orgGuiaHospedes.id,
        type: 'DURING_STAY',
        name: 'Durante a estadia',
        subject: 'Como está sua estadia no {{propertyName}}?',
        body: 'Olá {{guestName}}!\n\nEsperamos que esteja aproveitando sua estadia no {{propertyName}}.\n\nCaso precise de algo, seu guia digital está aqui: {{guideLink}}\n\nOu entre em contato pelo WhatsApp.',
        variables: JSON.stringify(['guestName', 'propertyName', 'guideLink']),
      },
      {
        organizationId: orgGuiaHospedes.id,
        type: 'POST_CHECKOUT',
        name: 'Pós-check-out',
        subject: 'Obrigado por se hospedar no {{propertyName}}',
        body: 'Olá {{guestName}}!\n\nAgradecemos por se hospedar no {{propertyName}}. Esperamos que tenha tido uma experiência incrível!\n\nSe puder, deixe uma avaliação. Sua opinião é muito importante.',
        variables: JSON.stringify(['guestName', 'propertyName']),
      },
    ],
  })

  console.log('✅ Templates de mensagem criados')

  // Logs de compartilhamento
  await prisma.shareLog.createMany({
    data: [
      { guideId: guides[0].id, channel: 'WHATSAPP', recipient: '11987654321', status: 'SENT', message: 'Olá! Seu guia está pronto: ...' },
      { guideId: guides[0].id, channel: 'EMAIL', recipient: 'hospede@email.com', status: 'SENT', message: 'Seja bem-vindo!' },
      { guideId: guides[0].id, channel: 'LINK', recipient: null, status: 'SENT' },
      { guideId: guides[1].id, channel: 'WHATSAPP', recipient: '11999998888', status: 'SENT' },
      { guideId: guides[1].id, channel: 'QR', recipient: null, status: 'SENT' },
    ],
  })

  console.log('✅ Logs de compartilhamento criados')

  // Integrações
  const airbnbIntegration = await prisma.integration.create({
    data: {
      organizationId: orgGuiaHospedes.id,
      provider: 'AIRBNB',
      config: JSON.stringify({
        icalEnabled: true,
        autoSync: false,
      }),
      status: 'CONNECTED',
      connectedAt: new Date(),
    },
  })

  await prisma.airbnbConnection.create({
    data: {
      integrationId: airbnbIntegration.id,
      icalUrl: 'https://www.airbnb.com/calendar/ical/123456.ics',
      listingId: '123456',
      listingName: 'Flat Elegance Paulista - Airbnb',
      lastSyncAt: new Date(),
      status: 'SYNCED',
    },
  })

  // Logs de sincronização
  await prisma.syncLog.createMany({
    data: [
      { integrationId: airbnbIntegration.id, type: 'ICAL_IMPORT', status: 'SUCCESS', details: JSON.stringify({ imported: 12, updated: 3 }) },
      { integrationId: airbnbIntegration.id, type: 'MANUAL', status: 'SUCCESS', details: JSON.stringify({ action: 'refresh' }) },
    ],
  })

  console.log('✅ Integrações e logs criados')

  console.log('\n🎉 Seed concluído com sucesso!')
  console.log('   • 0 usuarios de login pre-criados')
  console.log(`   • ${5} imóveis`)
  console.log(`   • ${5} guias`)
  console.log(`   • ${4} templates de mensagem`)
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
