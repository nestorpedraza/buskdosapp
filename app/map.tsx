import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Dimensions,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import type MapView from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppMap, { MapMarker } from '../components/AppMap';
import HomeHeader from '../components/HomeHeader';
import HomeTabBar from '../components/HomeTabBar';
import { getCategories, getMapMarkers } from '../data/dataService';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
    const router = useRouter();
    const { placeId } = useLocalSearchParams<{ placeId?: string }>();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
    const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const mapRef = React.useRef<MapView | null>(null);

    const categoryIconByName: Record<string, string> = {
        Tiendas: '🛍️',
        Restaurantes: '🍽️',
        Cafeterías: '☕',
        Salud: '🏥',
        Deportes: '💪',
        default: '🌐',
    };
    const categories = useMemo(() => {
        const cats = getCategories();
        return [{ id: 'all', name: 'Todos' } as any]
            .concat(cats.map(c => ({ ...c, icon: categoryIconByName[c.name] || '🌐' })));
    }, []);

    const nearbyPlaces = useMemo<MapMarker[]>(() => getMapMarkers(), []);

    const filteredPlaces = useMemo(() => {
        const base = nearbyPlaces;
        if (!selectedCategory || selectedCategory === 'all') return base;
        const cat: any = (categories as any[]).find(c => c.id === selectedCategory);
        const typeByName: Record<string, string> = {
            Tiendas: 'shop',
            Restaurantes: 'restaurant',
            Cafeterías: 'cafe',
            Salud: 'health',
            Deportes: 'gym',
        };
        const type = cat ? typeByName[cat.name] : undefined;
        let out = type ? base.filter(p => p.category === type) : base;
        if (selectedSubcategoryId && cat?.subcategories) {
            const subName = cat.subcategories.find((s: any) => s.id === selectedSubcategoryId)?.name;
            if (subName) out = out.filter(p => (p.tag || '').toLowerCase() === subName.toLowerCase());
        }
        return out;
    }, [nearbyPlaces, categories, selectedCategory, selectedSubcategoryId]);

    const markersToShow = selectedPlaceId
        ? filteredPlaces.filter(p => p.id === selectedPlaceId)
        : filteredPlaces;

    const openNearbyModal = () => setIsModalOpen(true);
    const closeNearbyModal = () => setIsModalOpen(false);

    const recenterMedellin = () => {
        mapRef.current?.animateToRegion({
            latitude: 6.2442,
            longitude: -75.5812,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
        }, 500);
    };

    const handleSelectPlace = (place: MapMarker) => {
        setSelectedPlaceId(place.id);
        mapRef.current?.animateToRegion({
            latitude: place.lat,
            longitude: place.lng,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
        }, 500);
    };

    React.useEffect(() => {
        if (placeId) {
            setSelectedPlaceId(String(placeId));
            const target = nearbyPlaces.find(p => p.id === String(placeId));
            if (target) {
                mapRef.current?.animateToRegion({
                    latitude: target.lat,
                    longitude: target.lng,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }, 500);
            }
        }
    }, [placeId]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <HomeHeader />
                <View style={styles.mapContainer}>
                    <AppMap
                        style={styles.mapImage}
                        markers={markersToShow}
                        onMapRef={(ref) => { mapRef.current = ref; }}
                    />

                    <View style={styles.floatingSearchContainer}>
                        <View style={styles.searchBar}>
                            <Text style={styles.searchIcon}>🔍</Text>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Buscar lugares cercanos..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholderTextColor="#888"
                            />
                        </View>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.categoryScrollView}
                        contentContainerStyle={styles.categoryContent}
                    >
                        {categories.map((cat: any) => (
                            <Pressable
                                key={cat.id}
                                style={[
                                    styles.categoryPill,
                                    selectedCategory === cat.id && styles.categoryPillActive
                                ]}
                                onPress={() => {
                                    setSelectedCategory(cat.id);
                                    setSelectedSubcategoryId(null);
                                    setSelectedPlaceId(null);
                                }}
                            >
                                <Text style={styles.categoryIcon}>{cat.icon || '🌐'}</Text>
                                <Text style={[
                                    styles.categoryText,
                                    selectedCategory === cat.id && styles.categoryTextActive
                                ]}>
                                    {cat.name}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>

                    {!!selectedCategory && selectedCategory !== 'all' && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={[styles.categoryScrollView, { top: 150 }]}
                            contentContainerStyle={styles.categoryContent}
                        >
                            {((categories as any[]).find((c: any) => c.id === selectedCategory)?.subcategories || []).map((sc: any) => (
                                <Pressable
                                    key={sc.id}
                                    style={[
                                        styles.categoryPill,
                                        selectedSubcategoryId === sc.id && styles.categoryPillActive
                                    ]}
                                    onPress={() => setSelectedSubcategoryId(sc.id)}
                                >
                                    <Text style={styles.categoryIcon}>{sc.icon || '🏷️'}</Text>
                                    <Text style={[
                                        styles.categoryText,
                                        selectedSubcategoryId === sc.id && styles.categoryTextActive
                                    ]}>
                                        {sc.name}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    )}

                    <Pressable style={styles.recenterButton} onPress={recenterMedellin}>
                        <Text style={styles.recenterIcon}>📍</Text>
                    </Pressable>
                    <Pressable style={styles.nearbyFab} onPress={openNearbyModal}>
                        <Text style={styles.nearbyFabIcon}>📋</Text>
                    </Pressable>
                </View>

                <Modal
                    visible={isModalOpen}
                    animationType="slide"
                    transparent
                    onRequestClose={closeNearbyModal}
                >
                    <Pressable style={styles.modalBackdrop} onPress={closeNearbyModal} />
                    <View style={styles.modalSheet}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.bottomSheetTitle}>Lugares cercanos</Text>
                            <Pressable onPress={closeNearbyModal}>
                                <Text style={styles.expandIcon}>✕</Text>
                            </Pressable>
                        </View>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.placesContent}
                        >
                            {filteredPlaces.map((place) => (
                                <Pressable key={place.id} style={styles.placeCard} onPress={() => {
                                    closeNearbyModal();
                                    handleSelectPlace(place);
                                }}>
                                    <View style={styles.placeIcon}>
                                        <Text style={styles.placeIconText}>
                                            {place.category === 'restaurant' ? '🍽️' :
                                                place.category === 'cafe' ? '☕' :
                                                    place.category === 'shop' ? '🛍️' :
                                                        place.category === 'gym' ? '💪' : '🏥'}
                                        </Text>
                                    </View>
                                    <View style={styles.placeInfo}>
                                        <Text style={styles.placeName}>{place.name}</Text>
                                        <View style={styles.placeDetails}>
                                            <Text style={styles.placeRating}>⭐ {place.rating}</Text>
                                            <Text style={styles.placeDistance}>📍 {place.distance}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.placeArrow}>›</Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                </Modal>

                <HomeTabBar activeRoute="/map" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? 0 : 0,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    mapImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    floatingSearchContainer: {
        position: 'absolute',
        top: 10,
        left: 20,
        right: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#333',
    },
    categoryScrollView: {
        position: 'absolute',
        top: 90,
        left: 0,
        right: 0,
    },
    categoryContent: {
        paddingHorizontal: 20,
        gap: 10,
    },
    categoryPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginRight: 10,
    },
    categoryPillActive: {
        backgroundColor: '#9900ff',
    },
    categoryIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    categoryText: {
        fontSize: 13,
        color: '#333',
        fontWeight: '500',
    },
    categoryTextActive: {
        color: '#fff',
    },
    recenterButton: {
        position: 'absolute',
        right: 20,
        bottom: 200,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 5,
    },
    recenterIcon: {
        fontSize: 22,
    },
    nearbyFab: {
        position: 'absolute',
        right: 20,
        bottom: 140,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
        zIndex: 20,
    },
    nearbyFabIcon: {
        fontSize: 22,
    },
    modalBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.25)',
    },
    modalSheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: Platform.OS === 'ios' ? 110 : 96,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        maxHeight: height * 0.7,
        paddingBottom: 20,
        overflow: 'hidden',
        marginHorizontal: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    bottomSheetTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    expandIcon: {
        fontSize: 16,
        color: '#9900ff',
    },
    placesContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 12,
    },
    placeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    placeIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f4f4f8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    placeIconText: {
        fontSize: 18,
    },
    placeInfo: {
        flex: 1,
    },
    placeName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
    },
    placeDetails: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 4,
    },
    placeRating: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
    },
    placeDistance: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
    },
    placeArrow: {
        fontSize: 18,
        color: '#999',
        marginLeft: 8,
    },
});
