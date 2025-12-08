import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface MapMarker {
    id: string;
    name: string;
    category: string;
    rating: number;
    distance: string;
    lat: number;
    lng: number;
}

export default function MapScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = useMemo(() => [
        { id: 'all', name: 'Todos', icon: '🌐' },
        { id: 'restaurant', name: 'Restaurantes', icon: '🍽️' },
        { id: 'cafe', name: 'Cafeterías', icon: '☕' },
        { id: 'shop', name: 'Tiendas', icon: '🛍️' },
        { id: 'gym', name: 'Gimnasios', icon: '💪' },
        { id: 'health', name: 'Salud', icon: '🏥' },
    ], []);

    const nearbyPlaces = useMemo<MapMarker[]>(() => [
        { id: '1', name: 'Boutique Fashion', category: 'shop', rating: 4.8, distance: '0.3 km', lat: 0, lng: 0 },
        { id: '2', name: 'La Casa del Sabor', category: 'restaurant', rating: 4.9, distance: '0.5 km', lat: 0, lng: 0 },
        { id: '3', name: 'Café Aroma', category: 'cafe', rating: 4.7, distance: '0.8 km', lat: 0, lng: 0 },
        { id: '4', name: 'FitLife Center', category: 'gym', rating: 4.6, distance: '1.2 km', lat: 0, lng: 0 },
        { id: '5', name: 'Farmacia Salud', category: 'health', rating: 4.5, distance: '1.5 km', lat: 0, lng: 0 },
    ], []);

    const filteredPlaces = selectedCategory && selectedCategory !== 'all'
        ? nearbyPlaces.filter(place => place.category === selectedCategory)
        : nearbyPlaces;

    return (
        <View style={styles.container}>
            {/* Map Placeholder */}
            <View style={styles.mapContainer}>
                <LinearGradient
                    colors={['#e8e8e8', '#d0d0d0']}
                    style={styles.mapPlaceholder}
                >
                    <Text style={styles.mapPlaceholderText}>🗺️</Text>
                    <Text style={styles.mapPlaceholderSubtext}>Mapa interactivo</Text>
                    <Text style={styles.mapPlaceholderHint}>
                        Integra react-native-maps o mapbox
                    </Text>
                </LinearGradient>

                {/* Floating Search Bar */}
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

                {/* Category Pills */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoryScrollView}
                    contentContainerStyle={styles.categoryContent}
                >
                    {categories.map((cat) => (
                        <Pressable
                            key={cat.id}
                            style={[
                                styles.categoryPill,
                                selectedCategory === cat.id && styles.categoryPillActive
                            ]}
                            onPress={() => setSelectedCategory(cat.id)}
                        >
                            <Text style={styles.categoryIcon}>{cat.icon}</Text>
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === cat.id && styles.categoryTextActive
                            ]}>
                                {cat.name}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Recenter Button */}
                <Pressable style={styles.recenterButton}>
                    <Text style={styles.recenterIcon}>📍</Text>
                </Pressable>
            </View>

            {/* Bottom Sheet with nearby places */}
            <View style={styles.bottomSheet}>
                <View style={styles.bottomSheetHandle} />
                <Text style={styles.bottomSheetTitle}>Lugares cercanos</Text>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.placesContent}
                >
                    {filteredPlaces.map((place) => (
                        <Pressable key={place.id} style={styles.placeCard}>
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

            {/* Bottom Tab Bar */}
            <View style={styles.tabBar}>
                <Pressable style={styles.tabItem} onPress={() => router.push('/HomeScreen')}>
                    <Text style={styles.tabIcon}>🏠</Text>
                    <Text style={styles.tabText}>Home</Text>
                </Pressable>
                <Pressable style={styles.tabItem} onPress={() => router.push('/likes')}>
                    <Text style={styles.tabIcon}>❤️</Text>
                    <Text style={styles.tabText}>Likes</Text>
                </Pressable>
                <Pressable style={styles.tabItemCenter}>
                    <LinearGradient
                        colors={['#9900ff', '#ff00f7']}
                        style={styles.tabCenterButton}
                    >
                        <Text style={styles.tabCenterIcon}>📍</Text>
                    </LinearGradient>
                </Pressable>
                <Pressable style={styles.tabItem} onPress={() => router.push('/nav')}>
                    <Text style={styles.tabIcon}>🧭</Text>
                    <Text style={styles.tabText}>Nav</Text>
                </Pressable>
                <Pressable style={styles.tabItem} onPress={() => router.push('/profile')}>
                    <Text style={styles.tabIcon}>👤</Text>
                    <Text style={styles.tabText}>Profile</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    mapPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapPlaceholderText: {
        fontSize: 60,
        marginBottom: 10,
    },
    mapPlaceholderSubtext: {
        fontSize: 18,
        color: '#666',
        fontWeight: '600',
    },
    mapPlaceholderHint: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
    floatingSearchContainer: {
        position: 'absolute',
        top: 60,
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
        top: 130,
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
        fontSize: 24,
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingTop: 10,
        paddingHorizontal: 20,
        maxHeight: 250,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    bottomSheetHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#ddd',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 15,
    },
    bottomSheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    placesContent: {
        paddingBottom: 20,
    },
    placeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    placeIcon: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: '#f5f0ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeIconText: {
        fontSize: 20,
    },
    placeInfo: {
        flex: 1,
        marginLeft: 12,
    },
    placeName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    placeDetails: {
        flexDirection: 'row',
        marginTop: 4,
    },
    placeRating: {
        fontSize: 12,
        color: '#666',
        marginRight: 12,
    },
    placeDistance: {
        fontSize: 12,
        color: '#999',
    },
    placeArrow: {
        fontSize: 24,
        color: '#ccc',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingBottom: 25,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabItemCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -30,
    },
    tabCenterButton: {
        width: 55,
        height: 55,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#9900ff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    tabIcon: {
        fontSize: 22,
        marginBottom: 3,
    },
    tabIconActive: {
        transform: [{ scale: 1.1 }],
    },
    tabCenterIcon: {
        fontSize: 24,
    },
    tabText: {
        fontSize: 11,
        color: '#888',
    },
    tabTextActive: {
        color: '#9900ff',
        fontWeight: '600',
    },
});
