import React, { useEffect, useRef } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, UrlTile } from 'react-native-maps';

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
    style?: StyleProp<ViewStyle>;
    markers?: MapMarker[];
    onMapRef?: (ref: MapView | null) => void;
}

export default function AppMap({ style, markers, onMapRef }: AppMapProps) {
    const medellinCoords = {
        latitude: 6.2442,
        longitude: -75.5812,
    };

    const mapRef = useRef<MapView>(null);

    useEffect(() => {
        onMapRef?.(mapRef.current);
    }, [onMapRef]);

    useEffect(() => {
        if (mapRef.current && markers && markers.length > 0) {
            const coords = markers.map(m => ({
                latitude: m.lat,
                longitude: m.lng,
            }));
            mapRef.current.fitToCoordinates(coords, {
                edgePadding: { top: 80, right: 80, bottom: 240, left: 80 },
                animated: true,
            });
        }
    }, [markers]);

    return (
        <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={style}
            initialRegion={{
                ...medellinCoords,
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

            {/* Marcadores dinámicos */}
            {markers?.map((marker) => (
                <Marker
                    key={marker.id}
                    coordinate={{ latitude: marker.lat, longitude: marker.lng }}
                    title={marker.name}
                    description={`${marker.category} - ⭐ ${marker.rating}`}
                />
            ))}
        </MapView>
    );
}
