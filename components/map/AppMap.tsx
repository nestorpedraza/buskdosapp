import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { Image as RNImage, Platform, StyleProp, View, ViewStyle, Text } from 'react-native';
const RNMaps = Platform.OS !== 'web' ? require('react-native-maps') : null;
const MapViewComponent = RNMaps ? RNMaps.default : null;
const MarkerComponent = RNMaps ? RNMaps.Marker : null;
const CircleComponent = RNMaps ? RNMaps.Circle : null;
const PROVIDER_GOOGLE = RNMaps ? RNMaps.PROVIDER_GOOGLE : undefined;

export interface MapMarker {
    id: string;
    name: string;
    category: string;
    tag?: string;
    rating: number;
    distance: string;
    lat: number;
    lng: number;
    isVerified?: boolean;
}

interface AppMapProps {
    style?: StyleProp<ViewStyle>;
    markers?: MapMarker[];
    onMapRef?: (ref: any | null) => void;
    radiusKm?: number;
    onMarkerPress?: (marker: MapMarker) => void;
}

export default function AppMap({ style, markers, onMapRef, radiusKm, onMarkerPress }: AppMapProps) {
    const medellinCoords = {
        latitude: 6.2442,
        longitude: -75.5812,
    };

    const mapRef = useRef<any>(null);
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
            if (userLocation) {
                mapRef.current.animateToRegion({
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }, 300);
            }
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
        if (!mapRef.current || !userLocation || !radiusKm) return;
        const lat = userLocation.latitude;
        const rad = (lat * Math.PI) / 180;
        const base = Math.max(radiusKm * 2, 1);
        const latDelta = base / 111;
        const lonDelta = base / (111 * Math.max(0.1, Math.cos(rad)));
        mapRef.current.animateToRegion({
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: Math.max(0.01, latDelta),
            longitudeDelta: Math.max(0.01, lonDelta),
        }, 250);
    }, [radiusKm, userLocation]);
    useEffect(() => {
        setTracksView(true);
        const t = setTimeout(() => setTracksView(false), 500);
        return () => clearTimeout(t);
    }, [markers]);

    if (Platform.OS === 'web' || !MapViewComponent) {
        return (
            <View style={[{ width: '100%', height: 180, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }, style as any]}>
                <Text style={{ color: '#6b7280' }}>Mapa no disponible en web</Text>
            </View>
        );
    }
    return (
        <MapViewComponent
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


            {markers?.map((marker, idx) => (
                <MarkerComponent
                    key={marker.id}
                    coordinate={{ latitude: marker.lat, longitude: marker.lng }}
                    title={marker.name}
                    description={`${marker.category} - ${marker.isVerified ? '✅ Verificado' : '❌ Sin verificar'} - ⭐ ${marker.rating} - 📌 ${marker.lat.toFixed(4)}, ${marker.lng.toFixed(4)}`}
                    anchor={{ x: 0.5, y: 1.0 }}
                    flat
                    tracksViewChanges={tracksView}
                    zIndex={1000 - idx}
                    onCalloutPress={() => onMarkerPress?.(marker)}
                >
                    <RNImage
                        source={require('../../assets/images/icon-map.png')}
                    />
                </MarkerComponent>
            ))}
            {radiusKm && userLocation && (
                <CircleComponent
                    center={userLocation}
                    radius={radiusKm * 1000}
                    strokeColor="rgba(153,0,255,0.6)"
                    fillColor="rgba(153,0,255,0.12)"
                    zIndex={5}
                />
            )}
        </MapViewComponent>
    );
}
