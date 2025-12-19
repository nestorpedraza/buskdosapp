import React from 'react';
import { Image as RNImage, ViewStyle } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function ContactEmbeddedMap({
  coordinates,
  style,
}: {
  coordinates: { latitude: number; longitude: number };
  style: ViewStyle | any;
}) {
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={style}
      pointerEvents="none"
      scrollEnabled={false}
      zoomEnabled={false}
      rotateEnabled={false}
      pitchEnabled={false}
      initialRegion={{
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}
    >
      <Marker
        coordinate={{ latitude: coordinates.latitude, longitude: coordinates.longitude }}
        title="Ubicación"
        flat
      >
        <RNImage
          source={require('../../assets/images/icon-map.png')}
          style={{ width: 32, height: 32 }}
        />
      </Marker>
    </MapView>
  );
}
