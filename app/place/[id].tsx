import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

import FloatingChatButton from '../../components/place/FloatingChatButton';
import PlaceApps from '../../components/place/PlaceApps';
import PlaceContactInfo from '../../components/place/PlaceContactInfo';
import PlaceGallery from '../../components/place/PlaceGallery';
import PlaceHeader from '../../components/place/PlaceHeader';
import { GalleryItem, PlaceDetails } from '../../types/place.types';

export default function PlaceDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(false);

    // Mock data - en producción vendría de una API
    const placeData: PlaceDetails = useMemo(() => ({
        id: id || '1',
        name: 'Restaurante La Casa Italiana',
        description: 'Auténtica cocina italiana con más de 20 años de tradición. Pasta fresca hecha diariamente, pizzas al horno de leña y los mejores vinos importados.',
        logo: require('../../assets/images/city.png'),
        coverImage: require('../../assets/images/city.png'),
        isVerified: true,
        rating: 4.8,
        reviews: 847,
        category: 'Restaurantes',
        subcategory: 'Italiana',
        price: '$35 promedio',

        address: 'Calle 85 #15-32, Zona Rosa, Bogotá',
        coordinates: {
            latitude: 4.6769,
            longitude: -74.0482,
        },
        phone: '+57 1 234 5678',
        whatsapp: '+57 320 123 4567',
        schedule: 'Lun - Sáb: 12:00 - 22:00',
        website: 'www.lacasaitaliana.com.co',

        socialMedia: {
            facebook: 'https://facebook.com/lacasaitaliana',
            instagram: 'https://instagram.com/lacasaitaliana',
            tiktok: 'https://tiktok.com/@lacasaitaliana',
            twitter: 'https://twitter.com/lacasaitaliana',
            youtube: 'https://youtube.com/lacasaitaliana',
        },

        deliveryApps: {
            rappi: 'https://rappi.com.co/restaurantes/la-casa-italiana',
            didifood: 'https://didifood.com/co/la-casa-italiana',
            ubereats: 'https://ubereats.com/co/la-casa-italiana',
            ifood: 'https://ifood.com.co/la-casa-italiana',
            domicilios: 'https://domicilios.com/la-casa-italiana',
        },

        gallery: [
            { id: '1', type: 'image', url: require('../../assets/images/city.png'), likes: 234, comments: 45, shares: 12, description: 'Nuestra famosa pasta carbonara 🍝' },
            { id: '2', type: 'video', url: require('../../assets/images/city.png'), likes: 567, comments: 89, shares: 34, description: 'Preparación de pizza napolitana' },
            { id: '3', type: 'image', url: require('../../assets/images/city.png'), likes: 189, comments: 23, shares: 8, description: 'Tiramisú casero' },
            { id: '4', type: 'image', url: require('../../assets/images/city.png'), likes: 345, comments: 56, shares: 19, description: 'Ambiente del restaurante' },
            { id: '5', type: 'video', url: require('../../assets/images/city.png'), likes: 890, comments: 134, shares: 67, description: 'Nuestro chef en acción 👨‍🍳' },
            { id: '6', type: 'image', url: require('../../assets/images/city.png'), likes: 123, comments: 18, shares: 5, description: 'Vinos seleccionados' },
            { id: '7', type: 'image', url: require('../../assets/images/city.png'), likes: 267, comments: 41, shares: 15 },
            { id: '8', type: 'image', url: require('../../assets/images/city.png'), likes: 198, comments: 29, shares: 11 },
            { id: '9', type: 'video', url: require('../../assets/images/city.png'), likes: 456, comments: 78, shares: 29 },
        ],
    }), [id]);

    const handleBack = () => {
        router.back();
    };

    const handleShare = () => {
        Alert.alert('Compartir', 'Compartir este lugar');
    };

    const handleToggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const handleGalleryItemPress = (item: GalleryItem) => {
        console.log('Gallery item pressed:', item.id);
    };

    const handleChatPress = () => {
        Alert.alert('Chat', 'Iniciar conversación con el establecimiento');
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <PlaceHeader
                    logo={placeData.logo}
                    name={placeData.name}
                    description={placeData.description}
                    isVerified={placeData.isVerified}
                    rating={placeData.rating}
                    reviews={placeData.reviews}
                    category={placeData.category}
                    onBack={handleBack}
                    onShare={handleShare}
                    onFavorite={handleToggleFavorite}
                    isFavorite={isFavorite}
                />

                <View style={styles.divider} />

                <PlaceGallery
                    items={placeData.gallery}
                    onItemPress={handleGalleryItemPress}
                />

                <View style={styles.divider} />

                <PlaceContactInfo
                    address={placeData.address}
                    coordinates={placeData.coordinates}
                    phone={placeData.phone}
                    whatsapp={placeData.whatsapp}
                    schedule={placeData.schedule}
                    website={placeData.website}
                />

                <View style={styles.divider} />

                <PlaceApps
                    socialMedia={placeData.socialMedia}
                    deliveryApps={placeData.deliveryApps}
                />

                {/* Espacio extra para el botón flotante */}
                <View style={styles.bottomSpacer} />
            </ScrollView>

            {/* Botón de chat flotante */}
            <FloatingChatButton
                onPress={handleChatPress}
                unreadCount={3}
            />
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
    divider: {
        height: 8,
        backgroundColor: '#f3f4f6',
    },
    bottomSpacer: {
        height: 120,
    },
});
