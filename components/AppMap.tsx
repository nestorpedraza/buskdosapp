import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { Image as RNImage, StyleProp, ViewStyle } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export interface MapMarker {
    id: string;
    name: string;
    category: string;
    tag?: string;
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
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
    const [tracksView, setTracksView] = useState(true);

    useEffect(() => {
        onMapRef?.(mapRef.current);
    }, [onMapRef]);

    useEffect(() => {
        let isMounted = true;
        Location.requestForegroundPermissionsAsync().then((res) => {
            const granted = res.status === 'granted';
            if (!isMounted) return;
            setLocationPermissionGranted(granted);
            if (granted) {
                Location.getCurrentPositionAsync({}).then((pos) => {
                    if (!isMounted) return;
                    const coords = {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                    };
                    setUserLocation(coords);
                }).catch(() => { });
            }
        }).catch(() => { });
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current || !markers) return;
        if (markers.length === 0) {
            const target = userLocation || medellinCoords;
            mapRef.current.animateToRegion({
                latitude: target.latitude,
                longitude: target.longitude,
                latitudeDelta: userLocation ? 0.02 : 0.08,
                longitudeDelta: userLocation ? 0.02 : 0.08,
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
    }, [markers, userLocation]);

    useEffect(() => {
        setTracksView(true);
        const t = setTimeout(() => setTracksView(false), 500);
        return () => clearTimeout(t);
    }, [markers]);

    return (
        <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={style}
            showsUserLocation={locationPermissionGranted}
            initialRegion={{
                ...medellinCoords,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }}
        >


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
                    <RNImage
                        source={require('../assets/images/icon-map.png')}
                        style={{ width: 32, height: 32 }}
                    />
                </Marker>
            ))}
        </MapView>
    );
}
