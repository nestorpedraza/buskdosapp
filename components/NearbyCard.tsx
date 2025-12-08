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
// Calcular ancho de card basado en pantalla (2 columnas con padding y gap)
const CARD_WIDTH = (screenWidth - 40 - NEARBY_GRID_CONFIG.CARD_GAP) / NEARBY_GRID_CONFIG.NUM_COLUMNS;

/**
 * NearbyCard - Componente memoizado para items cercanos
 */
const NearbyCard: React.FC<NearbyCardProps> = memo(({ item, onPress }) => {
    const [imageState, setImageState] = useState<ImageLoadState>('idle');

    const handlePress = useCallback(() => {
        onPress?.(item);
    }, [item, onPress]);

    const handleLoadStart = useCallback(() => setImageState('loading'), []);
    const handleLoadEnd = useCallback(() => setImageState('loaded'), []);
    const handleError = useCallback(() => setImageState('error'), []);

    const imageSource = item.imageUri ? { uri: item.imageUri } : item.image;

    return (
        <Pressable
            style={styles.homeCard}
            onPress={handlePress}
            android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
        >
            {imageState === 'loading' && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#9900ff" />
                </View>
            )}

            {imageState === 'error' && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorIcon}>📍</Text>
                    <Text style={styles.errorText}>Sin imagen</Text>
                </View>
            )}

            <Image
                source={imageSource}
                style={[
                    styles.homeImage,
                    imageState === 'error' && styles.hiddenImage,
                ]}
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
                onError={handleError}
                resizeMode="cover"
            />

            {item.title && (
                <View style={styles.titleOverlay}>
                    <Text style={styles.titleText}>{item.title}</Text>
                </View>
            )}
        </Pressable>
    );
});

NearbyCard.displayName = 'NearbyCard';

const styles = StyleSheet.create({
    homeCard: {
        width: CARD_WIDTH,
        height: NEARBY_GRID_CONFIG.CARD_HEIGHT,
        borderRadius: NEARBY_GRID_CONFIG.BORDER_RADIUS,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        marginBottom: NEARBY_GRID_CONFIG.CARD_GAP,
    },
    homeImage: {
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
        fontSize: 24,
        marginBottom: 4,
    },
    errorText: {
        fontSize: 10,
        color: '#999',
    },
    titleOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    titleText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});

export default NearbyCard;
