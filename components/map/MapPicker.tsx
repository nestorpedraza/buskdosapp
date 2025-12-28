import React from 'react';
import { Platform, StyleProp, ViewStyle } from 'react-native';

export type MapRegion = { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };

interface MapPickerProps {
  initialRegion: MapRegion;
  style?: StyleProp<ViewStyle>;
  selectedLatitude?: number;
  selectedLongitude?: number;
  onMapPress?: (e: any) => void;
  onMarkerDragEnd?: (lat: number, lng: number) => void;
}

const Impl = Platform.OS !== 'web'
  ? require('./MapPicker.native').default
  : require('./MapPicker.web').default;

export default function MapPicker(props: MapPickerProps) {
  const C = Impl as React.ComponentType<MapPickerProps>;
  return <C {...props} />;
}
