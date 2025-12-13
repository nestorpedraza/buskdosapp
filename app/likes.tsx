import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Platform,
    StyleSheet,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeHeader from '../components/HomeHeader';
import HomeTabBar from '../components/HomeTabBar';
import LikedCard from '../components/LikedCard';
import LikesEmptyState from '../components/LikesEmptyState';
import TitlesHeader from '../components/TitlesHeader';

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

export default function LikesScreen() {
    const router = useRouter();

    const [likedItems, setLikedItems] = useState<LikedItem[]>([
        {
            id: '1',
            tag: 'Tienda Local',
            title: 'Boutique Fashion',
            subtitle: 'Ropa y accesorios',
            price: '$50 promedio',
            rating: 4.7,
            reviews: 120,
            image: require('../assets/images/city.png'),
            distance: '1.2 km',
        },
        {
            id: '5',
            tag: 'Panadería',
            title: 'Pan del Día',
            subtitle: 'Panadería artesanal',
            price: '$5 promedio',
            rating: 4.9,
            reviews: 567,
            image: require('../assets/images/city.png'),
            distance: '0.3 km',
        },
        {
            id: '6',
            tag: 'Librería',
            title: 'Letras & Libros',
            subtitle: 'Libros nuevos y usados',
            price: '$15 promedio',
            rating: 4.5,
            reviews: 234,
            image: require('../assets/images/city.png'),
            distance: '1.5 km',
        },
        {
            id: '7',
            tag: 'Spa',
            title: 'Relax Zone',
            subtitle: 'Masajes y tratamientos',
            price: '$60 por sesión',
            rating: 4.8,
            reviews: 412,
            image: require('../assets/images/city.png'),
            distance: '2.3 km',
        },
        {
            id: '8',
            tag: 'Farmacia',
            title: 'Farma Salud',
            subtitle: 'Medicamentos y más',
            price: 'Variado',
            rating: 4.4,
            reviews: 189,
            image: require('../assets/images/city.png'),
            distance: '0.6 km',
        },
        {
            id: '9',
            tag: 'Cine',
            title: 'Cinema Plaza',
            subtitle: 'Últimos estrenos',
            price: '$12 por entrada',
            rating: 4.6,
            reviews: 892,
            image: require('../assets/images/city.png'),
            distance: '1.8 km',
        },
        {
            id: '10',
            tag: 'Restaurante',
            title: 'Sushi Bar',
            subtitle: 'Cocina japonesa',
            price: '$35 por persona',
            rating: 4.9,
            reviews: 623,
            image: require('../assets/images/city.png'),
            distance: '1.0 km',
        },
        {
            id: '11',
            tag: 'Bar',
            title: 'The Lounge',
            subtitle: 'Cocteles premium',
            price: '$20 promedio',
            rating: 4.7,
            reviews: 445,
            image: require('../assets/images/city.png'),
            distance: '1.4 km',
        },
        {
            id: '12',
            tag: 'Peluquería',
            title: 'Style Studio',
            subtitle: 'Corte y color',
            price: '$25 por servicio',
            rating: 4.8,
            reviews: 356,
            image: require('../assets/images/city.png'),
            distance: '0.9 km',
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
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <HomeHeader />

                {/* Section Title */}
                <TitlesHeader likedCount={likedItems.length} title="Mis Lugares"
                    subtitle="Tus destinos favoritos" />

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
                    <LikesEmptyState onExplore={() => router.push('/homescreen')} />
                )}

                {/* Bottom Tab Bar */}
                <HomeTabBar activeRoute="/likes" />
            </View>
        </SafeAreaView>
    );
};

// export default LikesScreen; // Removed duplicate default export

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
        padding: 20,
        paddingBottom: 100,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 15,
    },
});
