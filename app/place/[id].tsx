import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HomeTabBar from '../../components/HomeTabBar';
import FloatingChatButton from '../../components/place/FloatingChatButton';
import PlaceApps from '../../components/place/PlaceApps';
import PlaceComments from '../../components/place/PlaceComments';
import PlaceContactInfo from '../../components/place/PlaceContactInfo';
import PlaceEcommerceApps from '../../components/place/PlaceEcommerceApps';
import PlaceGallery from '../../components/place/PlaceGallery';
import PlaceHeader from '../../components/place/PlaceHeader';
import PlacePromotions from '../../components/place/PlacePromotions';
import RelatedPlacesCarousel, { RelatedPlace } from '../../components/place/RelatedPlacesCarousel';
import { fetchPlaceDetails, fetchRelatedPlaces } from '../../data/placeService';
import { GalleryItem, PlaceDetails, Promotion } from '../../types/place.types';
// Mock de otros lugares de la misma cuenta

export default function PlaceDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(false);
    const [placeData, setPlaceData] = useState<PlaceDetails | null>(null);
    const [relatedPlaces, setRelatedPlaces] = useState<RelatedPlace[]>([]);

    const handleRelatedPlacePress = (place: RelatedPlace) => {
        router.push({ pathname: '/place/[id]', params: { id: place.id } });
    };
    React.useEffect(() => {
        fetchPlaceDetails(id || 'p-1').then(setPlaceData);
        fetchRelatedPlaces().then((list) => {
            const currentId = id || 'p-1';
            setRelatedPlaces(list.filter(p => p.id !== currentId));
        });
    }, [id]);


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
        const org = placeData?.organization || '';
        if (org) {
            Alert.alert('Organización', `Ver perfil de ${org}`);
        } else {
            Alert.alert('Organización', 'Información de organización no disponible aún.');
        }
    };

    const handleSubmitReview = (rating: number, comment: string) => {
        Alert.alert('Gracias', `Tu reseña de ${rating} estrellas ha sido enviada.`);
        console.log('New review:', { rating, comment });
    };

    const handleLikeReview = (reviewId: string) => {
        console.log('Liked review:', reviewId);
    };

    const handleReplyReview = () => {
        Alert.alert('Responder', 'Función de respuesta próximamente');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    {placeData && (
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
                    )}

                    {/* Promociones */}
                    {placeData && placeData.promotions && placeData.promotions.length > 0 && (
                        <>
                            <View style={styles.divider} />
                            <PlacePromotions
                                promotions={placeData.promotions || []}
                                onPromotionPress={handlePromotionPress}
                            />
                        </>
                    )}

                    <View style={styles.divider} />


                    {placeData && (
                        <PlaceGallery
                            items={placeData.gallery}
                            onItemPress={handleGalleryItemPress}
                        />
                    )}

                    {/* Otros lugares de la misma cuenta */}
                    {relatedPlaces.length > 0 && (
                        <RelatedPlacesCarousel
                            places={relatedPlaces}
                            onPlacePress={handleRelatedPlacePress}
                        />
                    )}

                    <View style={styles.divider} />

                    {placeData && (
                        <PlaceContactInfo
                            address={placeData.address}
                            coordinates={placeData.coordinates}
                            placeId={placeData.id}
                            phone={placeData.phone}
                            phones={placeData.phones}
                            whatsapp={placeData.whatsapp}
                            whatsapps={placeData.whatsapps}
                            schedule={placeData.schedule}
                            isOpen={placeData.isOpen}
                            website={placeData.website}
                            emails={placeData.emails}
                        />
                    )}

                    <View style={styles.divider} />


                    {placeData && (
                        <PlaceApps
                            socialMedia={placeData.socialMedia}
                            deliveryApps={placeData.deliveryApps}
                        />
                    )}

                    {/* E-commerce apps */}
                    <PlaceEcommerceApps />

                    {/* Comentarios y reseñas al final */}
                    <View style={styles.divider} />
                    {placeData && (
                        <PlaceComments
                            reviews={placeData.reviewsList || []}
                            totalReviews={placeData.reviews}
                            averageRating={placeData.rating}
                            onSubmitReview={handleSubmitReview}
                            onLikeReview={handleLikeReview}
                            onReplyReview={handleReplyReview}
                        />
                    )}

                    {/* Espacio extra para el botón flotante */}
                    <View style={styles.bottomSpacer} />
                </ScrollView>

                {/* Botón de chat flotante */}
                <FloatingChatButton
                    onPress={handleChatPress}
                    unreadCount={3}
                />

                {/* Tab Bar de navegación */}
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
    divider: {
        height: 8,
        backgroundColor: '#f3f4f6',
    },
    bottomSpacer: {
        height: 120,
    },
});

