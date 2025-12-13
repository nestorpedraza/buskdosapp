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
import RelatedPlacesCarousel, { RelatedPlace } from '../../components/place/RelatedPlacesCarousel';
import { GalleryItem, PlaceDetails, Promotion } from '../../types/place.types';
// Mock de otros lugares de la misma cuenta
const relatedPlaces: RelatedPlace[] = [
    {
        id: '2',
        name: 'Pizzería Don Mario',
        image: require('../../assets/images/city.png'),
        category: 'Pizzería',
    },
    {
        id: '3',
        name: 'Trattoria Bella Notte',
        image: require('../../assets/images/city.png'),
        category: 'Italiana',
    },
    {
        id: '4',
        name: 'Gelato & Caffè',
        image: require('../../assets/images/city.png'),
        category: 'Café',
    },
    {
        id: '5',
        name: 'Ristorante Da Vinci',
        image: require('../../assets/images/city.png'),
        category: 'Italiana',
    },
    {
        id: '6',
        name: 'Panadería San Marco',
        image: require('../../assets/images/city.png'),
        category: 'Panadería',
    },
    {
        id: '7',
        name: 'Café Roma',
        image: require('../../assets/images/city.png'),
        category: 'Café',
    },
    {
        id: '8',
        name: 'Bistro Firenze',
        image: require('../../assets/images/city.png'),
        category: 'Bistró',
    },
    {
        id: '9',
        name: 'La Tagliatella',
        image: require('../../assets/images/city.png'),
        category: 'Italiana',
    },
    {
        id: '10',
        name: 'Pizza e Vino',
        image: require('../../assets/images/city.png'),
        category: 'Pizzería',
    },
    {
        id: '11',
        name: 'Dolce Vita',
        image: require('../../assets/images/city.png'),
        category: 'Postres',
    },
    {
        id: '12',
        name: 'Osteria Milano',
        image: require('../../assets/images/city.png'),
        category: 'Italiana',
    },
    {
        id: '13',
        name: 'Bar Torino',
        image: require('../../assets/images/city.png'),
        category: 'Bar',
    },
];

export default function PlaceDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(false);

    const handleRelatedPlacePress = (place: RelatedPlace) => {
        router.push({ pathname: '/place/[id]', params: { id: place.id } });
    };
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
        organization: 'Buskados Company',
        price: '$35 promedio',

        address: 'Calle 85 #15-32, Zona Rosa, Bogotá',
        coordinates: {
            latitude: 4.6769,
            longitude: -74.0482,
        },
        phone: '+57 1 234 5678',
        whatsapp: '+57 320 123 4567',
        schedule: {
            weekdays: '12:00 - 22:00',
            saturday: '12:00 - 23:00',
            sunday: '12:00 - 20:00',
        },
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
            { id: '10', type: 'image', url: require('../../assets/images/city.png'), likes: 321, comments: 22, shares: 10, description: 'Risotto de setas' },
            { id: '11', type: 'image', url: require('../../assets/images/city.png'), likes: 412, comments: 35, shares: 18, description: 'Ensalada caprese fresca' },
            { id: '12', type: 'video', url: require('../../assets/images/city.png'), likes: 278, comments: 17, shares: 7, description: 'Show de cocina en vivo' },
            { id: '13', type: 'image', url: require('../../assets/images/city.png'), likes: 134, comments: 12, shares: 4, description: 'Bruschettas variadas' },
            { id: '14', type: 'image', url: require('../../assets/images/city.png'), likes: 256, comments: 28, shares: 13, description: 'Mesa de postres' },
            { id: '15', type: 'video', url: require('../../assets/images/city.png'), likes: 367, comments: 44, shares: 21, description: 'Cata de vinos' },
            { id: '16', type: 'image', url: require('../../assets/images/city.png'), likes: 145, comments: 16, shares: 6, description: 'Pizza margarita' },
            { id: '17', type: 'image', url: require('../../assets/images/city.png'), likes: 299, comments: 31, shares: 14, description: 'Antipasto italiano' },
            { id: '18', type: 'image', url: require('../../assets/images/city.png'), likes: 210, comments: 19, shares: 9, description: 'Café espresso' },
            { id: '19', type: 'video', url: require('../../assets/images/city.png'), likes: 388, comments: 52, shares: 25, description: 'Receta de lasaña' },
            { id: '20', type: 'image', url: require('../../assets/images/city.png'), likes: 175, comments: 20, shares: 8, description: 'Helado artesanal' },
            { id: '21', type: 'image', url: require('../../assets/images/city.png'), likes: 222, comments: 27, shares: 11, description: 'Pan focaccia' },
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

    const handleOrganizationPress = () => {
        // Por ahora muestra un alert, después navegará al perfil de la organización
        Alert.alert('Organización', `Ver perfil de ${placeData.organization}`);
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
                    organization={placeData.organization}
                    onOrganizationPress={handleOrganizationPress}
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

                {/* Otros lugares de la misma cuenta */}
                <RelatedPlacesCarousel
                    places={relatedPlaces}
                    onPlacePress={handleRelatedPlacePress}
                />

                <View style={styles.divider} />

                <PlaceContactInfo
                    address={placeData.address}
                    coordinates={placeData.coordinates}
                    phone={placeData.phone}
                    whatsapp={placeData.whatsapp}
                    schedule={placeData.schedule}
                    isOpen={placeData.isOpen}
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

