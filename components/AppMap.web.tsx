import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

// Definimos la misma interfaz para mantener compatibilidad
export interface MapMarker {
    id: string;
    name: string;
    category: string;
    rating: number;
    distance: string;
    lat: number;
    lng: number;
}

interface AppMapProps {
    style?: StyleProp<ImageStyle>;
    markers?: MapMarker[];
}

export default function AppMap({ style, markers }: AppMapProps) {
    return (
        <Image
            source={require('../assets/images/mapa.png')}
            style={style}
            resizeMode="cover"
        />
    );
}
