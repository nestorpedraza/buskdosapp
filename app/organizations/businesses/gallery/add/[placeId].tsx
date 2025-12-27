import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppSafeArea from '../../../../../components/AppSafeArea';
import { getGalleryByPlaceId, RawGalleryItem, updateGallery } from '../../../../../data/dataService';

export default function GalleryAddScreen() {
  const router = useRouter();
  const { placeId } = useLocalSearchParams<{ placeId: string }>();
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 72 : 62;
  const bottomPadding = TAB_BAR_HEIGHT + insets.bottom + 16;
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState<'image' | 'video'>('image');
  const [url, setUrl] = React.useState('');
  const [description, setDescription] = React.useState('');
  const canSave = title.trim() && url.trim() ? true : false;

  const handleSave = async () => {
    const current = getGalleryByPlaceId(String(placeId || ''));
    const next: RawGalleryItem[] = [
      ...current,
      {
        id: `${Date.now()}`,
        title: title.trim(),
        type,
        url: url.trim(),
        description: description.trim(),
      },
    ];
    await updateGallery(String(placeId || ''), next);
    router.back();
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
            <Text style={styles.title}>Agregar a la galería</Text>
            <Text style={styles.subtitle}>Nuevo elemento</Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.formRow}>
            <Text style={styles.label}>Título</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Ej: Nueva colección"
              style={styles.input}
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.label}>Tipo</Text>
            <View style={styles.segmented}>
              <TouchableOpacity
                style={[styles.segmentItem, type === 'image' && styles.segmentItemActive]}
                onPress={() => setType('image')}
                activeOpacity={0.8}
              >
                <Text style={[styles.segmentText, type === 'image' && styles.segmentTextActive]}>Imagen</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.segmentItem, type === 'video' && styles.segmentItemActive]}
                onPress={() => setType('video')}
                activeOpacity={0.8}
              >
                <Text style={[styles.segmentText, type === 'video' && styles.segmentTextActive]}>Video</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.formRow}>
            <Text style={styles.label}>URL</Text>
            <TextInput
              value={url}
              onChangeText={setUrl}
              placeholder="assets/images/city.png o https://..."
              style={styles.input}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Texto descriptivo"
              style={[styles.input, styles.textarea]}
              multiline
            />
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionPrimary, !canSave && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={!canSave}
            activeOpacity={0.85}
          >
            <Text style={styles.actionPrimaryText}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionSecondary} onPress={() => router.back()} activeOpacity={0.85}>
            <Text style={styles.actionSecondaryText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  form: {
    paddingHorizontal: 8,
    marginTop: 4,
    gap: 12,
  },
  formRow: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    paddingHorizontal: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: 14,
    color: '#111827',
  },
  textarea: {
    minHeight: 100,
    textAlignVertical: 'top',
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
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    paddingHorizontal: 8,
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
})
