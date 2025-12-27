import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Platform, Image as RNImage, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppSafeArea from '../../../../components/AppSafeArea';
import { getGalleryByPlaceId } from '../../../../data/dataService';

export default function GalleryAdminScreen() {
  const router = useRouter();
  const { placeId } = useLocalSearchParams<{ placeId: string }>();
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 72 : 62;
  const bottomPadding = TAB_BAR_HEIGHT + insets.bottom + 16;
  const [items, setItems] = React.useState(() => getGalleryByPlaceId(String(placeId || '')));
  const resolveSource = React.useCallback((url?: string) => {
    const v = String(url || '');
    if (!v) return require('../../../../assets/images/city.png');
    if (v === 'assets/images/city.png') return require('../../../../assets/images/city.png');
    if (/^https?:\/\//i.test(v)) return { uri: v };
    return require('../../../../assets/images/city.png');
  }, []);

  const handleNavigateAdd = () => {
    router.push({ pathname: '/organizations/businesses/gallery/add/[placeId]', params: { placeId: String(placeId || '') } });
  };

  return (
    <AppSafeArea activeRoute="/organizations">
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Galería del negocio</Text>
            <Text style={styles.subtitle}>Administra imágenes y videos</Text>
          </View>
        </View>

        <View style={styles.gridBox}>
          <Text style={styles.label}>Vista previa (3 x 3)</Text>
          <View style={styles.grid}>
            {items.map((it) => (
              <View key={`grid-${it.id}`} style={styles.gridItem}>
                <RNImage source={resolveSource(it.url)} style={styles.gridImage} />
                <View style={styles.gridOverlay}>
                  <Text style={styles.gridType}>{it.type === 'video' ? '▶' : ''}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionsTop}>
          <TouchableOpacity style={styles.actionSecondary} onPress={() => router.back()} activeOpacity={0.85}>
            <Text style={styles.actionSecondaryText}>Volver</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionPrimary} onPress={handleNavigateAdd} activeOpacity={0.85}>
            <Text style={styles.actionPrimaryText}>Agregar</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 8 }} />
      </ScrollView>
    </AppSafeArea>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  gridBox: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  gridItem: {
    width: '33.3333%',
    aspectRatio: 1,
    padding: 4,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  gridOverlay: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  gridType: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
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
  actionsTop: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    paddingHorizontal: 4,
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
  label: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    paddingHorizontal: 4,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
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
})
