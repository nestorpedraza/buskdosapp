import { LinearGradient } from 'expo-linear-gradient';
import React, { memo, useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { CAROUSEL_CONFIG, CategoryItemProps, ImageLoadState } from '../types/home.types';

/**
 * CategoryItem - Componente memoizado para el carrusel de categorías
 * 
 * Beneficios:
 * - React.memo previene re-renderizados innecesarios
 * - Manejo de estados de carga/error para imágenes
 * - Componente extraído del renderItem para mejor legibilidad y testabilidad
 */
const CategoryItem: React.FC<CategoryItemProps> = memo(({ item, onPress }) => {
    const [imageState, setImageState] = useState<ImageLoadState>('idle');

    const handlePress = useCallback(() => {
        onPress?.(item);
    }, [item, onPress]);

    const handleLoadStart = useCallback(() => {
        setImageState('loading');
    }, []);

    const handleLoadEnd = useCallback(() => {
        setImageState('loaded');
    }, []);

    const handleError = useCallback(() => {
        setImageState('error');
    }, []);

    // Determinar la fuente de la imagen (local o URI)
    const imageSource = item.imageUri ? { uri: item.imageUri } : item.image;

    return (
        <Pressable
            style={styles.categoryCard}
            onPress={handlePress}
            android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
        >
            {/* Estado de carga */}
            {imageState === 'loading' && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#9900ff" />
                </View>
            )}

            {/* Estado de error - Placeholder */}
            {imageState === 'error' && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorIcon}>🖼️</Text>
                    <Text style={styles.errorText}>Sin imagen</Text>
                </View>
            )}

            {/* Imagen */}
            <Image
                source={imageSource}
                style={[
                    styles.categoryImage,
                    imageState === 'error' && styles.hiddenImage,
                ]}
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
                onError={handleError}
                resizeMode="cover"
            />

            {/* Overlay con gradiente */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.categoryOverlay}
            />

            {/* Texto de la categoría */}
            <Text style={styles.categoryText}>{item.name}</Text>
        </Pressable>
    );
});

// Importante para debugging en React DevTools
CategoryItem.displayName = 'CategoryItem';

const styles = StyleSheet.create({
    categoryCard: {
        width: CAROUSEL_CONFIG.CARD_WIDTH,
        height: CAROUSEL_CONFIG.CARD_HEIGHT,
        borderRadius: CAROUSEL_CONFIG.BORDER_RADIUS,
        overflow: 'hidden',
        marginRight: CAROUSEL_CONFIG.CARD_MARGIN,
        backgroundColor: '#f0f0f0', // Color de fondo mientras carga
    },
    categoryImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    hiddenImage: {
        opacity: 0,
    },
    categoryOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
    },
    categoryText: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
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
        fontSize: 24,
        marginBottom: 4,
    },
    errorText: {
        fontSize: 10,
        color: '#999',
    },
});

export default CategoryItem;
