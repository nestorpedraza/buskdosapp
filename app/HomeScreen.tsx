import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import CategoriesCarousel from '../components/CategoriesCarousel';
import HomeHeader from '../components/HomeHeader';
import HomeTabBar from '../components/HomeTabBar';
import NearbySection from '../components/NearbySection';
import PopularCarousel from '../components/PopularCarousel';
import { Category, NearbyItem, PopularItem, SubCategory } from '../types/home.types';


/**
 * HomeScreen - Pantalla principal optimizada
 * 
 * Componentes utilizados:
 * - HomeHeader: Header con búsqueda
 * - CategoriesCarousel: Carousel de categorías
 * - PopularCarousel: Carousel genérico para Nuevos, Más Populares, Favoritos
 * - NearbySection: Grid de sitios cercanos
 * - HomeTabBar: Barra de navegación inferior
 */
export default function HomeScreen() {
    // Datos con tipado estricto
    const categories = useMemo<Category[]>(() => [
        {
            id: '1',
            name: 'Tiendas',
            image: require('../assets/images/city.png'),
            subcategories: [
                { id: '1-1', name: 'Ropa', icon: '👕' },
                { id: '1-2', name: 'Zapatos', icon: '👟' },
                { id: '1-3', name: 'Electrónica', icon: '📱' },
                { id: '1-4', name: 'Joyería', icon: '💎' },
                { id: '1-5', name: 'Libros', icon: '📚' },
            ]
        },
        {
            id: '2',
            name: 'Restaurantes',
            image: require('../assets/images/city.png'),
            subcategories: [
                { id: '2-1', name: 'Italiana', icon: '🍝' },
                { id: '2-2', name: 'Mexicana', icon: '🌮' },
                { id: '2-3', name: 'China', icon: '🥡' },
                { id: '2-4', name: 'Sushi', icon: '🍣' },
                { id: '2-5', name: 'Hamburguesas', icon: '🍔' },
                { id: '2-6', name: 'Pizza', icon: '🍕' },
            ]
        },
        {
            id: '3',
            name: 'Cafeterías',
            image: require('../assets/images/city.png'),
            subcategories: [
                { id: '3-1', name: 'Café Espresso', icon: '☕' },
                { id: '3-2', name: 'Café con Leche', icon: '🥛' },
                { id: '3-3', name: 'Postres', icon: '🍰' },
                { id: '3-4', name: 'Desayunos', icon: '🥐' },
            ]
        },
        {
            id: '4',
            name: 'Salud',
            image: require('../assets/images/city.png'),
            subcategories: [
                { id: '4-1', name: 'Farmacias', icon: '💊' },
                { id: '4-2', name: 'Clínicas', icon: '🏥' },
                { id: '4-3', name: 'Dentistas', icon: '🦷' },
                { id: '4-4', name: 'Oftalmología', icon: '👓' },
                { id: '4-5', name: 'Laboratorios', icon: '🔬' },
            ]
        },
        {
            id: '5',
            name: 'Belleza',
            image: require('../assets/images/city.png'),
            subcategories: [
                { id: '5-1', name: 'Peluquería', icon: '💇' },
                { id: '5-2', name: 'Spa', icon: '🧖' },
                { id: '5-3', name: 'Uñas', icon: '💅' },
                { id: '5-4', name: 'Maquillaje', icon: '💄' },
            ]
        },
        {
            id: '6',
            name: 'Servicios',
            image: require('../assets/images/city.png'),
            subcategories: [
                { id: '6-1', name: 'Lavanderías', icon: '👔' },
                { id: '6-2', name: 'Cerrajería', icon: '🔑' },
                { id: '6-3', name: 'Plomería', icon: '🔧' },
                { id: '6-4', name: 'Electricidad', icon: '💡' },
            ]
        },
        {
            id: '7',
            name: 'Deportes',
            image: require('../assets/images/city.png'),
            subcategories: [
                { id: '7-1', name: 'Gimnasios', icon: '💪' },
                { id: '7-2', name: 'Yoga', icon: '🧘' },
                { id: '7-3', name: 'Natación', icon: '🏊' },
                { id: '7-4', name: 'Artes Marciales', icon: '🥋' },
            ]
        },
        {
            id: '8',
            name: 'Educación',
            image: require('../assets/images/city.png'),
            subcategories: [
                { id: '8-1', name: 'Colegios', icon: '🏫' },
                { id: '8-2', name: 'Universidades', icon: '🎓' },
                { id: '8-3', name: 'Cursos', icon: '📖' },
                { id: '8-4', name: 'Idiomas', icon: '🗣️' },
            ]
        },
        {
            id: '9',
            name: 'Tecnología',
            image: require('../assets/images/city.png'),
            subcategories: [
                { id: '9-1', name: 'Computadoras', icon: '💻' },
                { id: '9-2', name: 'Celulares', icon: '📱' },
                { id: '9-3', name: 'Accesorios', icon: '🎧' },
                { id: '9-4', name: 'Reparación', icon: '🔧' },
            ]
        },
        {
            id: '10',
            name: 'Hogar',
            image: require('../assets/images/city.png'),
            subcategories: [
                { id: '10-1', name: 'Muebles', icon: '🛋️' },
                { id: '10-2', name: 'Decoración', icon: '🖼️' },
                { id: '10-3', name: 'Jardín', icon: '🌱' },
                { id: '10-4', name: 'Cocina', icon: '🍳' },
            ]
        },
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
        {
            id: '1',
            tag: 'Tienda Local',
            title: 'Boutique Fashion',
            subtitle: 'Ropa y accesorios',
            price: '$50 promedio',
            rating: 4.8,
            reviews: 984,
            distance: '0.3 km',
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
            distance: '0.5 km',
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
            distance: '0.7 km',
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
            distance: '0.8 km',
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
            distance: '1.0 km',
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
            distance: '1.2 km',
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
            distance: '1.3 km',
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
            distance: '1.5 km',
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
            distance: '1.8 km',
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
            distance: '2.0 km',
            image: require('../assets/images/city.png'),
        },
    ], []);

    // Callbacks memoizados
    const handleCategoryPress = useCallback((item: Category) => {
        console.log('Category pressed:', item.name);
    }, []);

    const handleSubcategoryPress = useCallback((category: Category, subcategory: SubCategory) => {
        console.log('Subcategory pressed:', category.name, '->', subcategory.name);
        // Aquí puedes navegar o filtrar contenido por subcategoría
    }, []);

    const handlePopularPress = useCallback((item: PopularItem) => {
        console.log('Popular item pressed:', item.title);
    }, []);

    const handleNearbyPress = useCallback((item: NearbyItem) => {
        console.log('Nearby item pressed:', item.title);
    }, []);

    return (
        <View style={styles.container}>
            {/* Header con búsqueda */}
            <HomeHeader />

            {/* Content con todas las secciones */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Carousel de Categorías */}
                <CategoriesCarousel
                    categories={categories}
                    onCategoryPress={handleCategoryPress}
                    onSubcategoryPress={handleSubcategoryPress}
                />

                {/* Carousel Nuevos */}
                <PopularCarousel
                    title="Nuevos"
                    items={popularItems}
                    onItemPress={handlePopularPress}
                />

                {/* Carousel Más Populares */}
                <PopularCarousel
                    title="Más Populares"
                    items={popularItems}
                    onItemPress={handlePopularPress}
                />

                {/* Carousel Favoritos */}
                <PopularCarousel
                    title="Favoritos"
                    items={popularItems}
                    onItemPress={handlePopularPress}
                />

                {/* Grid Sitios Cercanos */}
                <NearbySection
                    items={nearbyItems}
                    onItemPress={handleNearbyPress}
                />
            </ScrollView>

            {/* Bottom Tab Bar */}
            <HomeTabBar activeRoute="/homescreen" />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
});
