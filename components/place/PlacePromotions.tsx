import React from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Promotion } from '../../types/place.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.75;

interface PlacePromotionsProps {
    promotions: Promotion[];
    onPromotionPress?: (promotion: Promotion) => void;
}

export default function PlacePromotions({ promotions, onPromotionPress }: PlacePromotionsProps) {
    if (!promotions || promotions.length === 0) {
        return null;
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>🔥 Promociones</Text>
                <Text style={styles.sectionSubtitle}>Ofertas especiales para ti</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                decelerationRate="fast"
                snapToInterval={CARD_WIDTH + 12}
            >
                {promotions.map((promo) => (
                    <TouchableOpacity
                        key={promo.id}
                        style={styles.card}
                        activeOpacity={0.9}
                        onPress={() => onPromotionPress?.(promo)}
                    >
                        {/* Imagen de fondo */}
                        <Image source={promo.image} style={styles.cardImage} />

                        {/* Overlay gradiente */}
                        <View style={styles.cardOverlay} />

                        {/* Badge de descuento */}
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{promo.discount}</Text>
                        </View>

                        {/* Contenido */}
                        <View style={styles.cardContent}>
                            <Text style={styles.promoTitle} numberOfLines={2}>
                                {promo.title}
                            </Text>
                            <Text style={styles.promoDescription} numberOfLines={2}>
                                {promo.description}
                            </Text>

                            <View style={styles.cardFooter}>
                                <View style={styles.validityContainer}>
                                    <Text style={styles.validityIcon}>📅</Text>
                                    <Text style={styles.validityText}>
                                        Válido hasta {formatDate(promo.validUntil)}
                                    </Text>
                                </View>

                                {promo.code && (
                                    <View style={styles.codeContainer}>
                                        <Text style={styles.codeLabel}>Código:</Text>
                                        <Text style={styles.codeText}>{promo.code}</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Indicador de tipo */}
                        {promo.type && (
                            <View style={[
                                styles.typeBadge,
                                promo.type === 'flash' && styles.typeBadgeFlash,
                                promo.type === 'exclusive' && styles.typeBadgeExclusive,
                            ]}>
                                <Text style={styles.typeText}>
                                    {promo.type === 'flash' ? '⚡ Flash' :
                                        promo.type === 'exclusive' ? '👑 Exclusivo' :
                                            '🎁 Promo'}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
    },
    header: {
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 13,
        color: '#6b7280',
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    card: {
        width: CARD_WIDTH,
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#f3f4f6',
        marginRight: 12,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    discountBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#8b5cf6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    discountText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '800',
    },
    cardContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
    },
    promoTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    promoDescription: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    validityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    validityIcon: {
        fontSize: 12,
        marginRight: 4,
    },
    validityText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 11,
    },
    codeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    codeLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
        marginRight: 4,
    },
    codeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    typeBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    typeBadgeFlash: {
        backgroundColor: '#ef4444',
    },
    typeBadgeExclusive: {
        backgroundColor: '#f59e0b',
    },
    typeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
    },
});
