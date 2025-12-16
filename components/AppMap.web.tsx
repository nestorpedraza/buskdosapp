import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

interface AppMapProps {
    style?: StyleProp<ImageStyle>;
}

export default function AppMap({ style }: AppMapProps) {
    return (
        <Image
            source={require('../assets/images/mapa.png')}
            style={style}
            resizeMode="cover"
        />
    );
}
