import React from 'react';
import { StyleProp, View, ViewStyle, Text } from 'react-native';

export type MapRegion = { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };

interface MapPickerProps {
  initialRegion: MapRegion;
  style?: StyleProp<ViewStyle>;
}

export default function MapPicker({ style }: MapPickerProps) {
  return (
    <View style={[{ width: '100%', height: 180, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }, style as any]}>
      <Text style={{ color: '#6b7280' }}>Mapa no disponible en web</Text>
    </View>
  );
}
