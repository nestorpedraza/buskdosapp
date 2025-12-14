import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CategoriesCarousel from '../components/CategoriesCarousel';
import HomeHeader from '../components/HomeHeader';
import HomeTabBar from '../components/HomeTabBar';
import NearbySection from '../components/NearbySection';
import PopularCarousel from '../components/PopularCarousel';
import { getCategories, getNearbyItems, getPopularItems } from '../data/dataService';
import { Category, NearbyItem, PopularItem, SubCategory } from '../types/home.types';

export default function Home() {
    const router = useRouter();

    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);

    const categories = useMemo<Category[]>(() => getCategories(), []);
    const popularItems = useMemo<PopularItem[]>(() => getPopularItems(), []);
    const nearbyItems = useMemo<NearbyItem[]>(() => getNearbyItems(), []);

    const filteredPopularItems = useMemo(() => {
        if (!selectedCategoryId) return popularItems;
        const selectedCategory = categories.find(c => c.id === selectedCategoryId);
        if (!selectedCategory) return [];
        if (selectedSubcategoryId) {
            const subcategoryName = selectedCategory.subcategories?.find(sc => sc.id === selectedSubcategoryId)?.name;
            return popularItems.filter(item => item.tag && item.tag.toLowerCase() === subcategoryName?.toLowerCase());
        }
        const subcategoryNames = selectedCategory.subcategories?.map(sc => sc.name.toLowerCase()) || [];
        return popularItems.filter(item => item.tag && subcategoryNames.includes(item.tag.toLowerCase()));
    }, [selectedCategoryId, selectedSubcategoryId, popularItems, categories]);

    const filteredNearbyItems = useMemo(() => {
        if (!selectedCategoryId) return nearbyItems;
        const selectedCategory = categories.find(c => c.id === selectedCategoryId);
        if (!selectedCategory) return [];
        if (selectedSubcategoryId) {
            const subcategoryName = selectedCategory.subcategories?.find(sc => sc.id === selectedSubcategoryId)?.name;
            return nearbyItems.filter(item => item.tag && item.tag.toLowerCase() === subcategoryName?.toLowerCase());
        }
        const subcategoryNames = selectedCategory.subcategories?.map(sc => sc.name.toLowerCase()) || [];
        return nearbyItems.filter(item => item.tag && subcategoryNames.includes(item.tag.toLowerCase()));
    }, [selectedCategoryId, selectedSubcategoryId, nearbyItems, categories]);

    const handleCategoryPress = useCallback((item: Category) => {
        setSelectedCategoryId(item.id);
        setSelectedSubcategoryId(null);
    }, []);

    const handleSubcategoryPress = useCallback((category: Category, subcategory: SubCategory) => {
        setSelectedCategoryId(category.id);
        setSelectedSubcategoryId(subcategory.id);
    }, []);

    const handlePopularPress = useCallback((item: PopularItem) => {
        router.push({ pathname: '/place/[id]', params: { id: item.id } });
    }, [router]);

    const handleNearbyPress = useCallback((item: NearbyItem) => {
        router.push({ pathname: '/place/[id]', params: { id: item.id } });
    }, [router]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <HomeHeader />

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <CategoriesCarousel
                        categories={categories}
                        onCategoryPress={handleCategoryPress}
                        onSubcategoryPress={handleSubcategoryPress}
                    />

                    <PopularCarousel
                        title={selectedCategoryId ? `Nuevos en ${categories.find(c => c.id === selectedCategoryId)?.name}` : "Nuevos"}
                        items={filteredPopularItems}
                        onItemPress={handlePopularPress}
                    />

                    <PopularCarousel
                        title={selectedCategoryId ? `Más Populares en ${categories.find(c => c.id === selectedCategoryId)?.name}` : "Más Populares"}
                        items={filteredPopularItems}
                        onItemPress={handlePopularPress}
                    />

                    <PopularCarousel
                        title={selectedCategoryId ? `Favoritos en ${categories.find(c => c.id === selectedCategoryId)?.name}` : "Favoritos"}
                        items={filteredPopularItems}
                        onItemPress={handlePopularPress}
                    />

                    <NearbySection
                        items={filteredNearbyItems}
                        onItemPress={handleNearbyPress}
                    />
                </ScrollView>

                <HomeTabBar activeRoute="/home" />
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
});
