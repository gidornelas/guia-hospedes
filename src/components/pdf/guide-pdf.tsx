import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import type {
  Property,
  PropertyCheckIn,
  PropertyCheckOut,
  PropertyContact,
  PropertyDevice,
  PropertyRules,
  PropertyWiFi,
  LocalRecommendation,
  PropertyLink,
} from '@prisma/client'
import { getDictionary } from '@/lib/i18n'
import { Locale } from '@/lib/i18n/types'
import { getPropertyTranslations, translateField, translatePath } from '@/lib/translate'

Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hiA.ttf',
      fontWeight: 600,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuBWYAZ9hiA.ttf',
      fontWeight: 700,
    },
  ],
})

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Inter',
    fontSize: 11,
    color: '#1f2937',
    lineHeight: 1.5,
  },
  cover: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 30,
    paddingBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
  },
  coverImage: {
    width: 240,
    height: 160,
    borderRadius: 12,
    marginBottom: 20,
    objectFit: 'cover',
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 16,
  },
  welcomeMessage: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#4b5563',
    maxWidth: 400,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontWeight: 600,
    color: '#374151',
  },
  value: {
    color: '#1f2937',
  },
  block: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  blockTitle: {
    fontWeight: 600,
    fontSize: 12,
    marginBottom: 4,
    color: '#111827',
  },
  blockText: {
    fontSize: 11,
    color: '#4b5563',
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#9ca3af',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
  },
  badge: {
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 9,
    fontWeight: 600,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
})

interface GuidePdfProps {
  property: Property & {
    checkIn: PropertyCheckIn | null
    checkOut: PropertyCheckOut | null
    wifi: PropertyWiFi | null
    rules: PropertyRules | null
    devices: PropertyDevice[]
    contacts: PropertyContact[]
    recommendations: LocalRecommendation[]
    links: PropertyLink[]
  }
  organizationName: string
  locale: Locale
}

export function GuidePdfDocument({ property, organizationName, locale }: GuidePdfProps) {
  const d = getDictionary(locale)
  const translations = getPropertyTranslations(property.translations, locale)
  const t = (path: string) => translatePath(translations, path)

  const welcomeMessage = translateField(property.welcomeMessage, translations.welcomeMessage)
  const shortDescription = translateField(property.shortDescription, translations.shortDescription)

  const rules = property.rules
  const checkInInstructions = translateField(property.checkIn?.instructions || null, t('checkIn.instructions'))
  const checkInAccess = translateField(property.checkIn?.accessMethod || null, t('checkIn.accessMethod'))
  const checkInNotes = translateField(property.checkIn?.notes || null, t('checkIn.notes'))
  const checkOutInstructions = translateField(property.checkOut?.instructions || null, t('checkOut.instructions'))
  const checkOutChecklist = translateField(property.checkOut?.exitChecklist || null, t('checkOut.exitChecklist'))
  const wifiNotes = translateField(property.wifi?.notes || null, t('wifi.notes'))
  const rulesSilence = translateField(rules?.silence || null, t('rules.silence'))
  const rulesVisits = translateField(rules?.visits || null, t('rules.visits'))
  const rulesTrash = translateField(rules?.trash || null, t('rules.trash'))
  const rulesEquipment = translateField(rules?.equipmentUse || null, t('rules.equipmentUse'))
  const rulesNotes = translateField(rules?.notes || null, t('rules.notes'))

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Capa */}
        <View style={styles.cover}>
          {property.coverImage ? (
            <Image src={property.coverImage} style={styles.coverImage} />
          ) : null}
          <Text style={styles.title}>{property.name}</Text>
          <Text style={styles.subtitle}>
            {property.city ? `${property.city}, ` : ''}
            {property.state ? `${property.state} - ` : ''}
            {property.country}
          </Text>
          {welcomeMessage ? (
            <Text style={styles.welcomeMessage}>{welcomeMessage}</Text>
          ) : null}
        </View>

        {/* Informações Gerais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{d.pdf.generalInfo}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>{d.pdf.type}:</Text>
            <Text style={styles.value}>{property.type}</Text>
          </View>
          {property.address && (
            <View style={styles.row}>
              <Text style={styles.label}>{d.checkIn.address}:</Text>
              <Text style={styles.value}>{property.address}</Text>
            </View>
          )}
          {property.internalCode && (
            <View style={styles.row}>
              <Text style={styles.label}>{d.pdf.internalCode}:</Text>
              <Text style={styles.value}>{property.internalCode}</Text>
            </View>
          )}
        </View>

        {/* Check-in & Check-out */}
        {(property.checkIn || property.checkOut) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{d.pdf.checkInCheckOut}</Text>
            {property.checkIn && (
              <View style={styles.block}>
                <Text style={styles.blockTitle}>{d.pdf.checkIn}</Text>
                {property.checkIn.time && (
                  <Text style={styles.blockText}>
                    {d.pdf.time}: {property.checkIn.time}
                  </Text>
                )}
                {checkInInstructions && (
                  <Text style={styles.blockText}>{checkInInstructions}</Text>
                )}
                {checkInAccess && (
                  <Text style={styles.blockText}>
                    {d.pdf.access}: {checkInAccess}
                  </Text>
                )}
                {checkInNotes && (
                  <Text style={styles.blockText}>{checkInNotes}</Text>
                )}
              </View>
            )}
            {property.checkOut && (
              <View style={styles.block}>
                <Text style={styles.blockTitle}>{d.pdf.checkOut}</Text>
                {property.checkOut.time && (
                  <Text style={styles.blockText}>
                    {d.pdf.time}: {property.checkOut.time}
                  </Text>
                )}
                {checkOutInstructions && (
                  <Text style={styles.blockText}>{checkOutInstructions}</Text>
                )}
                {checkOutChecklist && (
                  <Text style={styles.blockText}>
                    {d.checkOut.exitChecklist}: {checkOutChecklist}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* Wi-Fi */}
        {property.wifi && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{d.pdf.wifi}</Text>
            <View style={styles.block}>
              <View style={styles.row}>
                <Text style={styles.label}>{d.pdf.network}:</Text>
                <Text style={styles.value}>{property.wifi.networkName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{d.pdf.password}:</Text>
                <Text style={styles.value}>{property.wifi.password}</Text>
              </View>
              {wifiNotes && (
                <Text style={styles.blockText}>{wifiNotes}</Text>
              )}
            </View>
          </View>
        )}

        {/* Regras */}
        {rules && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{d.pdf.rules}</Text>
            {rulesSilence && (
              <Text style={styles.blockText}>{d.rules.silenceLabel}: {rulesSilence}</Text>
            )}
            {rulesVisits && (
              <Text style={styles.blockText}>{d.rules.visitsLabel}: {rulesVisits}</Text>
            )}
            {rules.pets && (
              <Text style={styles.blockText}>{d.rules.petsWelcomeDesc}</Text>
            )}
            {!rules.pets && rules.pets !== null && (
              <Text style={styles.blockText}>{d.rules.noPetsDesc}</Text>
            )}
            {rules.smoking && (
              <Text style={styles.blockText}>{d.rules.smokingAllowedDesc}</Text>
            )}
            {!rules.smoking && rules.smoking !== null && (
              <Text style={styles.blockText}>{d.rules.noSmokingDesc}</Text>
            )}
            {rules.parties && (
              <Text style={styles.blockText}>{d.rules.eventsAllowedDesc}</Text>
            )}
            {!rules.parties && rules.parties !== null && (
              <Text style={styles.blockText}>{d.rules.noEventsDesc}</Text>
            )}
            {rulesTrash && (
              <Text style={styles.blockText}>{rulesTrash}</Text>
            )}
            {rulesEquipment && (
              <Text style={styles.blockText}>
                {d.rules.equipmentCare}: {rulesEquipment}
              </Text>
            )}
            {rulesNotes && (
              <Text style={styles.blockText}>{rulesNotes}</Text>
            )}
          </View>
        )}

        {/* Contatos */}
        {property.contacts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{d.pdf.contacts}</Text>
            <View style={styles.grid2}>
              {property.contacts.map((contact) => {
                const contactTranslations = translations.contacts?.[contact.id]
                const contactName = translateField(contact.name, contactTranslations?.name)
                return (
                  <View key={contact.id} style={styles.gridItem}>
                    <Text style={styles.blockTitle}>{contactName}</Text>
                    <Text style={[styles.blockText, { textTransform: 'capitalize' }]}>
                      {contact.role.toLowerCase()}
                    </Text>
                    {contact.phone && (
                      <Text style={styles.blockText}>{d.pdf.phone}: {contact.phone}</Text>
                    )}
                    {contact.email && (
                      <Text style={styles.blockText}>Email: {contact.email}</Text>
                    )}
                    {contact.whatsapp && (
                      <Text style={styles.blockText}>WhatsApp: {contact.whatsapp}</Text>
                    )}
                  </View>
                )
              })}
            </View>
          </View>
        )}

        {/* Equipamentos */}
        {property.devices.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{d.pdf.devices}</Text>
            <View style={styles.grid2}>
              {property.devices.map((device) => {
                const deviceTranslations = translations.devices?.[device.id]
                const deviceName = translateField(device.name, deviceTranslations?.name)
                const deviceInstructions = translateField(device.instructions, deviceTranslations?.instructions)
                return (
                  <View key={device.id} style={styles.gridItem}>
                    <Text style={styles.blockTitle}>{deviceName}</Text>
                    <Text style={styles.badge}>{device.type}</Text>
                    {device.brand && (
                      <Text style={styles.blockText}>{d.devices.brand}: {device.brand}</Text>
                    )}
                    {deviceInstructions && (
                      <Text style={styles.blockText}>{deviceInstructions}</Text>
                    )}
                  </View>
                )
              })}
            </View>
          </View>
        )}

        {/* Dicas da Região */}
        {property.recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{d.pdf.tips}</Text>
            {property.recommendations.map((rec) => {
              const recTranslations = translations.recommendations?.[rec.id]
              const recName = translateField(rec.name, recTranslations?.name)
              const recDescription = translateField(rec.description, recTranslations?.description)
              return (
                <View key={rec.id} style={styles.block}>
                  <Text style={styles.blockTitle}>{recName}</Text>
                  <Text style={styles.badge}>{rec.category}</Text>
                  {recDescription && (
                    <Text style={styles.blockText}>{recDescription}</Text>
                  )}
                  {rec.address && (
                    <Text style={styles.blockText}>{rec.address}</Text>
                  )}
                  {rec.distance && (
                    <Text style={styles.blockText}>{d.pdf.distance}: {rec.distance}</Text>
                  )}
                </View>
              )
            })}
          </View>
        )}

        {/* Links Úteis */}
        {property.links.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{d.pdf.usefulLinks}</Text>
            {property.links.map((link) => {
              const linkTranslations = translations.links?.[link.id]
              const linkLabel = translateField(link.label, linkTranslations?.label)
              return (
                <View key={link.id} style={styles.block}>
                  <Text style={styles.blockTitle}>{linkLabel}</Text>
                  <Text style={styles.blockText}>{link.url}</Text>
                </View>
              )
            })}
          </View>
        )}

        {/* Rodapé */}
        <Text style={styles.footer}>
          {d.pdf.footer.replace('{organizationName}', organizationName)}
        </Text>
      </Page>
    </Document>
  )
}
