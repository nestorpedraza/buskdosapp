import React from 'react';
import { Platform, ViewStyle } from 'react-native';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Impl = Platform.OS === 'web'
  ? require('./ContactEmbeddedMap.web').default
  : require('./ContactEmbeddedMap.native').default;

export default function ContactEmbeddedMap({
  coordinates,
  style,
}: {
  coordinates: { latitude: number; longitude: number };
  style?: ViewStyle | any;
}) {
  return <Impl coordinates={coordinates} style={style} />;
}
