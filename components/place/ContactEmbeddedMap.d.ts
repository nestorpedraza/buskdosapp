import type { ViewStyle } from 'react-native';
declare module './ContactEmbeddedMap' {
  const ContactEmbeddedMap: (props: {
    coordinates: { latitude: number; longitude: number };
    style?: ViewStyle | any;
  }) => JSX.Element;
  export default ContactEmbeddedMap;
}
