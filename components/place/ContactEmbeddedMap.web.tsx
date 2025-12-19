import React from 'react';
import { Image as RNImage, ViewStyle } from 'react-native';

export default function ContactEmbeddedMap({
  coordinates,
  style,
}: {
  coordinates: { latitude: number; longitude: number };
  style: ViewStyle | any;
}) {
  return (
    <RNImage
      source={require('../../assets/images/mapa.png')}
      style={style}
      resizeMode="cover"
    />
  );
}
