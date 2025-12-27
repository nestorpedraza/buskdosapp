import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppCard from '../../../components/AppCard';
import AppSafeArea from '../../../components/AppSafeArea';
import { getOrganizations, getPlacesByOrganizationId } from '../../../data/dataService';

export default function OrganizationBusinessesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 72 : 62;
  const bottomPadding = TAB_BAR_HEIGHT + insets.bottom + 16;

  const org = React.useMemo(() => {
    const list = getOrganizations() as any[];
    return list.find(o => o.id === id);
  }, [id]);
  const orgName = org?.type === 'juridica' ? org?.legalName : org?.personalName;
  const places = React.useMemo(() => (id ? getPlacesByOrganizationId(String(id)) : []), [id]);
  const [activeMap, setActiveMap] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    places.forEach(p => {
      initial[p.id] = true;
    });
    return initial;
  });
  const toggleActive = React.useCallback((placeId: string) => {
    setActiveMap(prev => ({ ...prev, [placeId]: !prev[placeId] }));
  }, []);

  return (
    <AppSafeArea activeRoute="/organizations">
      <View style={[styles.content, { paddingBottom: bottomPadding }]}>
        <View style={styles.pageHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Negocios de {orgName || '...'}</Text>
            <Text style={styles.subtitle}>Listado de locales asociados</Text>
          </View>
          <View style={styles.metrics}>
            <Text style={styles.metricsNumber}>{places.length}</Text>
            <Text style={styles.metricsLabel}>registros</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: '/organizations/businesses/new/[orgId]',
                params: { orgId: String(id) },
              } as any)
            }
          >
            <Text style={styles.addButtonText}>Agregar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={places}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
          renderItem={({ item }) => (
            <AppCard style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.logoWrap}>
                  <Image source={item.image} style={styles.logo} />
                </View>
                <View style={styles.cardTopRight}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.secondary}>{item.subtitle}</Text>
                  <Text style={styles.secondary}>Categoría: {item.category} • {item.subcategory}</Text>
                  <Text style={styles.secondary}>Etiqueta: {item.tag}</Text>
                  <Text style={styles.secondary}>Precio: {item.price}</Text>
                  <Text style={styles.secondary}>Rating: {item.rating} ({item.reviews} reseñas)</Text>
                  <Text style={styles.secondary}>Distancia: {item.distance}</Text>
                  <Text style={styles.secondary}>{item.isVerified ? 'Verificado' : 'No verificado'}</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionPrimary}
                  activeOpacity={0.85}
                  onPress={() => router.push({ pathname: '/place/[id]', params: { id: item.id } })}
                >
                  <Text style={styles.actionPrimaryText}>Abrir</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionSecondary}
                  activeOpacity={0.85}
                  onPress={() => router.push({ pathname: '/organizations/businesses/gallery/[placeId]', params: { placeId: item.id } })}
                >
                  <Text style={styles.actionSecondaryText}>Galería</Text>
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
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Sin negocios vinculados</Text>
              <Text style={styles.emptySubtitle}>No encontramos locales con este nombre de organización</Text>
            </View>
          }
        />
      </View>
    </AppSafeArea>
  );
}

const styles = StyleSheet.create({
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
  empty: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
})
