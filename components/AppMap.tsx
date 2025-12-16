import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleProp, ViewStyle } from 'react-native';
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
    const [tracksView, setTracksView] = useState(true);

    useEffect(() => {
        onMapRef?.(mapRef.current);
    }, [onMapRef]);

    useEffect(() => {
        if (!mapRef.current || !markers) return;
        if (markers.length === 0) {
            mapRef.current.animateToRegion({
                latitude: 6.2442,
                longitude: -75.5812,
                latitudeDelta: 0.08,
                longitudeDelta: 0.08,
            }, 300);
            return;
        }
        if (markers.length === 1) {
            const m = markers[0];
            mapRef.current.animateToRegion({
                latitude: m.lat,
                longitude: m.lng,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            }, 300);
            return;
        }
        const coords = markers.map(m => ({
            latitude: m.lat,
            longitude: m.lng,
        }));
        mapRef.current.fitToCoordinates(coords, {
            edgePadding: { top: 80, right: 80, bottom: 240, left: 80 },
            animated: true,
        });
    }, [markers]);

    useEffect(() => {
        setTracksView(true);
        const t = setTimeout(() => setTracksView(false), 600);
        return () => clearTimeout(t);
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
            {markers?.map((marker, idx) => (
                <Marker
                    key={marker.id}
                    coordinate={{ latitude: marker.lat, longitude: marker.lng }}
                    title={marker.name}
                    description={`${marker.category} - ⭐ ${marker.rating}`}
                    anchor={{ x: 0.5, y: 1.0 }}
                    flat
                    tracksViewChanges={tracksView}
                    zIndex={1000 - idx}
                >
                    <Image
                        source={require('../assets/images/icon-map.png')}
                        style={{ width: 28, height: 28 }}
                    />
                </Marker>
            ))}
        </MapView>
    );
}
