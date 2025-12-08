import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import Svg, { Defs, Stop, LinearGradient as SvgLinearGradient, Text as SvgText } from 'react-native-svg';

import CategoryItem from '../components/CategoryItem';
import NearbyCard from '../components/NearbyCard';
import PopularCard from '../components/PopularCard';
import { CAROUSEL_CONFIG, Category, NEARBY_GRID_CONFIG, NearbyItem, POPULAR_CAROUSEL_CONFIG, PopularItem } from '../types/home.types';

// Animated FlatLists para usar con Reanimated
const AnimatedCategoryList = Animated.FlatList<Category>;
const AnimatedPopularList = Animated.FlatList<PopularItem>;
const NearbyGridList = Animated.FlatList<NearbyItem>;

/**
 * HomeScreen - Pantalla principal optimizada
 * 
 * Mejoras implementadas:
 * 1. ✅ Reanimated para scroll handler en UI Thread (60 FPS)
 * 2. ✅ Tipado estricto con TypeScript interfaces
 * 3. ✅ Constantes centralizadas para evitar desincronización
 * 4. ✅ Componentes memoizados extraídos del renderItem
 * 5. ✅ IDs como strings para evitar conversiones
 * 6. ✅ useMemo/useCallback para optimización
 */
export default function HomeScreen() {
    const router = useRouter();
    const categoryListRef = useRef<Animated.FlatList<Category>>(null);
    const popularListRef = useRef<Animated.FlatList<PopularItem>>(null);

    // Shared values para el scroll - viven en el UI Thread
    const categoryScrollX = useSharedValue(0);
    const popularScrollX = useSharedValue(0);

    // Datos con tipado estricto y IDs como strings
    const categories = useMemo<Category[]>(() => [
        { id: '1', name: 'Tiendas', image: require('../assets/images/city.png') },
        { id: '2', name: 'Restaurantes', image: require('../assets/images/city.png') },
        { id: '3', name: 'Cafeterías', image: require('../assets/images/city.png') },
        { id: '4', name: 'Salud', image: require('../assets/images/city.png') },
        { id: '5', name: 'Belleza', image: require('../assets/images/city.png') },
        { id: '6', name: 'Servicios', image: require('../assets/images/city.png') },
        { id: '7', name: 'Deportes', image: require('../assets/images/city.png') },
        { id: '8', name: 'Educación', image: require('../assets/images/city.png') },
        { id: '9', name: 'Tecnología', image: require('../assets/images/city.png') },
        { id: '10', name: 'Hogar', image: require('../assets/images/city.png') },
    ], []);

    const popularItems = useMemo<PopularItem[]>(() => [
        {
            id: '1',
            tag: 'Tienda Local',
            title: 'Boutique Fashion',
            subtitle: 'Ropa y accesorios',
            price: '$50 promedio',
            rating: 4.8,
            reviews: 984,
            image: require('../assets/images/city.png'),
        },
        {
            id: '2',
            tag: 'Restaurante',
            title: 'La Casa del Sabor',
            subtitle: 'Comida tradicional',
            price: '$25 por persona',
            rating: 4.9,
            reviews: 688,
            image: require('../assets/images/city.png'),
        },
        {
            id: '3',
            tag: 'Cafetería',
            title: 'Café Aroma',
            subtitle: 'Café especialidad',
            price: '$8 promedio',
            rating: 4.7,
            reviews: 452,
            image: require('../assets/images/city.png'),
        },
        {
            id: '4',
            tag: 'Gimnasio',
            title: 'Fitness Center',
            subtitle: 'Entrenamiento completo',
            price: '$30 mensual',
            rating: 4.6,
            reviews: 321,
            image: require('../assets/images/city.png'),
        },
        {
            id: '5',
            tag: 'Spa',
            title: 'Wellness Spa',
            subtitle: 'Tratamientos y masajes',
            price: '$60 por sesión',
            rating: 4.9,
            reviews: 567,
            image: require('../assets/images/city.png'),
        },
        {
            id: '6',
            tag: 'Librería',
            title: 'Mundo de Libros',
            subtitle: 'Literatura y más',
            price: '$15 promedio',
            rating: 4.5,
            reviews: 289,
            image: require('../assets/images/city.png'),
        },
        {
            id: '7',
            tag: 'Panadería',
            title: 'Pan del Día',
            subtitle: 'Productos frescos',
            price: '$5 promedio',
            rating: 4.8,
            reviews: 723,
            image: require('../assets/images/city.png'),
        },
        {
            id: '8',
            tag: 'Tecnología',
            title: 'Tech Store',
            subtitle: 'Gadgets y accesorios',
            price: '$100 promedio',
            rating: 4.7,
            reviews: 891,
            image: require('../assets/images/city.png'),
        },
        {
            id: '9',
            tag: 'Salón de Belleza',
            title: 'Beauty Studio',
            subtitle: 'Cortes y tratamientos',
            price: '$35 por servicio',
            rating: 4.9,
            reviews: 634,
            image: require('../assets/images/city.png'),
        },
        {
            id: '10',
            tag: 'Farmacia',
            title: 'Farmacia Salud',
            subtitle: 'Medicamentos y cuidado',
            price: '$20 promedio',
            rating: 4.6,
            reviews: 412,
            image: require('../assets/images/city.png'),
        },
        {
            id: '11',
            tag: 'Pizzería',
            title: 'Pizza Napolitana',
            subtitle: 'Pizza artesanal',
            price: '$18 por pizza',
            rating: 4.8,
            reviews: 876,
            image: require('../assets/images/city.png'),
        },
        {
            id: '12',
            tag: 'Lavandería',
            title: 'Express Clean',
            subtitle: 'Lavado y planchado',
            price: '$12 por kg',
            rating: 4.5,
            reviews: 198,
            image: require('../assets/images/city.png'),
        },
    ], []);

    const nearbyItems = useMemo<NearbyItem[]>(() => [
        { id: '1', image: require('../assets/images/city.png'), title: 'Cerca de ti' },
        { id: '2', image: require('../assets/images/city.png'), title: 'Populares' },
        { id: '3', image: require('../assets/images/city.png'), title: 'Restaurantes' },
        { id: '4', image: require('../assets/images/city.png'), title: 'Cafeterías' },
        { id: '5', image: require('../assets/images/city.png'), title: 'Tiendas' },
        { id: '6', image: require('../assets/images/city.png'), title: 'Salud' },
        { id: '7', image: require('../assets/images/city.png'), title: 'Belleza' },
        { id: '8', image: require('../assets/images/city.png'), title: 'Gimnasios' },
        { id: '9', image: require('../assets/images/city.png'), title: 'Spa' },
        { id: '10', image: require('../assets/images/city.png'), title: 'Tecnología' },
        { id: '11', image: require('../assets/images/city.png'), title: 'Librerías' },
        { id: '12', image: require('../assets/images/city.png'), title: 'Panaderías' },
        { id: '13', image: require('../assets/images/city.png'), title: 'Farmacias' },
        { id: '14', image: require('../assets/images/city.png'), title: 'Supermercados' },
        { id: '15', image: require('../assets/images/city.png'), title: 'Pizzerías' },
        { id: '16', image: require('../assets/images/city.png'), title: 'Lavanderías' },
        { id: '17', image: require('../assets/images/city.png'), title: 'Bancos' },
        { id: '18', image: require('../assets/images/city.png'), title: 'Hoteles' },
        { id: '19', image: require('../assets/images/city.png'), title: 'Cines' },
        { id: '20', image: require('../assets/images/city.png'), title: 'Parques' },
    ], []);

    // Número de dots de paginación (máximo 10)
    const categoryPaginationCount = useMemo(() =>
        Math.min(categories.length, 10),
        [categories.length]
    );

    const popularPaginationCount = useMemo(() =>
        Math.min(popularItems.length, 10),
        [popularItems.length]
    );

    // Scroll handlers optimizados - se ejecutan en el UI Thread
    const categoryScrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            categoryScrollX.value = event.contentOffset.x;
        },
    });

    const popularScrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            popularScrollX.value = event.contentOffset.x;
        },
    });

    // Callbacks memoizados
    const handleCategoryPress = useCallback((item: Category) => {
        console.log('Category pressed:', item.name);
        // Aquí podrías navegar a una pantalla de categoría
        // router.push(`/category/${item.id}`);
    }, []);

    const handlePopularPress = useCallback((item: PopularItem) => {
        console.log('Popular item pressed:', item.title);
        // router.push(`/business/${item.id}`);
    }, []);

    const handleNearbyPress = useCallback((item: NearbyItem) => {
        console.log('Nearby item pressed:', item.id);
    }, []);

    // RenderItems memoizados - solo retornan el componente
    const renderCategoryItem = useCallback(({ item }: { item: Category }) => (
        <CategoryItem item={item} onPress={handleCategoryPress} />
    ), [handleCategoryPress]);

    const renderPopularItem = useCallback(({ item }: { item: PopularItem }) => (
        <PopularCard item={item} onPress={handlePopularPress} />
    ), [handlePopularPress]);

    const renderNearbyItem = useCallback(({ item }: { item: NearbyItem }) => (
        <NearbyCard item={item} onPress={handleNearbyPress} />
    ), [handleNearbyPress]);

    // KeyExtractors - ya no necesitan conversión porque id es string
    const categoryKeyExtractor = useCallback((item: Category) => item.id, []);
    const popularKeyExtractor = useCallback((item: PopularItem) => item.id, []);
    const nearbyKeyExtractor = useCallback((item: NearbyItem) => item.id, []);

    // Componente de punto de paginación animado para categorías
    const CategoryPaginationDot = useCallback(({ index }: { index: number }) => {
        const animatedStyle = useAnimatedStyle(() => {
            const inputRange = [
                (index - 1) * CAROUSEL_CONFIG.SNAP_INTERVAL,
                index * CAROUSEL_CONFIG.SNAP_INTERVAL,
                (index + 1) * CAROUSEL_CONFIG.SNAP_INTERVAL,
            ];

            const width = interpolate(
                categoryScrollX.value,
                inputRange,
                [8, 20, 8],
                Extrapolation.CLAMP
            );

            const opacity = interpolate(
                categoryScrollX.value,
                inputRange,
                [0.3, 1, 0.3],
                Extrapolation.CLAMP
            );

            return {
                width,
                opacity,
            };
        });

        return (
            <Animated.View
                style={[styles.paginationDot, animatedStyle]}
            />
        );
    }, [categoryScrollX]);

    // Componente de punto de paginación animado para populares
    const PopularPaginationDot = useCallback(({ index }: { index: number }) => {
        const animatedStyle = useAnimatedStyle(() => {
            const inputRange = [
                (index - 1) * POPULAR_CAROUSEL_CONFIG.SNAP_INTERVAL,
                index * POPULAR_CAROUSEL_CONFIG.SNAP_INTERVAL,
                (index + 1) * POPULAR_CAROUSEL_CONFIG.SNAP_INTERVAL,
            ];

            const width = interpolate(
                popularScrollX.value,
                inputRange,
                [8, 20, 8],
                Extrapolation.CLAMP
            );

            const opacity = interpolate(
                popularScrollX.value,
                inputRange,
                [0.3, 1, 0.3],
                Extrapolation.CLAMP
            );

            return {
                width,
                opacity,
            };
        });

        return (
            <Animated.View
                style={[styles.paginationDot, animatedStyle]}
            />
        );
    }, [popularScrollX]);

    return (
        <View style={styles.container}>
            {/* Header con gradiente */}
            <LinearGradient
                colors={['#9900ff', '#ff00f7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <Pressable onPress={() => router.push('/')}>
                    <Svg height="35" width="150">
                        <Defs>
                            <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                                <Stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
                            </SvgLinearGradient>
                        </Defs>
                        <SvgText
                            fill="#fff"
                            fontSize="26"
                            fontWeight="bold"
                            x="0"
                            y="26"
                        >
                            Buskdos
                        </SvgText>
                    </Svg>
                </Pressable>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar negocios, servicios..."
                        placeholderTextColor="rgba(105, 105, 105, 0.7)"
                    />
                    <Text style={styles.searchIcon}>🔍</Text>
                </View>
            </LinearGradient>

            {/* Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Categories Carousel */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Categorías</Text>
                    <AnimatedCategoryList
                        ref={categoryListRef}
                        data={categories}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={CAROUSEL_CONFIG.SNAP_INTERVAL}
                        decelerationRate="fast"
                        contentContainerStyle={styles.carouselContainer}
                        onScroll={categoryScrollHandler}
                        scrollEventThrottle={16}
                        renderItem={renderCategoryItem}
                        keyExtractor={categoryKeyExtractor}
                        // Optimizaciones de rendimiento
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={5}
                        windowSize={5}
                        initialNumToRender={4}
                        getItemLayout={(_, index) => ({
                            length: CAROUSEL_CONFIG.SNAP_INTERVAL,
                            offset: CAROUSEL_CONFIG.SNAP_INTERVAL * index,
                            index,
                        })}
                    />

                    {/* Pagination Dots Animados */}
                    <View style={styles.paginationContainer}>
                        {Array.from({ length: categoryPaginationCount }).map((_, index) => (
                            <CategoryPaginationDot key={index} index={index} />
                        ))}
                    </View>
                </View>

                {/* Mas Populares Carousel */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Más Populares</Text>
                    <AnimatedPopularList
                        ref={popularListRef}
                        data={popularItems}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={POPULAR_CAROUSEL_CONFIG.SNAP_INTERVAL}
                        decelerationRate="fast"
                        contentContainerStyle={styles.carouselContainer}
                        onScroll={popularScrollHandler}
                        scrollEventThrottle={16}
                        renderItem={renderPopularItem}
                        keyExtractor={popularKeyExtractor}
                        // Optimizaciones de rendimiento
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={5}
                        windowSize={5}
                        initialNumToRender={3}
                        getItemLayout={(_, index) => ({
                            length: POPULAR_CAROUSEL_CONFIG.SNAP_INTERVAL,
                            offset: POPULAR_CAROUSEL_CONFIG.SNAP_INTERVAL * index,
                            index,
                        })}
                    />



                    {/* Pagination Dots Animados para Populares */}
                    <View style={styles.paginationContainer}>
                        {Array.from({ length: popularPaginationCount }).map((_, index) => (
                            <PopularPaginationDot key={index} index={index} />
                        ))}
                    </View>
                </View>

                {/* Favoritos Carousel */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Favoritos</Text>
                    <AnimatedPopularList
                        ref={popularListRef}
                        data={popularItems}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={POPULAR_CAROUSEL_CONFIG.SNAP_INTERVAL}
                        decelerationRate="fast"
                        contentContainerStyle={styles.carouselContainer}
                        onScroll={popularScrollHandler}
                        scrollEventThrottle={16}
                        renderItem={renderPopularItem}
                        keyExtractor={popularKeyExtractor}
                        // Optimizaciones de rendimiento
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={5}
                        windowSize={5}
                        initialNumToRender={3}
                        getItemLayout={(_, index) => ({
                            length: POPULAR_CAROUSEL_CONFIG.SNAP_INTERVAL,
                            offset: POPULAR_CAROUSEL_CONFIG.SNAP_INTERVAL * index,
                            index,
                        })}
                    />



                    {/* Pagination Dots Animados para Populares */}
                    <View style={styles.paginationContainer}>
                        {Array.from({ length: popularPaginationCount }).map((_, index) => (
                            <PopularPaginationDot key={index} index={index} />
                        ))}
                    </View>
                </View>

                {/* Cerca - Grid de 2 columnas */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cerca</Text>
                    <NearbyGridList
                        data={nearbyItems}
                        numColumns={NEARBY_GRID_CONFIG.NUM_COLUMNS}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.nearbyGridContainer}
                        columnWrapperStyle={styles.nearbyColumnWrapper}
                        renderItem={renderNearbyItem}
                        keyExtractor={nearbyKeyExtractor}
                        // Optimizaciones
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={6}
                        initialNumToRender={6}
                    />
                </View>
            </ScrollView>

            {/* Bottom Tab Bar */}
            <View style={styles.tabBar}>
                <Pressable style={styles.tabItem}>
                    <Text style={[styles.tabIcon, styles.tabIconActive]}>🏠</Text>
                    <Text style={[styles.tabText, styles.tabTextActive]}>Home</Text>
                </Pressable>
                <Pressable style={styles.tabItem}>
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
                <Pressable style={styles.tabItem}>
                    <Text style={styles.tabIcon}>🧭</Text>
                    <Text style={styles.tabText}>Nav</Text>
                </Pressable>
                <Pressable style={styles.tabItem} onPress={() => router.push('/login')}>
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
    headerGradient: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 25,
        marginTop: 20,
        paddingHorizontal: 20,
    },
    searchInput: {
        flex: 1,
        height: 45,
        color: '#fff',
        fontSize: 16,
    },
    searchIcon: {
        fontSize: 20,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    section: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    carouselContainer: {
        paddingRight: 20,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12,
    },
    paginationDot: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#9900ff',
        marginHorizontal: 4,
    },
    popularGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    nearbyGridContainer: {
        paddingBottom: 8,
    },
    nearbyColumnWrapper: {
        justifyContent: 'space-between',
    },
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingBottom: 25,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    tabItem: {
        alignItems: 'center',
        flex: 1,
    },
    tabItemCenter: {
        alignItems: 'center',
        marginTop: -30,
    },
    tabCenterButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#9900ff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    tabCenterIcon: {
        fontSize: 24,
    },
    tabIcon: {
        fontSize: 22,
        marginBottom: 4,
        opacity: 0.5,
    },
    tabIconActive: {
        opacity: 1,
    },
    tabText: {
        fontSize: 11,
        color: '#999',
    },
    tabTextActive: {
        color: '#9900ff',
        fontWeight: '600',
    },
});
