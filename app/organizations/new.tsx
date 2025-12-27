import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Image as RNImage, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppSafeArea from '../../components/AppSafeArea';

type EntityType = 'juridica' | 'natural';

export default function NewOrganizationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 72 : 62;
  const bottomPadding = TAB_BAR_HEIGHT + insets.bottom + 16;
  const [type, setType] = React.useState<EntityType>('juridica');
  const [legalName, setLegalName] = React.useState('');
  const [taxId, setTaxId] = React.useState('');
  const [corporateEmail, setCorporateEmail] = React.useState('');
  const [hqAddress, setHqAddress] = React.useState('');
  const [hqAddressComplement, setHqAddressComplement] = React.useState('');
  const [latitude, setLatitude] = React.useState('');
  const [longitude, setLongitude] = React.useState('');
  const [hasSelectedCoords, setHasSelectedCoords] = React.useState(false);
  const initialRegion: Region = React.useMemo(() => ({
    latitude: 6.2465,
    longitude: -75.5740,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  }), []);
  const [region, setRegion] = React.useState<Region>(initialRegion);
  const mapRef = React.useRef<MapView>(null);
  const [personalName, setPersonalName] = React.useState('');
  const [nationalId, setNationalId] = React.useState('');

  const canSave =
    (type === 'juridica' ? legalName.trim() && taxId.trim() : personalName.trim() && nationalId.trim()) ? true : false;

  const handleSave = () => {
    const payload =
      type === 'juridica'
        ? {
          type,
          legalName: legalName.trim(),
          taxId: taxId.trim(),
          corporateEmail: corporateEmail.trim(),
          hqAddress: hqAddress.trim(),
          hqAddressComplement: hqAddressComplement.trim(),
          hqCoordinates: {
            latitude: Number(latitude) || undefined,
            longitude: Number(longitude) || undefined,
          },
        }
        : {
          type,
          personalName: personalName.trim(),
          nationalId: nationalId.trim(),
        };
    router.push('/organizations');
  };

  const handleCancel = () => router.back();

  const updateAddressFromCoords = React.useCallback(async (lat: number, lng: number) => {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      const first = results?.[0];
      if (first) {
        const composed =
          [first.street, first.name, first.city, first.region, first.postalCode, first.country]
            .filter(Boolean)
            .join(', ');
        setHqAddress(composed);
      } else {
        setHqAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    } catch {
      setHqAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
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
    mapRef.current?.animateToRegion(next, 400);
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
        // mantiene región por defecto
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppSafeArea activeRoute="/organizations">
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Registrar organización</Text>
            <Text style={styles.subtitle}>Completa los datos y guarda</Text>
          </View>
        </View>

        <View style={styles.segmented}>
          <TouchableOpacity
            style={[styles.segmentItem, type === 'juridica' && styles.segmentItemActive]}
            onPress={() => setType('juridica')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, type === 'juridica' && styles.segmentTextActive]}>Empresa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentItem, type === 'natural' && styles.segmentItemActive]}
            onPress={() => setType('natural')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, type === 'natural' && styles.segmentTextActive]}>Persona</Text>
          </TouchableOpacity>
        </View>

        {type === 'juridica' ? (
          <View style={styles.form}>
            <View style={styles.formRow}>
              <Text style={styles.label}>Razón social</Text>
              <TextInput
                value={legalName}
                onChangeText={setLegalName}
                placeholder="Inversiones Globales S.A."
                style={styles.input}
              />
            </View>
            <View style={styles.formRow}>
              <Text style={styles.label}>NIT / RUC / EIN</Text>
              <TextInput value={taxId} onChangeText={setTaxId} placeholder="NIT 901234567-8" style={styles.input} />
            </View>
            <View style={styles.formRow}>
              <Text style={styles.label}>Correo corporativo</Text>
              <TextInput
                value={corporateEmail}
                onChangeText={setCorporateEmail}
                placeholder="legal@empresa.com"
                style={styles.input}
                keyboardType="email-address"
              />
            </View>
            <View style={styles.formRow}>
              <Text style={styles.label}>Ubicación sede principal</Text>
              <View style={styles.mapBox}>
                <MapView
                  ref={mapRef}
                  style={styles.map}
                  initialRegion={region}
                  onPress={handleMapPress}
                >
                  {hasSelectedCoords ? (
                    <Marker
                      draggable
                      coordinate={{ latitude: Number(latitude) || initialRegion.latitude, longitude: Number(longitude) || initialRegion.longitude }}
                      onDragEnd={(e) => handleMarkerDragEnd(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)}
                      title="Posición seleccionada"
                    >
                      <RNImage
                        source={require('../../assets/images/icon-map.png')}
                        style={{ width: 36, height: 36 }}
                      />
                    </Marker>
                  ) : null}
                </MapView>
                <Text style={styles.mapHint}>Toca el mapa para seleccionar la ubicación</Text>
              </View>
            </View>
            <View style={styles.formRow}>
              <Text style={styles.label}>Dirección sede principal</Text>
              <View style={[styles.input, styles.inputDisabled]}>
                <Text style={[styles.addressText, !hqAddress && styles.addressPlaceholder]}>
                  {hqAddress || 'Se llena automáticamente al seleccionar en el mapa'}
                </Text>
              </View>
            </View>
            <View style={styles.formRow}>
              <Text style={styles.label}>Complementos dirección sede</Text>
              <TextInput
                value={hqAddressComplement}
                onChangeText={setHqAddressComplement}
                placeholder="Piso 5, Oficina 503"
                style={styles.input}
              />
            </View>
          </View>
        ) : (
          <View style={styles.form}>
            <View style={styles.formRow}>
              <Text style={styles.label}>Nombre completo</Text>
              <TextInput
                value={personalName}
                onChangeText={setPersonalName}
                placeholder="María Fernanda López"
                style={styles.input}
              />
            </View>
            <View style={styles.formRow}>
              <Text style={styles.label}>Documento nacional</Text>
              <TextInput
                value={nationalId}
                onChangeText={setNationalId}
                placeholder="DNI 45213876"
                style={styles.input}
              />
            </View>
          </View>
        )}

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
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    paddingHorizontal: 8,
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
