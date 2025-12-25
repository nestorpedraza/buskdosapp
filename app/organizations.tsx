import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppCard from '../components/AppCard';
import Header from '../components/Header';

type EntityType = 'juridica' | 'natural';

type OrganizationEntity =
  | {
    id: string;
    type: 'juridica';
    legalName: string;
    taxId: string;
    corporateEmail?: string;
    hqAddress?: string;
    logo: any;
  }
  | {
    id: string;
    type: 'natural';
    personalName: string;
    nationalId: string;
    logo: any;
  };

const organizations: OrganizationEntity[] = [
  {
    id: 'org-1',
    type: 'juridica',
    legalName: 'Inversiones Globales S.A.',
    taxId: 'NIT 901234567-8',
    corporateEmail: 'legal@inversionesglobales.com',
    hqAddress: 'Av. Libertad 123, Bogotá, Colombia',
    logo: require('../assets/images/buskados_vectorizado_200x200.png'),
  },
  {
    id: 'org-2',
    type: 'juridica',
    legalName: 'Tecnologías del Futuro S.A.C.',
    taxId: 'RUC 20567890123',
    corporateEmail: 'corporate@tecfuturo.com',
    hqAddress: 'Calle Innovación 456, Lima, Perú',
    logo: require('../assets/images/buskados_vectorizado_200x200.png'),
  },
  {
    id: 'org-3',
    type: 'juridica',
    legalName: 'Comercial Norteamérica LLC',
    taxId: 'EIN 12-3456789',
    corporateEmail: 'corp@comernorte.com',
    hqAddress: '5th Ave 789, New York, USA',
    logo: require('../assets/images/buskados_vectorizado_200x200.png'),
  },
  {
    id: 'org-4',
    type: 'natural',
    personalName: 'María Fernanda López',
    nationalId: 'DNI 45213876',
    logo: require('../assets/images/buskados_vectorizado_200x200.png'),
  },
  {
    id: 'org-5',
    type: 'natural',
    personalName: 'Juan Pérez',
    nationalId: 'Cédula 1.234.567.890',
    logo: require('../assets/images/buskados_vectorizado_200x200.png'),
  },
];

export default function OrganizationsScreen() {
  const [selectedType, setSelectedType] = React.useState<'all' | EntityType>('all');
  const filtered = React.useMemo(() => {
    if (selectedType === 'all') return organizations;
    return organizations.filter(o => o.type === selectedType);
  }, [selectedType]);

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <View style={styles.pageHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Organizaciones</Text>
            <Text style={styles.subtitle}>Entidad Padre y Profesionales independientes</Text>
          </View>
          <View style={styles.metrics}>
            <Text style={styles.metricsNumber}>{filtered.length}</Text>
            <Text style={styles.metricsLabel}>registros</Text>
          </View>
        </View>
        <View style={styles.segmented}>
          <TouchableOpacity
            style={[styles.segmentItem, selectedType === 'all' && styles.segmentItemActive]}
            onPress={() => setSelectedType('all')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, selectedType === 'all' && styles.segmentTextActive]}>Todas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentItem, selectedType === 'juridica' && styles.segmentItemActive]}
            onPress={() => setSelectedType('juridica')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, selectedType === 'juridica' && styles.segmentTextActive]}>Empresa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentItem, selectedType === 'natural' && styles.segmentItemActive]}
            onPress={() => setSelectedType('natural')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, selectedType === 'natural' && styles.segmentTextActive]}>Persona</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <AppCard style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.logoWrap}>
                  <Image source={item.logo} style={styles.logo} />
                </View>
                <View style={styles.cardTopRight}>
                  <Text style={styles.typeBadge}>
                    {item.type === 'juridica' ? 'Empresa / Persona Jurídica' : 'Persona Natural / Independiente'}
                  </Text>
                  {item.type === 'juridica' ? (
                    <>
                      <Text style={styles.name}>{item.legalName}</Text>
                      <Text style={styles.secondary}>{item.taxId}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.name}>{item.personalName}</Text>
                      <Text style={styles.secondary}>{item.nationalId}</Text>
                    </>
                  )}
                </View>
              </View>

              {item.type === 'juridica' ? (
                <View style={styles.details}>
                  {item.corporateEmail ? (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Correo corporativo</Text>
                      <Text style={styles.detailValue}>{item.corporateEmail}</Text>
                    </View>
                  ) : null}
                  {item.hqAddress ? (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Sede principal</Text>
                      <Text style={styles.detailValue}>{item.hqAddress}</Text>
                    </View>
                  ) : null}
                </View>
              ) : null}

              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionPrimary} activeOpacity={0.85}>
                  <Text style={styles.actionPrimaryText}>Ver detalle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionSecondary} activeOpacity={0.85}>
                  <Text style={styles.actionSecondaryText}>Editar</Text>
                </TouchableOpacity>
              </View>
            </AppCard>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
    paddingHorizontal: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  metrics: {
    alignItems: 'flex-end',
    paddingHorizontal: 4,
  },
  metricsNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#9900ff',
    lineHeight: 22,
  },
  metricsLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
    marginHorizontal: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentItemActive: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  segmentText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  segmentTextActive: {
    color: '#111827',
  },
  listContent: {
    paddingBottom: 24,
    paddingHorizontal: 0,
  },
  card: {
    width: '100%',
    maxWidth: '100%',
    alignSelf: 'stretch',
    margin: 1,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  cardTopRight: {
    flex: 1,
  },
  typeBadge: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.2,
  },
  secondary: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    marginTop: 12,
    paddingTop: 12,
    gap: 8,
  },
  detailRow: {
    gap: 2,
  },
  detailLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  actionPrimary: {
    flex: 1,
    backgroundColor: '#9900ff',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionPrimaryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  actionSecondary: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  actionSecondaryText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
});
