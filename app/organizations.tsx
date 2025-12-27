import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppCard from '../components/AppCard';
import AppSafeArea from '../components/AppSafeArea';
import { getOrganizations } from '../data/dataService';

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

const allOrgs: OrganizationEntity[] = getOrganizations() as OrganizationEntity[];

export default function OrganizationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 72 : 62;
  const bottomPadding = TAB_BAR_HEIGHT + insets.bottom + 16;
  const [selectedType, setSelectedType] = React.useState<'all' | EntityType>('all');
  const [activeMap, setActiveMap] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    allOrgs.forEach(o => {
      initial[o.id] = true;
    });
    return initial;
  });
  const filtered = React.useMemo(() => {
    if (selectedType === 'all') return allOrgs;
    return allOrgs.filter(o => o.type === selectedType);
  }, [selectedType]);
  const toggleActive = React.useCallback((id: string) => {
    setActiveMap(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return (
    <AppSafeArea activeRoute="/organizations">

      <View style={styles.pageHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Organizaciones</Text>
          <Text style={styles.subtitle}>Entidad Padre y Profesionales independientes</Text>
        </View>
        <View style={styles.metrics}>
          <Text style={styles.metricsNumber}>{filtered.length}</Text>
          <Text style={styles.metricsLabel}>registros</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/organizations/new')}
          activeOpacity={0.85}
        >
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
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
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
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
              <TouchableOpacity
                style={styles.actionPrimary}
                activeOpacity={0.85}
                onPress={() => router.push({ pathname: '/organizations/businesses/[id]', params: { id: item.id } })}
              >
                <Text style={styles.actionPrimaryText}>Ver negocios</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionSecondary}
                activeOpacity={0.85}
                onPress={() => router.push({ pathname: '/organizations/edit/[id]', params: { id: item.id } })}
              >
                <Text style={styles.actionSecondaryText}>Editar</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.toggleWrap, { marginTop: 10 }]}>
              <Text style={[styles.toggleLabel, activeMap[item.id] ? styles.toggleActiveText : styles.toggleInactiveText]}>
                {activeMap[item.id] ? 'Activo' : 'Inactivo'}
              </Text>
              <Switch
                value={!!activeMap[item.id]}
                onValueChange={() => toggleActive(item.id)}
                trackColor={{ false: '#fca5a5', true: '#a7f3d0' }}
                thumbColor={activeMap[item.id] ? '#22c55e' : '#ef4444'}
                ios_backgroundColor="#fca5a5"
              />
            </View>
          </AppCard>
        )}
      />

    </AppSafeArea>
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
  addButton: {
    marginLeft: 12,
    backgroundColor: '#9900ff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
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
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: '100%',
    alignSelf: 'stretch',
    margin: 4
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
  toggleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  toggleActiveText: {
    color: '#15803d',
  },
  toggleInactiveText: {
    color: '#b91c1c',
  },
});
