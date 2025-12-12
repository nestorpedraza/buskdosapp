import React from 'react';
import {
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface PlaceHeaderProps {
    logo: ImageSourcePropType;
    name: string;
    description: string;
    isVerified: boolean;
    rating: number;
    reviews: number;
    category: string;
    onBack: () => void;
    onShare: () => void;
    onFavorite: () => void;
    isFavorite?: boolean;
}

export default function PlaceHeader({
    logo,
    name,
    description,
    isVerified,
    rating,
    reviews,
    category,
    onBack,
    onShare,
    onFavorite,
    isFavorite = false,
}: PlaceHeaderProps) {
    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<Text key={i} style={styles.starFilled}>★</Text>);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<Text key={i} style={styles.starHalf}>★</Text>);
            } else {
                stars.push(<Text key={i} style={styles.starEmpty}>★</Text>);
            }
        }
        return stars;
    };

    return (
        <View style={styles.container}>
            {/* Barra de navegación */}
            <View style={styles.navBar}>
                <TouchableOpacity style={styles.navButton} onPress={onBack}>
                    <Text style={styles.navIcon}>←</Text>
                </TouchableOpacity>
                <View style={styles.navActions}>
                    <TouchableOpacity style={styles.navButton} onPress={onShare}>
                        <Text style={styles.navIcon}>↗</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navButton} onPress={onFavorite}>
                        <Text style={[styles.navIcon, isFavorite && styles.favoriteActive]}>
                            {isFavorite ? '♥' : '♡'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Info del lugar */}
            <View style={styles.infoContainer}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image source={logo} style={styles.logo} />
                    {isVerified && (
                        <View style={styles.verifiedBadge}>
                            <Text style={styles.verifiedIcon}>✓</Text>
                        </View>
                    )}
                </View>

                {/* Detalles */}
                <View style={styles.detailsContainer}>
                    <View style={styles.nameRow}>
                        <Text style={styles.name} numberOfLines={1}>{name}</Text>
                    </View>

                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{category}</Text>
                    </View>

                    <View style={styles.ratingContainer}>
                        <View style={styles.starsContainer}>
                            {renderStars()}
                        </View>
                        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
                        <Text style={styles.reviewsText}>({reviews} reseñas)</Text>
                    </View>
                </View>
            </View>

            {/* Descripción */}
            <Text style={styles.description} numberOfLines={3}>
                {description}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    navButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navIcon: {
        fontSize: 20,
        color: '#333',
    },
    navActions: {
        flexDirection: 'row',
        gap: 8,
    },
    favoriteActive: {
        color: '#ef4444',
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    logoContainer: {
        position: 'relative',
        marginRight: 16,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#8b5cf6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    verifiedIcon: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    detailsContainer: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
        flex: 1,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#f3e8ff',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
    },
    categoryText: {
        fontSize: 12,
        color: '#8b5cf6',
        fontWeight: '600',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
        marginRight: 6,
    },
    starFilled: {
        fontSize: 14,
        color: '#fbbf24',
    },
    starHalf: {
        fontSize: 14,
        color: '#fcd34d',
    },
    starEmpty: {
        fontSize: 14,
        color: '#d1d5db',
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
        marginRight: 4,
    },
    reviewsText: {
        fontSize: 12,
        color: '#6b7280',
    },
    description: {
        fontSize: 14,
        color: '#4b5563',
        lineHeight: 20,
    },
});
