import React from 'react';
import { Image as RNImage, StyleProp, ViewStyle } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export type MapRegion = { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };

interface MapPickerProps {
  initialRegion: MapRegion;
  style?: StyleProp<ViewStyle>;
  selectedLatitude?: number;
  selectedLongitude?: number;
  onMapPress?: (e: any) => void;
  onMarkerDragEnd?: (lat: number, lng: number) => void;
}

export default function MapPicker({
  initialRegion,
  style,
  selectedLatitude,
  selectedLongitude,
  onMapPress,
  onMarkerDragEnd,
}: MapPickerProps) {
  return (
    <MapView
      style={style}
      initialRegion={initialRegion}
      onPress={onMapPress}
    >
      {typeof selectedLatitude === 'number' && typeof selectedLongitude === 'number' ? (
        <Marker
          draggable
          coordinate={{ latitude: selectedLatitude, longitude: selectedLongitude }}
          onDragEnd={(e) => onMarkerDragEnd?.(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)}
          title="Posición seleccionada"
        >
          <RNImage
            source={require('../../assets/images/icon-map.png')}
            style={{ width: 36, height: 36 }}
          />
        </Marker>
      ) : null}
    </MapView>
  );
}
