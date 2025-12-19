import React, { memo, useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { ImageLoadState, NEARBY_GRID_CONFIG, NearbyCardProps } from '../types/home.types';

const { width: screenWidth } = Dimensions.get('window');

/**
 * NearbyCard - Componente memoizado para items cercanos
 * Diseño similar a PopularCard con distancia
 */
const NearbyCard: React.FC<NearbyCardProps> = memo(({ item, columns, onDetailPress, onMapPress }) => {
    const [imageState, setImageState] = useState<ImageLoadState>('idle');
    const computedColumns = columns || NEARBY_GRID_CONFIG.NUM_COLUMNS;
    const CARD_WIDTH = (screenWidth - 40 - NEARBY_GRID_CONFIG.CARD_GAP) / computedColumns;

    const handleDetailPress = useCallback(() => {
        onDetailPress?.(item);
    }, [item, onDetailPress]);
    const handleMapPress = useCallback(() => {
        onMapPress?.(item);
    }, [item, onMapPress]);

    const handleLoadStart = useCallback(() => setImageState('loading'), []);
    const handleLoadEnd = useCallback(() => setImageState('loaded'), []);
    const handleError = useCallback(() => setImageState('error'), []);

    const imageSource = item.imageUri ? { uri: item.imageUri } : item.image;

    // Generar estrellas basadas en el rating
    const renderStars = () => {
        const fullStars = Math.floor(item.rating);
        const hasHalfStar = item.rating % 1 >= 0.5;
        let stars = '★'.repeat(fullStars);
        if (hasHalfStar && fullStars < 5) stars += '☆';
        return stars.padEnd(5, '☆');
    };

    return (
        <View
            style={[styles.card, { width: CARD_WIDTH }]}
        >
            {/* Imagen */}
            <View style={styles.imageContainer}>
                {imageState === 'loading' && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#9900ff" />
                    </View>
                )}

                {imageState === 'error' && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorIcon}>🏪</Text>
                    </View>
                )}

                <Image
                    source={imageSource}
                    style={[
                        styles.image,
                        imageState === 'error' && styles.hiddenImage,
                    ]}
                    onLoadStart={handleLoadStart}
                    onLoadEnd={handleLoadEnd}
                    onError={handleError}
                    resizeMode="cover"
                />

                {/* Tag de categoría */}
                <View style={styles.tag}>
                    <Text style={styles.tagText}>{item.tag}</Text>
                </View>

                {/* Badge de distancia */}
                <View style={styles.distanceBadge}>
                    <Text style={styles.distanceText}>📍 {item.distance}</Text>
                </View>
            </View>

            {/* Información */}
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                    {item.subtitle}
                </Text>
                {item.isVerified && (
                    <View style={styles.checkmarkContainer}>
                        <View style={styles.checkmarkCircle}>
                            <Text style={styles.checkmark}>✓</Text>
                        </View>
                        <Text style={styles.verifiedText}>Verificado</Text>
                    </View>
                )}
                <View style={styles.ratingContainer}>
                    <Text style={styles.ratingStars}>{renderStars()}</Text>
                    <Text style={styles.ratingCount}>({item.reviews})</Text>
                </View>
                <View style={styles.actions}>
                    <Pressable style={styles.actionButton} onPress={handleDetailPress}>
                        <Text style={styles.actionText}>Detalle</Text>
                    </Pressable>
                    <Pressable style={[styles.actionButton, styles.actionButtonRight]} onPress={handleMapPress}>
                        <Text style={styles.actionText}>Mapa</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
});

NearbyCard.displayName = 'NearbyCard';

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: NEARBY_GRID_CONFIG.BORDER_RADIUS,
        overflow: 'hidden',
        marginBottom: NEARBY_GRID_CONFIG.CARD_GAP,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    imageContainer: {
        height: 100,
        position: 'relative',
        backgroundColor: '#f5f5f5',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    hiddenImage: {
        opacity: 0,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        zIndex: 1,
    },
    errorContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        zIndex: 1,
    },
    errorIcon: {
        fontSize: 32,
    },
    tag: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    tagText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '500',
    },
    distanceBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 10,
    },
    distanceText: {
        color: '#333',
        fontSize: 9,
        fontWeight: '600',
    },
    info: {
        padding: 10,
    },
    title: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 11,
        color: '#666',
        marginTop: 2,
    },
    checkmarkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    checkmarkCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#8b5cf6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
    },
    verifiedText: {
        fontSize: 11,
        color: '#8b5cf6',
        fontWeight: '600',
        marginLeft: 6,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    ratingStars: {
        color: '#FFB800',
        fontSize: 10,
    },
    ratingCount: {
        fontSize: 10,
        color: '#666',
        marginLeft: 4,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
    actionButton: {
        flex: 1,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#9900ff',
        shadowColor: '#9900ff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
    },
    actionButtonRight: {},
    actionText: {
        fontSize: 12,
        color: '#333',
        fontWeight: '700',
    },
});

export default NearbyCard;
