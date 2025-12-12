import { LinearGradient } from 'expo-linear-gradient';
import React, { memo, useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    LayoutAnimation,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    UIManager,
    View,
} from 'react-native';
import { CAROUSEL_CONFIG, CategoryItemProps, ImageLoadState } from '../types/home.types';

// Habilitar LayoutAnimation en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * CategoryItem - Componente memoizado para el carrusel de categorías con acordeón
 * 
 * Beneficios:
 * - React.memo previene re-renderizados innecesarios
 * - Manejo de estados de carga/error para imágenes
 * - Acordeón de subcategorías integrado
 */
const CategoryItem: React.FC<CategoryItemProps> = memo(({ item, onPress, onSubcategoryPress }) => {
    const [imageState, setImageState] = useState<ImageLoadState>('idle');
    const [isExpanded, setIsExpanded] = useState(false);

    const handlePress = useCallback(() => {
        onPress?.(item);
    }, [item, onPress]);

    const handleToggleSubcategories = useCallback((e: any) => {
        e.stopPropagation();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded);
    }, [isExpanded]);

    const handleSubcategoryPress = useCallback((subcategory: any) => {
        onSubcategoryPress?.(item, subcategory);
    }, [item, onSubcategoryPress]);

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

    const hasSubcategories = item.subcategories && item.subcategories.length > 0;

    return (
        <View style={styles.categoryWrapper}>
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

                {/* Botón de subcategorías */}
                {hasSubcategories && (
                    <Pressable
                        style={({ pressed }) => [
                            styles.subcategoryButton,
                            pressed && styles.subcategoryButtonPressed
                        ]}
                        onPress={handleToggleSubcategories}
                        android_ripple={{ color: 'rgba(255,255,255,0.3)', radius: 14 }}
                    >
                        <View style={styles.hamburgerIcon}>
                            <View style={[styles.hamburgerLine, isExpanded && styles.hamburgerLineActive]} />
                            <View style={[styles.hamburgerLine, isExpanded && styles.hamburgerLineActive]} />
                            <View style={[styles.hamburgerLine, isExpanded && styles.hamburgerLineActive]} />
                        </View>
                    </Pressable>
                )}
            </Pressable>

            {/* Acordeón de subcategorías */}
            {isExpanded && hasSubcategories && (
                <View style={styles.subcategoriesAccordion}>
                    {item.subcategories!.map((subcategory) => (
                        <Pressable
                            key={subcategory.id}
                            style={({ pressed }) => [
                                styles.subcategoryItem,
                                pressed && styles.subcategoryItemPressed
                            ]}
                            onPress={() => handleSubcategoryPress(subcategory)}
                            android_ripple={{ color: 'rgba(153, 0, 255, 0.1)' }}
                        >
                            {subcategory.icon && (
                                <Text style={styles.subcategoryIcon}>{subcategory.icon}</Text>
                            )}
                            <Text style={styles.subcategoryText}>{subcategory.name}</Text>
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    );
});

// Importante para debugging en React DevTools
CategoryItem.displayName = 'CategoryItem';

const styles = StyleSheet.create({
    categoryWrapper: {
        marginRight: CAROUSEL_CONFIG.CARD_MARGIN,
        position: 'relative',
    },
    categoryCard: {
        width: CAROUSEL_CONFIG.CARD_WIDTH,
        height: CAROUSEL_CONFIG.CARD_HEIGHT,
        borderRadius: CAROUSEL_CONFIG.BORDER_RADIUS,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
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
    subcategoryButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: '#8b5cf6',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 6,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    subcategoryButtonPressed: {
        backgroundColor: '#7c3aed',
        transform: [{ scale: 0.92 }],
        shadowOpacity: 0.6,
        elevation: 8,
    },
    hamburgerIcon: {
        width: 14,
        height: 12,
        justifyContent: 'space-between',
    },
    hamburgerLine: {
        width: '100%',
        height: 2,
        backgroundColor: '#fff',
        borderRadius: 1,
    },
    hamburgerLineActive: {
        backgroundColor: '#fff',
    },
    subcategoriesAccordion: {
        marginTop: 8,
        marginBottom: 16,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 12,
        width: CAROUSEL_CONFIG.CARD_WIDTH,
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.1)',
    },
    subcategoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: '#f8f5ff',
        marginBottom: 6,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.08)',
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    subcategoryItemPressed: {
        backgroundColor: '#ede9fe',
        transform: [{ scale: 0.97 }],
        borderColor: '#8b5cf6',
        shadowOpacity: 0.15,
        elevation: 4,
    },
    subcategoryIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    subcategoryText: {
        fontSize: 14,
        color: '#4c1d95',
        fontWeight: '600',
        flex: 1,
        letterSpacing: 0.2,
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
