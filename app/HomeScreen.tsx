import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import CategoriesCarousel from '../components/CategoriesCarousel';
import HomeHeader from '../components/HomeHeader';
import HomeTabBar from '../components/HomeTabBar';
import NearbySection from '../components/NearbySection';
import PopularCarousel from '../components/PopularCarousel';
import { getCategories, getNearbyItems, getPopularItems } from '../data/dataService';
import { Category, NearbyItem, PopularItem, SubCategory } from '../types/home.types';


/**
 * HomeScreen - Pantalla pr                                                                                                                                                                                                                                                                                                                                                                                                                             incipal optimizada
 * 
 * Componentes utilizados:
 * - HomeHeader: Header con búsqueda
 * - CategoriesCarousel: Carousel de categorías
 * - PopularCarousel: Carousel genérico para Nuevos, Más Populares, Favoritos
 * - NearbySection: Grid de sitios cercanos
 * - HomeTabBar: Barra de navegación inferior
 */
export default function HomeScreen() {
    const router = useRouter();

    // State para filtros
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);

    // Datos con tipado estricto
    const categories = useMemo<Category[]>(() => getCategories(), []);

    const popularItems = useMemo<PopularItem[]>(() => getPopularItems(), []);


    const nearbyItems = useMemo<NearbyItem[]>(() => getNearbyItems(), []);

    const filteredPopularItems = useMemo(() => {
        if (!selectedCategoryId) return popularItems;

        const selectedCategory = categories.find(c => c.id === selectedCategoryId);
        if (!selectedCategory) return [];

        // Si hay subcategoría seleccionada, filtrar por ella
        if (selectedSubcategoryId) {
            const subcategoryName = selectedCategory.subcategories?.find(
                sc => sc.id === selectedSubcategoryId
            )?.name;

            return popularItems.filter(item =>
                item.tag && item.tag.toLowerCase() === subcategoryName?.toLowerCase()
            );
        }

        // Si solo hay categoría, filtrar por TODAS las subcategorías de esa categoría
        const subcategoryNames = selectedCategory.subcategories?.map(sc => sc.name.toLowerCase()) || [];
        return popularItems.filter(item =>
            item.tag && subcategoryNames.includes(item.tag.toLowerCase())
        );
    }, [selectedCategoryId, selectedSubcategoryId, popularItems, categories]);

    // Filtrar items cercanos según categoría
    const filteredNearbyItems = useMemo(() => {
        if (!selectedCategoryId) return nearbyItems;

        const selectedCategory = categories.find(c => c.id === selectedCategoryId);
        if (!selectedCategory) return [];

        if (selectedSubcategoryId) {
            const subcategoryName = selectedCategory.subcategories?.find(
                sc => sc.id === selectedSubcategoryId
            )?.name;

            return nearbyItems.filter(item =>
                item.tag && item.tag.toLowerCase() === subcategoryName?.toLowerCase()
            );
        }

        // Si solo hay categoría, filtrar por TODAS las subcategorías de esa categoría
        const subcategoryNames = selectedCategory.subcategories?.map(sc => sc.name.toLowerCase()) || [];
        return nearbyItems.filter(item =>
            item.tag && subcategoryNames.includes(item.tag.toLowerCase())
        );
    }, [selectedCategoryId, selectedSubcategoryId, nearbyItems, categories]);

    // Callbacks memoizados
    const handleCategoryPress = useCallback((item: Category) => {
        console.log('Category pressed:', item.name);
        setSelectedCategoryId(item.id);
        setSelectedSubcategoryId(null);
    }, []);

    const handleSubcategoryPress = useCallback((category: Category, subcategory: SubCategory) => {
        console.log('Subcategory pressed:', category.name, '->', subcategory.name);
        setSelectedCategoryId(category.id);
        setSelectedSubcategoryId(subcategory.id);
    }, []);

    const handlePopularPress = useCallback((item: PopularItem) => {
        console.log('Popular item pressed:', item.title);
        router.push({ pathname: '/place/[id]', params: { id: item.id } });
    }, [router]);

    const handleNearbyPress = useCallback((item: NearbyItem) => {
        console.log('Nearby item pressed:', item.title);
        router.push({ pathname: '/place/[id]', params: { id: item.id } });
    }, [router]);

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
                    title={selectedCategoryId ? `Nuevos en ${categories.find(c => c.id === selectedCategoryId)?.name}` : "Nuevos"}
                    items={filteredPopularItems}
                    onItemPress={handlePopularPress}
                />

                {/* Carousel Más Populares */}
                <PopularCarousel
                    title={selectedCategoryId ? `Más Populares en ${categories.find(c => c.id === selectedCategoryId)?.name}` : "Más Populares"}
                    items={filteredPopularItems}
                    onItemPress={handlePopularPress}
                />

                {/* Carousel Favoritos */}
                <PopularCarousel
                    title={selectedCategoryId ? `Favoritos en ${categories.find(c => c.id === selectedCategoryId)?.name}` : "Favoritos"}
                    items={filteredPopularItems}
                    onItemPress={handlePopularPress}
                />

                {/* Grid Sitios Cercanos */}
                <NearbySection
                    items={filteredNearbyItems}
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
