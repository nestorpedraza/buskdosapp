import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

import HomeTabBar from '../../components/HomeTabBar';
import FloatingChatButton from '../../components/place/FloatingChatButton';
import PlaceApps from '../../components/place/PlaceApps';
import PlaceComments from '../../components/place/PlaceComments';
import PlaceContactInfo from '../../components/place/PlaceContactInfo';
import PlaceGallery from '../../components/place/PlaceGallery';
import PlaceHeader from '../../components/place/PlaceHeader';
import PlacePromotions from '../../components/place/PlacePromotions';
import { GalleryItem, PlaceDetails, Promotion } from '../../types/place.types';

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
        isOpen: true,
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

        promotions: [
            {
                id: 'promo1',
                title: 'Pasta Lovers',
                description: 'Todas las pastas con 30% de descuento los martes',
                discount: '30% OFF',
                image: require('../../assets/images/city.png'),
                validUntil: '2025-12-31',
                code: 'PASTA30',
                type: 'regular',
            },
            {
                id: 'promo2',
                title: '2x1 en Pizzas',
                description: 'Lleva 2 pizzas por el precio de 1. Solo hoy!',
                discount: '2x1',
                image: require('../../assets/images/city.png'),
                validUntil: '2025-12-15',
                type: 'flash',
            },
            {
                id: 'promo3',
                title: 'Menú Especial de Navidad',
                description: 'Entrada + Plato fuerte + Postre + Copa de vino',
                discount: '$89.900',
                image: require('../../assets/images/city.png'),
                validUntil: '2025-12-25',
                code: 'NAVIDAD2025',
                type: 'exclusive',
            },
            {
                id: 'promo4',
                title: 'Happy Hour',
                description: 'Cocteles y vinos al 50% de 5pm a 7pm',
                discount: '50% OFF',
                image: require('../../assets/images/city.png'),
                validUntil: '2025-12-31',
                type: 'regular',
            },
        ],

        reviewsList: [
            {
                id: 'rev1',
                userName: 'María González',
                userAvatar: require('../../assets/images/city.png'),
                rating: 5,
                comment: '¡Excelente lugar! La pasta carbonara es increíble, igual que en Italia. El servicio es muy atento y el ambiente es perfecto para una cena romántica.',
                date: '2025-12-10',
                likes: 24,
            },
            {
                id: 'rev2',
                userName: 'Carlos Rodríguez',
                userAvatar: require('../../assets/images/city.png'),
                rating: 4,
                comment: 'Muy buena comida italiana. Los precios son un poco altos pero la calidad lo vale. Recomiendo las pizzas al horno de leña.',
                date: '2025-12-08',
                likes: 15,
            },
            {
                id: 'rev3',
                userName: 'Ana Martínez',
                userAvatar: require('../../assets/images/city.png'),
                rating: 5,
                comment: 'El mejor tiramisú que he probado en Bogotá. Definitivamente volveré.',
                date: '2025-12-05',
                likes: 32,
            },
            {
                id: 'rev4',
                userName: 'Pedro López',
                userAvatar: require('../../assets/images/city.png'),
                rating: 4,
                comment: 'Ambiente acogedor y buena selección de vinos. El servicio puede mejorar un poco en horas pico.',
                date: '2025-11-28',
                likes: 8,
            },
            {
                id: 'rev5',
                userName: 'Laura Sánchez',
                userAvatar: require('../../assets/images/city.png'),
                rating: 5,
                comment: 'Celebramos nuestro aniversario aquí y fue perfecto. El chef salió a saludarnos. ¡Muy recomendado!',
                date: '2025-11-20',
                likes: 45,
            },
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

    const handlePromotionPress = (promo: Promotion) => {
        Alert.alert(
            promo.title,
            `${promo.description}\n\n${promo.code ? `Usa el código: ${promo.code}` : 'Sin código requerido'}`
        );
    };

    const handleChatPress = () => {
        Alert.alert('Chat', 'Iniciar conversación con el establecimiento');
    };

    const handleRecommend = () => {
        Alert.alert('Recomendar', '¡Gracias por recomendar este lugar!');
    };

    const handleReport = () => {
        Alert.alert(
            'Reportar lugar',
            '¿Por qué deseas reportar este lugar?',
            [
                { text: 'Información incorrecta', onPress: () => console.log('Report: info') },
                { text: 'Lugar cerrado', onPress: () => console.log('Report: closed') },
                { text: 'Contenido inapropiado', onPress: () => console.log('Report: inappropriate') },
                { text: 'Cancelar', style: 'cancel' },
            ]
        );
    };

    const handleSubmitReview = (rating: number, comment: string) => {
        Alert.alert('Gracias', `Tu reseña de ${rating} estrellas ha sido enviada.`);
        console.log('New review:', { rating, comment });
    };

    const handleLikeReview = (reviewId: string) => {
        console.log('Liked review:', reviewId);
    };

    const handleReplyReview = (reviewId: string) => {
        Alert.alert('Responder', 'Función de respuesta próximamente');
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <PlaceHeader
                    logo={placeData.logo}
                    coverImage={placeData.coverImage}
                    name={placeData.name}
                    description={placeData.description}
                    isVerified={placeData.isVerified}
                    rating={placeData.rating}
                    reviews={placeData.reviews}
                    category={placeData.category}
                    schedule={placeData.schedule}
                    isOpen={placeData.isOpen}
                    onShare={handleShare}
                    onFavorite={handleToggleFavorite}
                    onRecommend={handleRecommend}
                    onReport={handleReport}
                    isFavorite={isFavorite}
                />

                {/* Promociones */}
                {placeData.promotions && placeData.promotions.length > 0 && (
                    <>
                        <View style={styles.divider} />
                        <PlacePromotions
                            promotions={placeData.promotions}
                            onPromotionPress={handlePromotionPress}
                        />
                    </>
                )}

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

                {/* Comentarios y reseñas al final */}
                <View style={styles.divider} />
                <PlaceComments
                    reviews={placeData.reviewsList || []}
                    totalReviews={placeData.reviews}
                    averageRating={placeData.rating}
                    onSubmitReview={handleSubmitReview}
                    onLikeReview={handleLikeReview}
                    onReplyReview={handleReplyReview}
                />

                {/* Espacio extra para el botón flotante */}
                <View style={styles.bottomSpacer} />
            </ScrollView>

            {/* Botón de chat flotante */}
            <FloatingChatButton
                onPress={handleChatPress}
                unreadCount={3}
            />

            {/* Tab Bar de navegación */}
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
    divider: {
        height: 8,
        backgroundColor: '#f3f4f6',
    },
    bottomSpacer: {
        height: 120,
    },
});
