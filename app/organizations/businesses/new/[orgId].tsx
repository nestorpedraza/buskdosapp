import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppSafeArea from '../../../../components/AppSafeArea';
import MapPicker from '../../../../components/map/MapPicker';
import { createPlace, getCategories, getCountryCodes } from '../../../../data/dataService';

export default function NewBusinessScreen() {
  const router = useRouter();
  const { orgId } = useLocalSearchParams<{ orgId: string }>();
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 72 : 62;
  const bottomPadding = TAB_BAR_HEIGHT + insets.bottom + 16;

  const categories = React.useMemo(() => getCategories(), []);
  const [selectedCategoryIds, setSelectedCategoryIds] = React.useState<string[]>([]);
  const selectedCategories = React.useMemo(
    () => categories.filter(c => selectedCategoryIds.includes(c.id)),
    [categories, selectedCategoryIds]
  );
  const aggregatedSubcategories = React.useMemo(
    () => selectedCategories.flatMap(c => c.subcategories || []),
    [selectedCategories]
  );
  const [selectedSubIds, setSelectedSubIds] = React.useState<string[]>([]);

  const [name, setName] = React.useState('');
  const [tagsText, setTagsText] = React.useState('');
  const tagsNormalized = React.useMemo(() => {
    const parts = String(tagsText || '')
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    return parts.map(t => {
      const bare = t.replace(/^#+/, '');
      return bare ? `#${bare}` : '';
    }).filter(Boolean);
  }, [tagsText]);
  const [subtitle, setSubtitle] = React.useState('');
  const [latitude, setLatitude] = React.useState('');
  const [longitude, setLongitude] = React.useState('');
  const [hasSelectedCoords, setHasSelectedCoords] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [addressComplement, setAddressComplement] = React.useState('');
  const countryCodes = React.useMemo(() => getCountryCodes(), []);
  const COUNTRY_ITEMS = React.useMemo(() => countryCodes.map(c => ({ label: c.label, code: c.code })), [countryCodes]);
  const COUNTRY_FLAGS: Record<string, string> = React.useMemo(() => {
    const map: Record<string, string> = {};
    countryCodes.forEach(c => { if (c.label) map[c.label] = String(c.flag || ''); });
    return map;
  }, [countryCodes]);
  const [phones, setPhones] = React.useState<{ type: string; countryCode: string; number: string }[]>([
    { type: 'Principal', countryCode: COUNTRY_ITEMS[0].code, number: '' },
  ]);
  const [openCountryPickerIndex, setOpenCountryPickerIndex] = React.useState<number | null>(null);
  const [whatsAppList, setWhatsAppList] = React.useState<{ type: string; countryCode: string; number: string }[]>([
    { type: 'Principal', countryCode: COUNTRY_ITEMS[0].code, number: '' },
  ]);
  const [openWhatsappPickerIndex, setOpenWhatsappPickerIndex] = React.useState<number | null>(null);
  const TIME_SLOTS = React.useMemo(() => {
    const slots: string[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hh = String(h).padStart(2, '0');
        const mm = String(m).padStart(2, '0');
        slots.push(`${hh}:${mm}`);
      }
    }
    return slots;
  }, []);
  const [dailySchedule, setDailySchedule] = React.useState<Record<
    'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo',
    { start: string; end: string }
  >>({
    lunes: { start: '', end: '' },
    martes: { start: '', end: '' },
    miercoles: { start: '', end: '' },
    jueves: { start: '', end: '' },
    viernes: { start: '', end: '' },
    sabado: { start: '', end: '' },
    domingo: { start: '', end: '' },
  });
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
  const [emailsList, setEmailsList] = React.useState<{ type: string; email: string }[]>([
    { type: 'Principal', email: '' },
  ]);
  const normalizeSocial = React.useCallback((platform: 'facebook' | 'instagram' | 'tiktok' | 'twitter' | 'youtube', raw: string) => {
    const v = String(raw || '').trim();
    if (!v) return '';
    const hasProtocol = /^https?:\/\//i.test(v);
    const domains: Record<string, string> = {
      facebook: 'facebook.com',
      instagram: 'instagram.com',
      tiktok: 'tiktok.com',
      twitter: 'twitter.com',
      youtube: 'youtube.com',
    };
    if (v.includes(domains[platform])) {
      return hasProtocol ? v : `https://${v}`;
    }
    const sanitized = v.replace(/^@/, '').replace(/^\/+/, '');
    if (platform === 'tiktok') return `https://tiktok.com/@${sanitized}`;
    if (platform === 'youtube') return `https://youtube.com/@${sanitized}`;
    if (platform === 'facebook') return `https://facebook.com/${sanitized}`;
    if (platform === 'instagram') return `https://instagram.com/${sanitized}`;
    if (platform === 'twitter') return `https://twitter.com/${sanitized}`;
    return v;
  }, []);
  const normalizeDelivery = React.useCallback((platform: 'rappi' | 'didifood' | 'ubereats' | 'ifood' | 'domicilios', raw: string) => {
    const v = String(raw || '').trim();
    if (!v) return '';
    const hasProtocol = /^https?:\/\//i.test(v);
    const domains: Record<string, string> = {
      rappi: 'rappi.com',
      didifood: 'didifood.com',
      ubereats: 'ubereats.com',
      ifood: 'ifood.com',
      domicilios: 'domicilios.com',
    };
    if (v.includes(domains[platform])) {
      return hasProtocol ? v : `https://${v}`;
    }
    const sanitized = v.replace(/^@/, '').replace(/^\/+/, '');
    return `https://${domains[platform]}/${sanitized}`;
  }, []);

  const canSave =
    name.trim() &&
      selectedCategoryIds.length > 0 &&
      selectedSubIds.length > 0 &&
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
      category: selectedCategories[0]?.name || '',
      subcategory: aggregatedSubcategories.find(s => s.id === selectedSubIds[0])?.name || '',
      categoryIds: selectedCategoryIds,
      subcategoryIds: selectedSubIds,
      categoriesSelected: selectedCategories.map(c => c.name),
      subcategoriesSelected: selectedSubIds.map(id => aggregatedSubcategories.find(s => s.id === id)?.name).filter(Boolean),
      tag: (tagsNormalized[0] || '').replace(/^#/, ''),
      tags: tagsNormalized,
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
          addressComplement: addressComplement.trim(),
          phones: phones
            .filter(p => p.number.trim())
            .map(p => ({
              type: (p.type || '').trim() || 'Otro',
              phone: `${p.countryCode} ${p.number.trim()}`,
            })),
          whatsapp: (() => {
            const first = whatsAppList.find(w => w.number.trim());
            return first ? `${first.countryCode} ${first.number.trim()}` : '';
          })(),
          whatsapps: whatsAppList
            .filter(w => w.number.trim())
            .map(w => ({
              type: (w.type || '').trim() || 'Otro',
              whatsapp: `${w.countryCode} ${w.number.trim()}`,
            })),
          schedule: {
            daily: {
              lunes: dailySchedule.lunes.start && dailySchedule.lunes.end ? `${dailySchedule.lunes.start} - ${dailySchedule.lunes.end}` : '',
              martes: dailySchedule.martes.start && dailySchedule.martes.end ? `${dailySchedule.martes.start} - ${dailySchedule.martes.end}` : '',
              miercoles: dailySchedule.miercoles.start && dailySchedule.miercoles.end ? `${dailySchedule.miercoles.start} - ${dailySchedule.miercoles.end}` : '',
              jueves: dailySchedule.jueves.start && dailySchedule.jueves.end ? `${dailySchedule.jueves.start} - ${dailySchedule.jueves.end}` : '',
              viernes: dailySchedule.viernes.start && dailySchedule.viernes.end ? `${dailySchedule.viernes.start} - ${dailySchedule.viernes.end}` : '',
              sabado: dailySchedule.sabado.start && dailySchedule.sabado.end ? `${dailySchedule.sabado.start} - ${dailySchedule.sabado.end}` : '',
              domingo: dailySchedule.domingo.start && dailySchedule.domingo.end ? `${dailySchedule.domingo.start} - ${dailySchedule.domingo.end}` : '',
            },
          },
          website: website.trim(),
          emails: emailsList
            .filter(e => e.email.trim())
            .map(e => ({
              type: (e.type || '').trim() || 'Otro',
              email: e.email.trim(),
            })),
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

  type MapRegion = { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };
  const initialRegion: MapRegion = React.useMemo(() => ({
    latitude: 6.2465,
    longitude: -75.5740,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  }), []);
  const [region, setRegion] = React.useState<MapRegion>(initialRegion);
  const mapRef = React.useRef<any>(null);

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

  const handleMapPress = React.useCallback(async (e: any) => {
    const lat = e.nativeEvent.coordinate.latitude;
    const lng = e.nativeEvent.coordinate.longitude;
    setLatitude(String(lat));
    setLongitude(String(lng));
    setHasSelectedCoords(true);
    const next = { ...region, latitude: lat, longitude: lng };
    setRegion(next);
    if (Platform.OS !== 'web') {
      mapRef.current?.animateToRegion?.(next, 400);
    }
    await updateAddressFromCoords(lat, lng);
  }, [region, updateAddressFromCoords]);

  const handleMarkerDragEnd = React.useCallback(async (lat: number, lng: number) => {
    setLatitude(String(lat));
    setLongitude(String(lng));
    const next = { ...region, latitude: lat, longitude: lng };
    setRegion(next);
    await updateAddressFromCoords(lat, lng);
  }, [region, updateAddressFromCoords]);

  React.useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
          const req = await Location.requestForegroundPermissionsAsync();
          status = req.status;
        }
        if (status === 'granted') {
          const pos =
            (await Location.getLastKnownPositionAsync()) ||
            (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
          if (pos?.coords) {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            setLatitude(String(lat));
            setLongitude(String(lng));
            setHasSelectedCoords(true);
            const next = { ...region, latitude: lat, longitude: lng };
            setRegion(next);
            mapRef.current?.animateToRegion(next, 500);
            await updateAddressFromCoords(lat, lng);
          }
        }
      } catch {
        // se mantiene la región por defecto
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <MapPicker
                  initialRegion={region}
                  style={styles.map}
                  selectedLatitude={hasSelectedCoords ? (Number(latitude) || initialRegion.latitude) : undefined}
                  selectedLongitude={hasSelectedCoords ? (Number(longitude) || initialRegion.longitude) : undefined}
                  onMapPress={handleMapPress}
                  onMarkerDragEnd={handleMarkerDragEnd}
                />
                <Text style={styles.mapHint}>Toca el mapa para seleccionar la ubicación</Text>
              </View>

              <Text style={styles.label}>Dirección</Text>
              <View style={[styles.input, styles.inputDisabled]}>
                <Text style={[styles.addressText, !address && styles.addressPlaceholder]}>
                  {address || 'Se llena automáticamente al seleccionar en el mapa'}
                </Text>
              </View>
              <Text style={styles.label}>Complementos dirección</Text>
              <TextInput
                value={addressComplement}
                onChangeText={setAddressComplement}
                placeholder="Piso 5, Oficina 503, Local 12"
                style={styles.input}
              />

              <Text style={styles.label}>Coordenadas</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput value={latitude} editable={false} placeholder="Latitud" style={[styles.input, styles.inputDisabled, { flex: 1 }]} />
                <TextInput value={longitude} editable={false} placeholder="Longitud" style={[styles.input, styles.inputDisabled, { flex: 1 }]} />
              </View>

              <Text style={styles.label}>Nombre</Text>
              <TextInput value={name} onChangeText={setName} placeholder="Buskdos" style={styles.input} />

              <Text style={styles.label}>Categoría</Text>
              <View style={styles.segmented}>
                {categories.map(c => {
                  const active = selectedCategoryIds.includes(c.id);
                  return (
                    <TouchableOpacity
                      key={c.id}
                      style={[styles.segmentItem, active && styles.segmentItemActive]}
                      onPress={() => {
                        setSelectedCategoryIds(prev => {
                          if (prev.includes(c.id)) {
                            const next = prev.filter(x => x !== c.id);
                            const subIdsToRemove = (c.subcategories || []).map(s => s.id);
                            setSelectedSubIds(prevSubs => prevSubs.filter(x => !subIdsToRemove.includes(x)));
                            return next;
                          }
                          return [...prev, c.id];
                        });
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{c.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={styles.helperText}>
                {selectedCategoryIds.length > 0 ? `${selectedCategoryIds.length} categorías seleccionadas` : 'Selecciona una o más categorías'}
              </Text>

              <Text style={styles.label}>Subcategoría</Text>
              <View style={styles.segmented}>
                {aggregatedSubcategories.length > 0 ? (
                  aggregatedSubcategories.map(s => {
                    const active = selectedSubIds.includes(s.id);
                    return (
                      <TouchableOpacity
                        key={s.id}
                        style={[styles.segmentItem, active && styles.segmentItemActive]}
                        onPress={() => {
                          setSelectedSubIds(prev => (prev.includes(s.id) ? prev.filter(x => x !== s.id) : [...prev, s.id]));
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.segmentIcon}>{s.icon || ''}</Text>
                        <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{s.name}</Text>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View style={{ paddingHorizontal: 8, paddingVertical: 6 }}>
                    <Text style={styles.helperText}>Selecciona categorías para ver subcategorías</Text>
                  </View>
                )}
              </View>
              {selectedSubIds.length > 0 ? (
                <Text style={styles.helperText}>{selectedSubIds.length} subcategorías seleccionadas</Text>
              ) : null}

              <Text style={styles.label}>Tags</Text>
              <TextInput
                value={tagsText}
                onChangeText={setTagsText}
                placeholder="ej: ropa, comida, celulares"
                style={styles.input}
                autoCapitalize="none"
              />
              {tagsNormalized.length > 0 ? (
                <View style={styles.chipsContainer}>
                  {tagsNormalized.map((t) => (
                    <View key={t} style={styles.chip}>
                      <Text style={styles.chipText}>{t}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

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

              <View style={styles.sectionBox}>
                <Text style={styles.sectionTitle}>Teléfonos</Text>
                <View style={{ gap: 10 }}>
                  {phones.map((p, idx) => (
                    <View key={idx} style={styles.phoneRow}>
                      <View style={[styles.phoneGroup, { flex: 1 }]}>
                        <Text style={styles.phoneLabel}>Título</Text>
                        <TextInput
                          value={p.type}
                          onChangeText={(v) => setPhones(prev => prev.map((x, i) => (i === idx ? { ...x, type: v } : x)))}
                          placeholder="Ej: Principal, Reservas, Ventas"
                          style={styles.input}
                        />
                        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.phoneLabel}>Código país</Text>
                            <TouchableOpacity
                              style={styles.dropdown}
                              onPress={() => setOpenCountryPickerIndex(prev => (prev === idx ? null : idx))}
                              activeOpacity={0.85}
                            >
                              <Text style={styles.dropdownText}>
                                {(() => {
                                  const item = COUNTRY_ITEMS.find(ci => ci.code === p.countryCode);
                                  const flag = item ? COUNTRY_FLAGS[item.label] : '';
                                  return item ? `${flag} ${item.label} ${item.code}` : p.countryCode;
                                })()}
                              </Text>
                              <Text style={styles.dropdownIcon}>▾</Text>
                            </TouchableOpacity>
                            {openCountryPickerIndex === idx ? (
                              <View style={styles.dropdownList}>
                                {COUNTRY_ITEMS.map(ci => (
                                  <TouchableOpacity
                                    key={ci.code}
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                      setPhones(prev => prev.map((x, i) => (i === idx ? { ...x, countryCode: ci.code } : x)));
                                      setOpenCountryPickerIndex(null);
                                    }}
                                    activeOpacity={0.8}
                                  >
                                    <Text style={styles.dropdownItemText}>
                                      {COUNTRY_FLAGS[ci.label]} {ci.label} {ci.code}
                                    </Text>
                                  </TouchableOpacity>
                                ))}
                              </View>
                            ) : null}
                          </View>
                          <View style={{ flex: 1.2 }}>
                            <Text style={styles.phoneLabel}>Número</Text>
                            <TextInput
                              value={p.number}
                              onChangeText={(v) => setPhones(prev => prev.map((x, i) => (i === idx ? { ...x, number: v } : x)))}
                              placeholder="320 123 4567"
                              style={styles.input}
                              keyboardType="phone-pad"
                            />
                          </View>
                        </View>
                      </View>
                      <View style={styles.phoneActions}>
                        <TouchableOpacity
                          style={styles.actionIcon}
                          onPress={() => setPhones(prev => [...prev, { type: '', countryCode: COUNTRY_ITEMS[0].code, number: '' }])}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.actionIconText}>＋</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionIcon, { opacity: phones.length > 1 ? 1 : 0.4 }]}
                          onPress={() =>
                            setPhones(prev => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev))
                          }
                          activeOpacity={0.85}
                          disabled={phones.length <= 1}
                        >
                          <Text style={styles.actionIconText}>−</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.sectionBox}>
                <Text style={styles.sectionTitle}>WhatsApp</Text>
                <View style={{ gap: 10 }}>
                  {whatsAppList.map((w, idx) => (
                    <View key={idx} style={styles.phoneRow}>
                      <View style={[styles.phoneGroup, { flex: 1 }]}>
                        <Text style={styles.phoneLabel}>Título</Text>
                        <TextInput
                          value={w.type}
                          onChangeText={(v) => setWhatsAppList(prev => prev.map((x, i) => (i === idx ? { ...x, type: v } : x)))}
                          placeholder="Ej: Principal, Reservas, Ventas"
                          style={styles.input}
                        />
                        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.phoneLabel}>Código país</Text>
                            <TouchableOpacity
                              style={styles.dropdown}
                              onPress={() => setOpenWhatsappPickerIndex(prev => (prev === idx ? null : idx))}
                              activeOpacity={0.85}
                            >
                              <Text style={styles.dropdownText}>
                                {(() => {
                                  const item = COUNTRY_ITEMS.find(ci => ci.code === w.countryCode);
                                  const flag = item ? COUNTRY_FLAGS[item.label] : '';
                                  return item ? `${flag} ${item.label} ${item.code}` : w.countryCode;
                                })()}
                              </Text>
                              <Text style={styles.dropdownIcon}>▾</Text>
                            </TouchableOpacity>
                            {openWhatsappPickerIndex === idx ? (
                              <View style={styles.dropdownList}>
                                {COUNTRY_ITEMS.map(ci => (
                                  <TouchableOpacity
                                    key={ci.code}
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                      setWhatsAppList(prev => prev.map((x, i) => (i === idx ? { ...x, countryCode: ci.code } : x)));
                                      setOpenWhatsappPickerIndex(null);
                                    }}
                                    activeOpacity={0.8}
                                  >
                                    <Text style={styles.dropdownItemText}>
                                      {COUNTRY_FLAGS[ci.label]} {ci.label} {ci.code}
                                    </Text>
                                  </TouchableOpacity>
                                ))}
                              </View>
                            ) : null}
                          </View>
                          <View style={{ flex: 1.2 }}>
                            <Text style={styles.phoneLabel}>Número</Text>
                            <TextInput
                              value={w.number}
                              onChangeText={(v) => setWhatsAppList(prev => prev.map((x, i) => (i === idx ? { ...x, number: v } : x)))}
                              placeholder="320 123 4567"
                              style={styles.input}
                              keyboardType="phone-pad"
                            />
                          </View>
                        </View>
                      </View>
                      <View style={styles.phoneActions}>
                        <TouchableOpacity
                          style={styles.actionIcon}
                          onPress={() => setWhatsAppList(prev => [...prev, { type: '', countryCode: COUNTRY_ITEMS[0].code, number: '' }])}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.actionIconText}>＋</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionIcon, { opacity: whatsAppList.length > 1 ? 1 : 0.4 }]}
                          onPress={() =>
                            setWhatsAppList(prev => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev))
                          }
                          activeOpacity={0.85}
                          disabled={whatsAppList.length <= 1}
                        >
                          <Text style={styles.actionIconText}>−</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.sectionBox}>
                <Text style={styles.sectionTitle}>Horario</Text>
                <View style={styles.dayRow}>
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayLabel}>Lunes</Text>
                    <TouchableOpacity
                      style={styles.dayClear}
                      onPress={() => setDailySchedule(prev => ({ ...prev, lunes: { start: '', end: '' } }))}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.dayClearText}>Limpiar</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dayPickers}>
                    <View style={styles.pickerBox}>
                      <Picker
                        selectedValue={dailySchedule.lunes.start}
                        onValueChange={(v) => setDailySchedule(prev => ({ ...prev, lunes: { ...prev.lunes, start: String(v) } }))}
                        style={styles.picker}
                      >
                        <Picker.Item label="Inicio" value="" />
                        {TIME_SLOTS.map(t => <Picker.Item key={`lunes-start-${t}`} label={t} value={t} />)}
                      </Picker>
                    </View>
                    <View style={styles.pickerBox}>
                      <Picker
                        selectedValue={dailySchedule.lunes.end}
                        onValueChange={(v) => setDailySchedule(prev => ({ ...prev, lunes: { ...prev.lunes, end: String(v) } }))}
                        style={styles.picker}
                      >
                        <Picker.Item label="Fin" value="" />
                        {TIME_SLOTS.map(t => <Picker.Item key={`lunes-end-${t}`} label={t} value={t} />)}
                      </Picker>
                    </View>
                  </View>
                </View>
                <View style={styles.dayRow}>
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayLabel}>Martes</Text>
                    <TouchableOpacity
                      style={styles.dayClear}
                      onPress={() => setDailySchedule(prev => ({ ...prev, martes: { start: '', end: '' } }))}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.dayClearText}>Limpiar</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dayPickers}>
                    <View style={styles.pickerBox}>
                      <Picker
                        selectedValue={dailySchedule.martes.start}
                        onValueChange={(v) => setDailySchedule(prev => ({ ...prev, martes: { ...prev.martes, start: String(v) } }))}
                        style={styles.picker}
                      >
                        <Picker.Item label="Inicio" value="" />
                        {TIME_SLOTS.map(t => <Picker.Item key={`martes-start-${t}`} label={t} value={t} />)}
                      </Picker>
                    </View>
                    <View style={styles.pickerBox}>
                      <Picker
                        selectedValue={dailySchedule.martes.end}
                        onValueChange={(v) => setDailySchedule(prev => ({ ...prev, martes: { ...prev.martes, end: String(v) } }))}
                        style={styles.picker}
                      >
                        <Picker.Item label="Fin" value="" />
                        {TIME_SLOTS.map(t => <Picker.Item key={`martes-end-${t}`} label={t} value={t} />)}
                      </Picker>
                    </View>
                  </View>
                </View>
                <View style={styles.dayRow}>
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayLabel}>Miércoles</Text>
                    <TouchableOpacity
                      style={styles.dayClear}
                      onPress={() => setDailySchedule(prev => ({ ...prev, miercoles: { start: '', end: '' } }))}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.dayClearText}>Limpiar</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dayPickers}>
                    <View style={styles.pickerBox}>
                      <Picker
                        selectedValue={dailySchedule.miercoles.start}
                        onValueChange={(v) => setDailySchedule(prev => ({ ...prev, miercoles: { ...prev.miercoles, start: String(v) } }))}
                        style={styles.picker}
                      >
                        <Picker.Item label="Inicio" value="" />
                        {TIME_SLOTS.map(t => <Picker.Item key={`miercoles-start-${t}`} label={t} value={t} />)}
                      </Picker>
                    </View>
                    <View style={styles.pickerBox}>
                      <Picker
                        selectedValue={dailySchedule.miercoles.end}
                        onValueChange={(v) => setDailySchedule(prev => ({ ...prev, miercoles: { ...prev.miercoles, end: String(v) } }))}
                        style={styles.picker}
                      >
                        <Picker.Item label="Fin" value="" />
                        {TIME_SLOTS.map(t => <Picker.Item key={`miercoles-end-${t}`} label={t} value={t} />)}
                      </Picker>
                    </View>
                  </View>
                </View>
                <View style={styles.dayRow}>
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayLabel}>Jueves</Text>
                    <TouchableOpacity
                      style={styles.dayClear}
                      onPress={() => setDailySchedule(prev => ({ ...prev, jueves: { start: '', end: '' } }))}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.dayClearText}>Limpiar</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dayPickers}>
                    <View style={styles.pickerBox}>
                      <Picker
                        selectedValue={dailySchedule.jueves.start}
                        onValueChange={(v) => setDailySchedule(prev => ({ ...prev, jueves: { ...prev.jueves, start: String(v) } }))}
                        style={styles.picker}
                      >
                        <Picker.Item label="Inicio" value="" />
                        {TIME_SLOTS.map(t => <Picker.Item key={`jueves-start-${t}`} label={t} value={t} />)}
                      </Picker>
                    </View>
                    <View style={styles.pickerBox}>
                      <Picker
                        selectedValue={dailySchedule.jueves.end}
                        onValueChange={(v) => setDailySchedule(prev => ({ ...prev, jueves: { ...prev.jueves, end: String(v) } }))}
                        style={styles.picker}
                      >
                        <Picker.Item label="Fin" value="" />
                        {TIME_SLOTS.map(t => <Picker.Item key={`jueves-end-${t}`} label={t} value={t} />)}
                      </Picker>
                    </View>
                  </View>
                </View>
                <View style={styles.dayRow}>
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayLabel}>Viernes</Text>
                    <TouchableOpacity
                      style={styles.dayClear}
                      onPress={() => setDailySchedule(prev => ({ ...prev, viernes: { start: '', end: '' } }))}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.dayClearText}>Limpiar</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dayPickers}>
                    <View style={styles.pickerBox}>
                      <Picker
                        selectedValue={dailySchedule.viernes.start}
                        onValueChange={(v) => setDailySchedule(prev => ({ ...prev, viernes: { ...prev.viernes, start: String(v) } }))}
                        style={styles.picker}
                      >
                        <Picker.Item label="Inicio" value="" />
                        {TIME_SLOTS.map(t => <Picker.Item key={`viernes-start-${t}`} label={t} value={t} />)}
                      </Picker>
                    </View>
                    <View style={styles.pickerBox}>
                      <Picker
                        selectedValue={dailySchedule.viernes.end}
                        onValueChange={(v) => setDailySchedule(prev => ({ ...prev, viernes: { ...prev.viernes, end: String(v) } }))}
                        style={styles.picker}
                      >
                        <Picker.Item label="Fin" value="" />
                        {TIME_SLOTS.map(t => <Picker.Item key={`viernes-end-${t}`} label={t} value={t} />)}
                      </Picker>
                    </View>
                  </View>
                </View>
                <View style={styles.dayRow}>
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayLabel}>Sábado</Text>
                    <TouchableOpacity
                      style={styles.dayClear}
                      onPress={() => setDailySchedule(prev => ({ ...prev, sabado: { start: '', end: '' } }))}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.dayClearText}>Limpiar</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dayPickers}>
                    <View style={styles.pickerBox}>
                      <Picker
                        selectedValue={dailySchedule.sabado.start}
                        onValueChange={(v) => setDailySchedule(prev => ({ ...prev, sabado: { ...prev.sabado, start: String(v) } }))}
                        style={styles.picker}
                      >
                        <Picker.Item label="Inicio" value="" />
                        {TIME_SLOTS.map(t => <Picker.Item key={`sabado-start-${t}`} label={t} value={t} />)}
                      </Picker>
                    </View>
                    <View style={styles.pickerBox}>
                      <Picker
                        selectedValue={dailySchedule.sabado.end}
                        onValueChange={(v) => setDailySchedule(prev => ({ ...prev, sabado: { ...prev.sabado, end: String(v) } }))}
                        style={styles.picker}
                      >
                        <Picker.Item label="Fin" value="" />
                        {TIME_SLOTS.map(t => <Picker.Item key={`sabado-end-${t}`} label={t} value={t} />)}
                      </Picker>
                    </View>
                  </View>
                </View>
                <View style={styles.dayRow}>
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayLabel}>Domingo</Text>
                    <TouchableOpacity
                      style={styles.dayClear}
                      onPress={() => setDailySchedule(prev => ({ ...prev, domingo: { start: '', end: '' } }))}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.dayClearText}>Limpiar</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dayPickers}>
                    <View style={styles.pickerBox}>
                      <Picker
                        selectedValue={dailySchedule.domingo.start}
                        onValueChange={(v) => setDailySchedule(prev => ({ ...prev, domingo: { ...prev.domingo, start: String(v) } }))}
                        style={styles.picker}
                      >
                        <Picker.Item label="Inicio" value="" />
                        {TIME_SLOTS.map(t => <Picker.Item key={`domingo-start-${t}`} label={t} value={t} />)}
                      </Picker>
                    </View>
                    <View style={styles.pickerBox}>
                      <Picker
                        selectedValue={dailySchedule.domingo.end}
                        onValueChange={(v) => setDailySchedule(prev => ({ ...prev, domingo: { ...prev.domingo, end: String(v) } }))}
                        style={styles.picker}
                      >
                        <Picker.Item label="Fin" value="" />
                        {TIME_SLOTS.map(t => <Picker.Item key={`domingo-end-${t}`} label={t} value={t} />)}
                      </Picker>
                    </View>
                  </View>
                </View>
              </View>

              <Text style={styles.label}>Website</Text>
              <TextInput value={website} onChangeText={setWebsite} placeholder="https://buskdos.com" style={styles.input} keyboardType="url" />

              <View style={styles.sectionBox}>
                <Text style={styles.sectionTitle}>Emails</Text>
                <View style={{ gap: 10 }}>
                  {emailsList.map((em, idx) => (
                    <View key={idx} style={styles.phoneRow}>
                      <View style={[styles.phoneGroup, { flex: 1 }]}>
                        <Text style={styles.phoneLabel}>Título</Text>
                        <TextInput
                          value={em.type}
                          onChangeText={(v) => setEmailsList(prev => prev.map((x, i) => (i === idx ? { ...x, type: v } : x)))}
                          placeholder="Ej: Principal, Ventas, Gerencia"
                          style={styles.input}
                        />
                        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                          <View style={{ flex: 1.6 }}>
                            <Text style={styles.phoneLabel}>Email</Text>
                            <TextInput
                              value={em.email}
                              onChangeText={(v) => setEmailsList(prev => prev.map((x, i) => (i === idx ? { ...x, email: v } : x)))}
                              placeholder="info@buskdos.com.co"
                              style={styles.input}
                              keyboardType="email-address"
                              autoCapitalize="none"
                            />
                          </View>
                        </View>
                      </View>
                      <View style={styles.phoneActions}>
                        <TouchableOpacity
                          style={styles.actionIcon}
                          onPress={() => setEmailsList(prev => [...prev, { type: '', email: '' }])}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.actionIconText}>＋</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionIcon, { opacity: emailsList.length > 1 ? 1 : 0.4 }]}
                          onPress={() =>
                            setEmailsList(prev => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev))
                          }
                          activeOpacity={0.85}
                          disabled={emailsList.length <= 1}
                        >
                          <Text style={styles.actionIconText}>−</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <Text style={styles.label}>Redes sociales</Text>
              <TextInput value={facebook} onChangeText={(v) => setFacebook(normalizeSocial('facebook', v))} placeholder="https://facebook.com/buskdos" style={styles.input} keyboardType="url" />
              <TextInput value={instagram} onChangeText={(v) => setInstagram(normalizeSocial('instagram', v))} placeholder="https://instagram.com/buskdos" style={styles.input} keyboardType="url" />
              <TextInput value={tiktok} onChangeText={(v) => setTiktok(normalizeSocial('tiktok', v))} placeholder="https://tiktok.com/@buskdos" style={styles.input} keyboardType="url" />
              <TextInput value={twitter} onChangeText={(v) => setTwitter(normalizeSocial('twitter', v))} placeholder="https://twitter.com/buskdos" style={styles.input} keyboardType="url" />
              <TextInput value={youtube} onChangeText={(v) => setYoutube(normalizeSocial('youtube', v))} placeholder="https://youtube.com/buskdos" style={styles.input} keyboardType="url" />

              <Text style={styles.label}>Apps de delivery</Text>
              <TextInput value={rappi} onChangeText={(v) => setRappi(normalizeDelivery('rappi', v))} placeholder="https://rappi.com/buskdos" style={styles.input} keyboardType="url" />
              <TextInput value={didifood} onChangeText={(v) => setDidifood(normalizeDelivery('didifood', v))} placeholder="https://didifood.com/buskdos" style={styles.input} keyboardType="url" />
              <TextInput value={ubereats} onChangeText={(v) => setUbereats(normalizeDelivery('ubereats', v))} placeholder="https://ubereats.com/buskdos" style={styles.input} keyboardType="url" />
              <TextInput value={ifood} onChangeText={(v) => setIfood(normalizeDelivery('ifood', v))} placeholder="https://ifood.com/buskdos" style={styles.input} keyboardType="url" />
              <TextInput value={domicilios} onChangeText={(v) => setDomicilios(normalizeDelivery('domicilios', v))} placeholder="https://domicilios.com/buskdos" style={styles.input} keyboardType="url" />

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
  segmentIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    paddingHorizontal: 4,
    marginTop: -6,
    marginBottom: 8,
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
  addressText: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  addressPlaceholder: {
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
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 4,
    marginTop: 8,
  },
  sectionBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fff',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '700',
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  chip: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 0.2,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  phoneGroup: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 8,
    backgroundColor: '#fff',
    gap: 6,
  },
  phoneLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  countryCodesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  codeItem: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  codeItemActive: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  codeText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '700',
  },
  codeTextActive: {
    color: '#111827',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  dropdownIcon: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  dropdownList: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  dayRow: {
    marginBottom: 8,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  dayClear: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dayClearText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '700',
  },
  dayPickers: {
    flexDirection: 'row',
    gap: 8,
  },
  pickerBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    color: '#111827',
  },
  phoneActions: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIconText: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '700',
    lineHeight: 18,
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
