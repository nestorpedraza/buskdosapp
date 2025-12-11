import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import HomeHeader from '../components/HomeHeader';
import HomeTabBar from '../components/HomeTabBar';
import TitlesHeader from '../components/TitlesHeader';

const { width } = Dimensions.get('window');

interface NavCategory {
    id: string;
    name: string;
    icon: string;
    count: number;
    color: string;
}

interface RecentSearch {
    id: string;
    query: string;
    timestamp: string;
}

export default function NavScreen() {
    const router = useRouter();

    const navCategories = useMemo<NavCategory[]>(() => [
        { id: '1', name: 'Restaurantes', icon: '🍽️', count: 245, color: '#FF6B6B' },
        { id: '2', name: 'Cafeterías', icon: '☕', count: 128, color: '#4ECDC4' },
        { id: '3', name: 'Tiendas', icon: '🛍️', count: 312, color: '#9B59B6' },
        { id: '4', name: 'Gimnasios', icon: '💪', count: 56, color: '#3498DB' },
        { id: '5', name: 'Salud', icon: '🏥', count: 89, color: '#2ECC71' },
        { id: '6', name: 'Belleza', icon: '💅', count: 167, color: '#E91E63' },
        { id: '7', name: 'Educación', icon: '📚', count: 73, color: '#FF9800' },
        { id: '8', name: 'Servicios', icon: '🔧', count: 198, color: '#607D8B' },
    ], []);

    const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([
        { id: '1', query: 'Cafeterías cerca de mí', timestamp: 'Hace 2 horas' },
        { id: '2', query: 'Restaurante italiano', timestamp: 'Ayer' },
        { id: '3', query: 'Gimnasios 24 horas', timestamp: 'Hace 3 días' },
    ]);

    const quickLinks = useMemo(() => [
        { id: '1', name: 'Abierto ahora', icon: '🕐' },
        { id: '2', name: 'Mejor valorados', icon: '⭐' },
        { id: '3', name: 'Ofertas', icon: '🏷️' },
        { id: '4', name: 'Nuevos', icon: '✨' },
    ], []);

    const handleClearHistory = () => {
        setRecentSearches([]);
    };

    const handleRemoveSearch = (id: string) => {
        setRecentSearches(prev => prev.filter(s => s.id !== id));
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <HomeHeader />

            {/* Section Title */}
            <TitlesHeader title="Explorar" subtitle="Descubre lugares increíbles" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Quick Links */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Accesos rápidos</Text>
                    <View style={styles.quickLinksContainer}>
                        {quickLinks.map((link) => (
                            <Pressable key={link.id} style={styles.quickLink}>
                                <View style={styles.quickLinkIcon}>
                                    <Text style={styles.quickLinkIconText}>{link.icon}</Text>
                                </View>
                                <Text style={styles.quickLinkText}>{link.name}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Categories Grid */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Categorías</Text>
                    <View style={styles.categoriesGrid}>
                        {navCategories.map((cat) => (
                            <Pressable
                                key={cat.id}
                                style={[styles.categoryCard, { backgroundColor: cat.color + '15' }]}
                            >
                                <View style={[styles.categoryIconContainer, { backgroundColor: cat.color + '30' }]}>
                                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                                </View>
                                <Text style={styles.categoryName}>{cat.name}</Text>
                                <Text style={[styles.categoryCount, { color: cat.color }]}>
                                    {cat.count} lugares
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Recent Searches */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Búsquedas recientes</Text>
                        {recentSearches.length > 0 && (
                            <Pressable onPress={handleClearHistory}>
                                <Text style={styles.clearButton}>Borrar todo</Text>
                            </Pressable>
                        )}
                    </View>
                    {recentSearches.length > 0 ? (
                        recentSearches.map((search) => (
                            <View key={search.id} style={styles.recentSearchItem}>
                                <Text style={styles.recentSearchIcon}>🕒</Text>
                                <View style={styles.recentSearchContent}>
                                    <Text style={styles.recentSearchQuery}>{search.query}</Text>
                                    <Text style={styles.recentSearchTime}>{search.timestamp}</Text>
                                </View>
                                <Pressable onPress={() => handleRemoveSearch(search.id)}>
                                    <Text style={styles.removeSearchButton}>✕</Text>
                                </Pressable>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptySearches}>
                            <Text style={styles.emptySearchesText}>
                                No tienes búsquedas recientes
                            </Text>
                        </View>
                    )}
                </View>

                {/* Suggestions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sugerencias para ti</Text>
                    <View style={styles.suggestionsContainer}>
                        <Pressable style={styles.suggestionCard}>
                            <LinearGradient
                                colors={['#667eea', '#764ba2']}
                                style={styles.suggestionGradient}
                            >
                                <Text style={styles.suggestionIcon}>🌟</Text>
                                <Text style={styles.suggestionTitle}>Top 10 de la semana</Text>
                                <Text style={styles.suggestionSubtitle}>
                                    Los lugares más visitados
                                </Text>
                            </LinearGradient>
                        </Pressable>
                        <Pressable style={styles.suggestionCard}>
                            <LinearGradient
                                colors={['#f093fb', '#f5576c']}
                                style={styles.suggestionGradient}
                            >
                                <Text style={styles.suggestionIcon}>🆕</Text>
                                <Text style={styles.suggestionTitle}>Recién abiertos</Text>
                                <Text style={styles.suggestionSubtitle}>
                                    Descubre nuevos lugares
                                </Text>
                            </LinearGradient>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>

            <HomeTabBar activeRoute="/nav" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerGradient: {
        paddingTop: 60,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    section: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    clearButton: {
        fontSize: 13,
        color: '#9900ff',
        fontWeight: '600',
        marginBottom: 15,
    },
    quickLinksContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    quickLink: {
        alignItems: 'center',
        width: (width - 60) / 4,
    },
    quickLinkIcon: {
        width: 55,
        height: 55,
        borderRadius: 18,
        backgroundColor: '#f5f0ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickLinkIconText: {
        fontSize: 24,
    },
    quickLinkText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categoryCard: {
        width: (width - 50) / 2,
        padding: 15,
        borderRadius: 16,
        marginBottom: 10,
    },
    categoryIconContainer: {
        width: 45,
        height: 45,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    categoryIcon: {
        fontSize: 22,
    },
    categoryName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    categoryCount: {
        fontSize: 12,
        marginTop: 3,
    },
    recentSearchItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    recentSearchIcon: {
        fontSize: 18,
        marginRight: 12,
    },
    recentSearchContent: {
        flex: 1,
    },
    recentSearchQuery: {
        fontSize: 14,
        color: '#333',
    },
    recentSearchTime: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    removeSearchButton: {
        fontSize: 16,
        color: '#ccc',
        padding: 5,
    },
    emptySearches: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    emptySearchesText: {
        fontSize: 14,
        color: '#999',
    },
    suggestionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    suggestionCard: {
        width: (width - 50) / 2,
        borderRadius: 16,
        overflow: 'hidden',
    },
    suggestionGradient: {
        padding: 20,
        height: 140,
    },
    suggestionIcon: {
        fontSize: 28,
        marginBottom: 10,
    },
    suggestionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#fff',
    },
    suggestionSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 5,
    },
});
