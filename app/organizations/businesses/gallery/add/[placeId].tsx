import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';
import { Modal, Platform, Image as RNImage, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const canSave = title.trim() && url.trim() ? true : false;

  const resolveSource = React.useCallback((v?: string) => {
    const s = String(v || '');
    if (!s) return require('../../../../../assets/images/city.png');
    if (s === 'assets/images/city.png') return require('../../../../../assets/images/city.png');
    if (/^https?:\/\//i.test(s)) return { uri: s };
    if (/^file:\/\//i.test(s)) return { uri: s };
    if (/^content:\/\//i.test(s)) return { uri: s };
    return require('../../../../../assets/images/city.png');
  }, []);

  const pickFromDevice = React.useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 0.9,
    });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      const asset = res.assets[0];
      setUrl(asset.uri || '');
      if (asset.type === 'video') setType('video');
      if (asset.type === 'image') setType('image');
    }
  }, []);

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
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <TouchableOpacity style={styles.actionSecondary} onPress={pickFromDevice} activeOpacity={0.85}>
                <Text style={styles.actionSecondaryText}>Seleccionar del dispositivo</Text>
              </TouchableOpacity>
            </View>
            {url ? (
              <View style={{ marginTop: 8 }}>
                <TouchableOpacity activeOpacity={0.85} onPress={() => setPreviewVisible(true)}>
                  {type === 'image' ? (
                    <RNImage source={{ uri: url }} style={styles.preview} />
                  ) : (
                    <View style={styles.videoBadge}>
                      <Text style={styles.videoBadgeText}>Video seleccionado (tocar para ver)</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            ) : null}
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
      <Modal
        visible={previewVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewVisible(false)}
      >
        <View style={styles.previewOverlay}>
          <TouchableOpacity style={styles.previewClose} onPress={() => setPreviewVisible(false)} activeOpacity={0.85}>
            <Text style={styles.previewCloseText}>Cerrar</Text>
          </TouchableOpacity>
          <View style={styles.previewContent}>
            {type === 'video' ? (
              <FullscreenVideo uri={url} />
            ) : (
              <RNImage source={resolveSource(url)} style={styles.previewFullImage} />
            )}
          </View>
        </View>
      </Modal>
    </AppSafeArea>
  );
}

function FullscreenVideo({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
    p.play();
  });
  return (
    <VideoView
      player={player}
      style={styles.previewFullMedia}
      allowsFullscreen={false}
      allowsPictureInPicture={false}
      contentFit="contain"
    />
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
  preview: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  videoBadge: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  videoBadgeText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewClose: {
    position: 'absolute',
    top: 40,
    left: 16,
    backgroundColor: 'rgba(51,51,51,0.85)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  previewCloseText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  previewFullImage: {
    width: '100%',
    height: '100%',
  },
  previewFullMedia: {
    width: '100%',
    height: '100%',
  },
})
