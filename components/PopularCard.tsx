import React, { memo, useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { ImageLoadState, POPULAR_CAROUSEL_CONFIG, PopularCardProps } from '../types/home.types';

/**
 * PopularCard - Componente memoizado para items populares
 */
const PopularCard: React.FC<PopularCardProps> = memo(({ item, onPress }) => {
    const [imageState, setImageState] = useState<ImageLoadState>('idle');

    const handlePress = useCallback(() => {
        onPress?.(item);
    }, [item, onPress]);

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
        <Pressable
            style={styles.popularCard}
            onPress={handlePress}
            android_ripple={{ color: 'rgba(153, 0, 255, 0.1)' }}
        >
            <View style={styles.popularImageContainer}>
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
                        styles.popularImage,
                        imageState === 'error' && styles.hiddenImage,
                    ]}
                    onLoadStart={handleLoadStart}
                    onLoadEnd={handleLoadEnd}
                    onError={handleError}
                    resizeMode="cover"
                />

                <View style={styles.popularTag}>
                    <Text style={styles.popularTagText}>{item.tag}</Text>
                </View>
            </View>

            <View style={styles.popularInfo}>
                <Text style={styles.popularTitle} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={styles.popularSubtitle} numberOfLines={1}>
                    {item.subtitle}
                </Text>
                <View style={styles.checkmarkContainer}>
                    <View style={styles.checkmarkCircle}>
                        <Text style={styles.checkmark}>✓</Text>
                    </View>
                    <Text style={styles.verifiedText}>Verificado</Text>
                </View>
                <View style={styles.ratingContainer}>
                    <Text style={styles.ratingStars}>{renderStars()}</Text>
                    <Text style={styles.ratingCount}>({item.reviews})</Text>
                </View>
            </View>
        </Pressable>
    );
});

PopularCard.displayName = 'PopularCard';

const styles = StyleSheet.create({
    popularCard: {
        width: POPULAR_CAROUSEL_CONFIG.CARD_WIDTH,
        height: POPULAR_CAROUSEL_CONFIG.CARD_HEIGHT,
        backgroundColor: '#fff',
        borderRadius: POPULAR_CAROUSEL_CONFIG.BORDER_RADIUS,
        overflow: 'hidden',
        marginRight: POPULAR_CAROUSEL_CONFIG.CARD_MARGIN,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    popularImageContainer: {
        height: 110,
        position: 'relative',
        backgroundColor: '#f5f5f5',
    },
    popularImage: {
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
    },
    errorContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    errorIcon: {
        fontSize: 32,
    },
    popularTag: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    popularTagText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '500',
    },
    popularInfo: {
        padding: 12,
    },
    popularTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    popularSubtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    checkmarkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    checkmarkCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#8b5cf6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        fontSize: 11,
        color: '#fff',
        fontWeight: 'bold',
    },
    verifiedText: {
        fontSize: 12,
        color: '#8b5cf6',
        fontWeight: '600',
        marginLeft: 6,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    ratingStars: {
        color: '#FFB800',
        fontSize: 12,
    },
    ratingCount: {
        fontSize: 11,
        color: '#666',
        marginLeft: 4,
    },
});

export default PopularCard;
