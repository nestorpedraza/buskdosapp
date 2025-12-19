import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CategoriesCarousel from '../components/CategoriesCarousel';
import HomeHeader from '../components/HomeHeader';
import HomeTabBar from '../components/HomeTabBar';
import NearbyCard from '../components/NearbyCard';
import PopularCarousel from '../components/PopularCarousel';
import { getCategories, getNearbyItems, getPopularItems } from '../data/dataService';
import { Category, NEARBY_GRID_CONFIG, NearbyItem, PopularItem, SubCategory } from '../types/home.types';

export default function Home() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const nearbyColumns = Platform.OS === 'web' ? (width >= 1200 ? 4 : width >= 768 ? 3 : 2) : NEARBY_GRID_CONFIG.NUM_COLUMNS;

    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
    const [popularTab, setPopularTab] = useState<'new' | 'popular' | 'favorites'>('new');
    const categoryDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        if (categoryDebounceRef.current) clearTimeout(categoryDebounceRef.current);
        categoryDebounceRef.current = setTimeout(() => {
            setSelectedCategoryId(item.id);
            setSelectedSubcategoryId(null);
        }, 120);
    }, []);

    const handleSubcategoryPress = useCallback((category: Category, subcategory: SubCategory) => {
        if (categoryDebounceRef.current) clearTimeout(categoryDebounceRef.current);
        categoryDebounceRef.current = setTimeout(() => {
            setSelectedCategoryId(category.id);
            setSelectedSubcategoryId(subcategory.id);
        }, 120);
    }, []);

    const handlePopularPress = useCallback((item: PopularItem) => {
        router.push({ pathname: '/place/[id]', params: { id: item.id } });
    }, [router]);
    const handlePopularDetailPress = useCallback((item: PopularItem) => {
        router.push({ pathname: '/place/[id]', params: { id: item.id } });
    }, [router]);
    const handlePopularMapPress = useCallback((item: PopularItem) => {
        router.push({ pathname: '/map', params: { placeId: item.id } });
    }, [router]);

    const handleNearbyDetailPress = useCallback((item: NearbyItem) => {
        router.push({ pathname: '/place/[id]', params: { id: item.id } });
    }, [router]);
    const handleNearbyMapPress = useCallback((item: NearbyItem) => {
        router.push({ pathname: '/map', params: { placeId: item.id } });
    }, [router]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <HomeHeader />

                <FlatList
                    key={`nearby-${nearbyColumns}`}
                    data={filteredNearbyItems}
                    numColumns={nearbyColumns}
                    keyExtractor={(item) => item.id}
                    columnWrapperStyle={styles.nearbyColumnWrapper}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <NearbyCard
                            item={item}
                            onDetailPress={handleNearbyDetailPress}
                            onMapPress={handleNearbyMapPress}
                            columns={nearbyColumns}
                        />
                    )}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={8}
                    windowSize={10}
                    initialNumToRender={8}
                    getItemLayout={(_, index) => ({
                        length: NEARBY_GRID_CONFIG.CARD_HEIGHT + NEARBY_GRID_CONFIG.CARD_GAP,
                        offset: (NEARBY_GRID_CONFIG.CARD_HEIGHT + NEARBY_GRID_CONFIG.CARD_GAP) * index,
                        index,
                    })}
                    ListHeaderComponent={() => (
                        <View>
                            <CategoriesCarousel
                                categories={categories}
                                onCategoryPress={handleCategoryPress}
                                onSubcategoryPress={handleSubcategoryPress}
                            />
                            <View style={styles.tabsContainer}>
                                {[
                                    { key: 'new', label: 'Nuevos' },
                                    { key: 'popular', label: 'Populares' },
                                    { key: 'favorites', label: 'Favoritos' },
                                ].map(t => (
                                    <Pressable
                                        key={t.key}
                                        style={[
                                            styles.tabItem,
                                            popularTab === (t.key as any) && styles.tabItemActive,
                                        ]}
                                        onPress={() => setPopularTab(t.key as any)}
                                        accessibilityRole="button"
                                        accessibilityLabel={`Ver ${t.label}`}
                                    >
                                        <Text style={[
                                            styles.tabText,
                                            popularTab === (t.key as any) && styles.tabTextActive,
                                        ]}>{t.label}</Text>
                                    </Pressable>
                                ))}
                            </View>
                            <PopularCarousel
                                title={
                                    selectedCategoryId
                                        ? `${popularTab === 'new' ? 'Nuevos' : popularTab === 'popular' ? 'Más Populares' : 'Favoritos'} en ${categories.find(c => c.id === selectedCategoryId)?.name}`
                                        : popularTab === 'new' ? 'Nuevos' : popularTab === 'popular' ? 'Más Populares' : 'Favoritos'
                                }
                                items={filteredPopularItems}
                                onItemPress={handlePopularPress}
                                onDetailPress={handlePopularDetailPress}
                                onMapPress={handlePopularMapPress}
                            />
                            <View style={styles.sectionTitleWrapper}>
                                <Text style={styles.sectionTitle}>Sitios Cercanos</Text>
                            </View>
                        </View>
                    )}
                />

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
    listContent: {
        paddingBottom: 100,
        paddingHorizontal: 20,
    },
    tabsContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 24,
        padding: 4,
        marginTop: 16,
        marginHorizontal: 20,
    },
    tabItem: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    tabItemActive: {
        backgroundColor: '#ffffff',
        elevation: 1,
    },
    tabText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#333',
    },
    nearbyColumnWrapper: {
        justifyContent: 'space-between',
        marginTop: 12,
    },
    sectionTitleWrapper: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
});
