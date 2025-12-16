import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import MapView, { PROVIDER_GOOGLE, UrlTile } from 'react-native-maps';

interface AppMapProps {
    style?: StyleProp<ViewStyle>;
}

export default function AppMap({ style }: AppMapProps) {
    return (
        <MapView
            provider={PROVIDER_GOOGLE}
            style={style}
            initialRegion={{
                latitude: 4.7110,
                longitude: -74.0721,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }}
        >
            <UrlTile
                /**
                 * Usamos CartoDB Voyager para evitar el bloqueo de política de uso de los servidores de OSM.
                 * OSM requiere un User-Agent válido que UrlTile no envía por defecto.
                 */
                urlTemplate="https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                maximumZ={19}
                zIndex={-1}
            />
        </MapView>
    );
}
