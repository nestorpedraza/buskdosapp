import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import HomeTabBar from '../components/HomeTabBar';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

interface LikedItem {
    id: string;
    tag: string;
    title: string;
    subtitle: string;
    price: string;
    rating: number;
    reviews: number;
    image: any;
    distance: string;
}

function LikedCard({ item, onUnlike }: { item: LikedItem; onUnlike: (id: string) => void }) {
    return (
        <View style={styles.card}>
            <Image source={item.image} style={styles.cardImage} />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.cardGradient}
            />
            <Pressable
                style={styles.likeButton}
                onPress={() => onUnlike(item.id)}
            >
                <Text style={styles.likeIcon}>❤️</Text>
            </Pressable>
            <View style={styles.cardContent}>
                <View style={styles.tagContainer}>
                    <Text style={styles.tag}>{item.tag}</Text>
                </View>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cardSubtitle} numberOfLines={1}>{item.subtitle}</Text>
                <View style={styles.cardFooter}>
                    <Text style={styles.rating}>⭐ {item.rating}</Text>
                    <Text style={styles.distance}>📍 {item.distance}</Text>
                </View>
            </View>
        </View>
    );
}

export default function LikesScreen() {
    const router = useRouter();

    const [likedItems, setLikedItems] = useState<LikedItem[]>([
        {
            id: '1',
            tag: 'Tienda Local',
            title: 'Boutique Fashion',
            subtitle: 'Ropa y accesorios',
            price: '$50 promedio',
            rating: 4.8,
            reviews: 984,
            image: require('../assets/images/city.png'),
            distance: '0.5 km',
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
            distance: '1.2 km',
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
            distance: '0.8 km',
        },
        {
            id: '4',
            tag: 'Gimnasio',
            title: 'FitLife Center',
            subtitle: 'Entrena sin límites',
            price: '$30/mes',
            rating: 4.6,
            reviews: 320,
            image: require('../assets/images/city.png'),
            distance: '2.1 km',
        },
    ]);

    const handleUnlike = (id: string) => {
        setLikedItems(prev => prev.filter(item => item.id !== id));
    };

    const renderItem = ({ item }: { item: LikedItem }) => (
        <LikedCard item={item} onUnlike={handleUnlike} />
    );

    const keyExtractor = (item: LikedItem) => item.id;

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={['#9900ff', '#ff00f7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.headerGradient}
            >
                <Text style={styles.headerTitle}>Mis Favoritos</Text>
                <Text style={styles.headerSubtitle}>
                    {likedItems.length} lugares guardados
                </Text>
            </LinearGradient>

            {/* Content */}
            {likedItems.length > 0 ? (
                <FlatList
                    data={likedItems}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>💔</Text>
                    <Text style={styles.emptyTitle}>Sin favoritos aún</Text>
                    <Text style={styles.emptySubtitle}>
                        Explora y guarda los lugares que te gusten
                    </Text>
                    <Pressable
                        style={styles.exploreButton}
                        onPress={() => router.push('/HomeScreen')}
                    >
                        <LinearGradient
                            colors={['#9900ff', '#ff00f7']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.exploreButtonGradient}
                        >
                            <Text style={styles.exploreButtonText}>Explorar</Text>
                        </LinearGradient>
                    </Pressable>
                </View>
            )}

            {/* Bottom Tab Bar */}
            <HomeTabBar activeRoute="/likes" />
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
        paddingBottom: 25,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 5,
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    card: {
        width: CARD_WIDTH,
        height: 200,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '70%',
    },
    likeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    likeIcon: {
        fontSize: 16,
    },
    cardContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
    },
    tagContainer: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(153, 0, 255, 0.8)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        marginBottom: 5,
    },
    tag: {
        fontSize: 9,
        color: '#fff',
        fontWeight: '600',
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    cardSubtitle: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
    },
    rating: {
        fontSize: 11,
        color: '#fff',
        fontWeight: '600',
    },
    distance: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.8)',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        fontSize: 60,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginBottom: 30,
    },
    exploreButton: {
        borderRadius: 25,
        overflow: 'hidden',
    },
    exploreButtonGradient: {
        paddingHorizontal: 40,
        paddingVertical: 15,
    },
    exploreButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
