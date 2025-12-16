import React, { useEffect } from 'react';
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
    onMapRef?: (ref: null) => void;
}

export default function AppMap({ style, markers, onMapRef }: AppMapProps) {
    useEffect(() => {
        onMapRef?.(null);
    }, [onMapRef]);

    return (
        <Image
            source={require('../assets/images/mapa.png')}
            style={style}
            resizeMode="cover"
        />
    );
}
