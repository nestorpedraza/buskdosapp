import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
          }
        : {
            type,
            personalName: personalName.trim(),
            nationalId: nationalId.trim(),
          };
    router.push('/organizations');
  };

  const handleCancel = () => router.back();

  return (
    <AppSafeArea activeRoute="/organizations">
      <View style={[styles.content, { paddingBottom: bottomPadding }]}>
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
              <Text style={styles.label}>Sede principal</Text>
              <TextInput
                value={hqAddress}
                onChangeText={setHqAddress}
                placeholder="Av. Libertad 123, Bogotá"
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
