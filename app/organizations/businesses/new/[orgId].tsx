import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppSafeArea from '../../../../components/AppSafeArea';
import { createPlace, getCategories } from '../../../../data/dataService';

export default function NewBusinessScreen() {
  const router = useRouter();
  const { orgId } = useLocalSearchParams<{ orgId: string }>();
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 72 : 62;
  const bottomPadding = TAB_BAR_HEIGHT + insets.bottom + 16;

  const categories = React.useMemo(() => getCategories(), []);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>(categories[0]?.id || '');
  const selectedCategory = React.useMemo(
    () => categories.find(c => c.id === selectedCategoryId),
    [categories, selectedCategoryId]
  );
  const subcategories = React.useMemo(() => selectedCategory?.subcategories || [], [selectedCategory]);
  const [selectedSubId, setSelectedSubId] = React.useState<string>(subcategories[0]?.id || '');

  const [name, setName] = React.useState('');
  const [tag, setTag] = React.useState('');
  const [subtitle, setSubtitle] = React.useState('');
  const [latitude, setLatitude] = React.useState('');
  const [longitude, setLongitude] = React.useState('');
  const [hasSelectedCoords, setHasSelectedCoords] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [phonePrincipal, setPhonePrincipal] = React.useState('');
  const [whatsapp, setWhatsapp] = React.useState('');
  const [weekdays, setWeekdays] = React.useState('');
  const [saturday, setSaturday] = React.useState('');
  const [sunday, setSunday] = React.useState('');
  const [website, setWebsite] = React.useState('');
  const [emailPrincipal, setEmailPrincipal] = React.useState('');
  const [facebook, setFacebook] = React.useState('');
  const [instagram, setInstagram] = React.useState('');
  const [tiktok, setTiktok] = React.useState('');
  const [twitter, setTwitter] = React.useState('');
  const [youtube, setYoutube] = React.useState('');
  const [rappi, setRappi] = React.useState('');
  const [didifood, setDidifood] = React.useState('');
  const [ubereats, setUbereats] = React.useState('');
  const [ifood, setIfood] = React.useState('');
  const [domicilios, setDomicilios] = React.useState('');

  const canSave =
    name.trim() &&
      selectedCategoryId &&
      selectedSubId &&
      subtitle.trim() &&
      latitude.trim() &&
      longitude.trim() &&
      description.trim()
      ? true
      : false;

  const handleSave = async () => {
    const payload = {
      id: '',
      name: name.trim(),
      category: selectedCategory?.name || '',
      subcategory: (selectedCategory?.subcategories || []).find(s => s.id === selectedSubId)?.name || '',
      tag: tag.trim(),
      subtitle: subtitle.trim(),
      idOrganization: String(orgId),
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      placeDetails: [
        {
          description: description.trim(),
          logo: 'assets/images/city.png',
          coverImage: 'assets/images/city.png',
          address: address.trim(),
          phones: phonePrincipal ? [{ type: 'Principal', phone: phonePrincipal.trim() }] : [],
          whatsapp: whatsapp.trim(),
          whatsapps: whatsapp ? [{ type: 'Principal', whatsapp: whatsapp.trim() }] : [],
          schedule: {
            weekdays: weekdays.trim(),
            saturday: saturday.trim(),
            sunday: sunday.trim(),
          },
          website: website.trim(),
          emails: emailPrincipal ? [{ type: 'Principal', email: emailPrincipal.trim() }] : [],
          socialMedia: {
            facebook: facebook.trim(),
            instagram: instagram.trim(),
            tiktok: tiktok.trim(),
            twitter: twitter.trim(),
            youtube: youtube.trim(),
          },
          deliveryApps: {
            rappi: rappi.trim(),
            didifood: didifood.trim(),
            ubereats: ubereats.trim(),
            ifood: ifood.trim(),
            domicilios: domicilios.trim(),
          },
        },
      ],
    };
    await createPlace(payload);
    router.push({ pathname: '/organizations/businesses/[id]' as const, params: { id: String(orgId) } });
  };

  const handleCancel = () => router.back();

  const initialRegion: Region = React.useMemo(() => ({
    latitude: 6.2465,
    longitude: -75.5740,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  }), []);

  const updateAddressFromCoords = React.useCallback(async (lat: number, lng: number) => {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      const first = results?.[0];
      if (first) {
        const composed =
          [first.street, first.name, first.city, first.region, first.postalCode, first.country]
            .filter(Boolean)
            .join(', ');
        setAddress(composed);
      } else {
        setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    } catch {
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  }, []);

  const handleMapPress = React.useCallback(async (e: MapPressEvent) => {
    const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
    setLatitude(String(lat));
    setLongitude(String(lng));
    setHasSelectedCoords(true);
    await updateAddressFromCoords(lat, lng);
  }, [updateAddressFromCoords]);

  const handleMarkerDragEnd = React.useCallback(async (lat: number, lng: number) => {
    setLatitude(String(lat));
    setLongitude(String(lng));
    await updateAddressFromCoords(lat, lng);
  }, [updateAddressFromCoords]);

  return (
    <AppSafeArea activeRoute="/organizations">
      <View style={[styles.content, { paddingBottom: bottomPadding }]}>
        <View style={styles.pageHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Registrar negocio</Text>
            <Text style={styles.subtitle}>ID Organización: {orgId}</Text>
          </View>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: bottomPadding + 24 }}
          >
            <View style={styles.form}>
              <Text style={styles.label}>Ubicación en el mapa</Text>
              <View style={styles.mapBox}>
                <MapView
                  style={styles.map}
                  initialRegion={initialRegion}
                  onPress={handleMapPress}
                >
                  {hasSelectedCoords ? (
                    <Marker
                      draggable
                      coordinate={{ latitude: Number(latitude) || initialRegion.latitude, longitude: Number(longitude) || initialRegion.longitude }}
                      onDragEnd={(e) => handleMarkerDragEnd(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)}
                      title="Posición seleccionada"
                    />
                  ) : null}
                </MapView>
                <Text style={styles.mapHint}>Toca el mapa para seleccionar la ubicación</Text>
              </View>

              <Text style={styles.label}>Dirección</Text>
              <TextInput value={address} editable={false} placeholder="Se llena automáticamente al seleccionar en el mapa" style={[styles.input, styles.inputDisabled]} />

              <Text style={styles.label}>Coordenadas</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput value={latitude} editable={false} placeholder="Latitud" style={[styles.input, styles.inputDisabled, { flex: 1 }]} />
                <TextInput value={longitude} editable={false} placeholder="Longitud" style={[styles.input, styles.inputDisabled, { flex: 1 }]} />
              </View>

              <Text style={styles.label}>Nombre</Text>
              <TextInput value={name} onChangeText={setName} placeholder="La Casa Italiana" style={styles.input} />

              <Text style={styles.label}>Categoría</Text>
              <View style={styles.segmented}>
                {categories.map(c => (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.segmentItem, selectedCategoryId === c.id && styles.segmentItemActive]}
                    onPress={() => {
                      setSelectedCategoryId(c.id);
                      const firstSub = (c.subcategories || [])[0]?.id || '';
                      setSelectedSubId(firstSub);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.segmentText, selectedCategoryId === c.id && styles.segmentTextActive]}>{c.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Subcategoría</Text>
              <View style={styles.segmented}>
                {subcategories.map(s => (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.segmentItem, selectedSubId === s.id && styles.segmentItemActive]}
                    onPress={() => setSelectedSubId(s.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.segmentText, selectedSubId === s.id && styles.segmentTextActive]}>{s.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Tag</Text>
              <TextInput value={tag} onChangeText={setTag} placeholder="Ropa" style={styles.input} />

              <Text style={styles.label}>Subtítulo</Text>
              <TextInput value={subtitle} onChangeText={setSubtitle} placeholder="Moda contemporánea" style={styles.input} />

              <Text style={styles.label}>Descripción</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Descripción del negocio"
                style={[styles.input, styles.textarea]}
                multiline
              />

              <Text style={styles.label}>Teléfono principal</Text>
              <TextInput value={phonePrincipal} onChangeText={setPhonePrincipal} placeholder="+57 1 234 5678" style={styles.input} keyboardType="phone-pad" />

              <Text style={styles.label}>WhatsApp</Text>
              <TextInput value={whatsapp} onChangeText={setWhatsapp} placeholder="+57 320 123 4567" style={styles.input} keyboardType="phone-pad" />

              <Text style={styles.label}>Horario</Text>
              <TextInput value={weekdays} onChangeText={setWeekdays} placeholder="Semana: 12:00 - 22:00" style={styles.input} />
              <Text style={styles.label}>Sábado</Text>
              <TextInput value={saturday} onChangeText={setSaturday} placeholder="12:00 - 23:00" style={styles.input} />
              <Text style={styles.label}>Domingo</Text>
              <TextInput value={sunday} onChangeText={setSunday} placeholder="12:00 - 20:00" style={styles.input} />

              <Text style={styles.label}>Website</Text>
              <TextInput value={website} onChangeText={setWebsite} placeholder="https://lacasaitaliana.com" style={styles.input} keyboardType="url" />

              <Text style={styles.label}>Email principal</Text>
              <TextInput value={emailPrincipal} onChangeText={setEmailPrincipal} placeholder="info@lacasaitaliana.com.co" style={styles.input} keyboardType="email-address" />

              <Text style={styles.label}>Redes sociales</Text>
              <TextInput value={facebook} onChangeText={setFacebook} placeholder="https://facebook.com/lacasaitaliana" style={styles.input} keyboardType="url" />
              <TextInput value={instagram} onChangeText={setInstagram} placeholder="https://instagram.com/lacasaitaliana" style={styles.input} keyboardType="url" />
              <TextInput value={tiktok} onChangeText={setTiktok} placeholder="https://tiktok.com/@lacasaitaliana" style={styles.input} keyboardType="url" />
              <TextInput value={twitter} onChangeText={setTwitter} placeholder="https://twitter.com/lacasaitaliana" style={styles.input} keyboardType="url" />
              <TextInput value={youtube} onChangeText={setYoutube} placeholder="https://youtube.com/lacasaitaliana" style={styles.input} keyboardType="url" />

              <Text style={styles.label}>Apps de delivery</Text>
              <TextInput value={rappi} onChangeText={setRappi} placeholder="https://rappi.com.co/restaurantes/la-casa-italiana" style={styles.input} keyboardType="url" />
              <TextInput value={didifood} onChangeText={setDidifood} placeholder="https://didifood.com/co/la-casa-italiana" style={styles.input} keyboardType="url" />
              <TextInput value={ubereats} onChangeText={setUbereats} placeholder="https://ubereats.com/co/la-casa-italiana" style={styles.input} keyboardType="url" />
              <TextInput value={ifood} onChangeText={setIfood} placeholder="https://ifood.com.co/la-casa-italiana" style={styles.input} keyboardType="url" />
              <TextInput value={domicilios} onChangeText={setDomicilios} placeholder="https://domicilios.com/la-casa-italiana" style={styles.input} keyboardType="url" />

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionPrimary, !canSave && { opacity: 0.6 }]}
                  onPress={handleSave}
                  disabled={!canSave}
                  activeOpacity={0.85}
                >
                  <Text style={styles.actionPrimaryText}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionSecondary} onPress={handleCancel} activeOpacity={0.85}>
                  <Text style={styles.actionSecondaryText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </AppSafeArea>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
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
    marginBottom: 12,
    marginHorizontal: 4,
    flexWrap: 'wrap',
    gap: 6,
  },
  segmentItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
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
    minHeight: 120,
    textAlignVertical: 'top',
  },
  inputDisabled: {
    backgroundColor: '#f9fafb',
    color: '#6b7280',
  },
  mapBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: 180,
  },
  mapHint: {
    fontSize: 12,
    color: '#6b7280',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingHorizontal: 8,
  },
  actionPrimary: {
    flex: 1,
    backgroundColor: '#9900ff',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionPrimaryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  actionSecondary: {
    paddingVertical: 12,
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
