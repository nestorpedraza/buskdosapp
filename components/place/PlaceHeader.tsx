import React from 'react';
import {
    Image,
    ImageBackground,
    ImageSourcePropType,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface PlaceSchedule {
    weekdays: string;
    saturday?: string;
    sunday?: string;
}

interface PlaceHeaderProps {
    logo: ImageSourcePropType;
    coverImage?: ImageSourcePropType;
    name: string;
    description: string;
    isVerified: boolean;
    rating: number;
    reviews: number;
    category: string;
    organization?: string;
    onOrganizationPress?: () => void;
    schedule?: string | PlaceSchedule;
    isOpen?: boolean;
    onShare: () => void;
    onFavorite: () => void;
    onRecommend?: () => void;
    onReport?: () => void;
    isFavorite?: boolean;
}

// Colores del degradado de #9900ff a #ff00f7
const GRADIENT_COLORS = [
    '#9900ff', // Morado
    '#b300f7', // Morado-Rosa
    '#cc00ef', // Rosa-Morado
    '#e600e7', // Rosa
    '#ff00f7', // Magenta
];

export default function PlaceHeader({
    logo,
    coverImage,
    name,
    description,
    isVerified,
    rating,
    reviews,
    category,
    organization,
    onOrganizationPress,
    schedule,
    isOpen = true,
    onShare,
    onFavorite,
    onRecommend,
    onReport,
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

    // Botones de acción con sus colores
    const actionButtons = [
        { id: 'share', icon: '📤', label: 'Compartir', onPress: onShare },
        { id: 'favorite', icon: isFavorite ? '❤️' : '🤍', label: 'Favorito', onPress: onFavorite },
        { id: 'recommend', icon: '👍', label: 'Recomendar', onPress: onRecommend },
        { id: 'report', icon: '⚠️', label: 'Reportar', onPress: onReport },
    ];

    return (
        <View style={styles.container}>
            {/* Banner de fondo */}
            <ImageBackground
                source={coverImage || logo}
                style={styles.coverImage}
                resizeMode="cover"
            >
                {/* Overlay oscuro semi-transparente */}
                <View style={styles.coverOverlay} />
            </ImageBackground>

            {/* Sección de perfil tipo Facebook */}
            <View style={styles.profileSection}>
                {/* Logo flotante */}
                <View style={styles.logoWrapper}>
                    <View style={styles.logoContainer}>
                        <Image source={logo} style={styles.logo} />
                        {isVerified && (
                            <View style={styles.verifiedBadge}>
                                <Text style={styles.verifiedIcon}>✓</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Info del lugar */}
                <View style={styles.infoContainer}>
                    <Text style={styles.name} numberOfLines={2}>{name}</Text>

                    {organization && (
                        <TouchableOpacity onPress={onOrganizationPress} activeOpacity={0.7}>
                            <Text style={styles.organizationText} numberOfLines={1}>
                                {organization}
                            </Text>
                        </TouchableOpacity>
                    )}

                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{category}</Text>
                    </View>
                </View>
            </View>

            {/* Rating y reseñas - debajo del perfil */}
            <View style={styles.ratingSection}>
                <View style={styles.starsContainer}>
                    {renderStars()}
                </View>
                <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
                <Text style={styles.reviewsText}>({reviews} reseñas)</Text>
            </View>

            {/* Horario */}
            <View style={[styles.scheduleContainer, !isOpen && styles.scheduleContainerClosed]}>
                <View style={[styles.statusIndicator, isOpen ? styles.statusOpen : styles.statusClosed]} />
                <Text style={[styles.statusText, isOpen ? styles.statusTextOpen : styles.statusTextClosed]}>
                    {isOpen ? 'Abierto' : 'Cerrado'}
                </Text>
            </View>

            {/* Descripción */}
            <Text style={styles.description} numberOfLines={3}>
                {description}
            </Text>

            {/* Botones de acción */}
            <View style={styles.actionsContainer}>
                {actionButtons.map((btn, index) => (
                    <TouchableOpacity
                        key={btn.id}
                        style={[
                            styles.actionButton,
                            { backgroundColor: GRADIENT_COLORS[index] }
                        ]}
                        onPress={btn.onPress}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.actionIcon}>{btn.icon}</Text>
                        <Text style={styles.actionLabel}>{btn.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    coverImage: {
        height: 160,
        width: '100%',
    },
    coverOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        marginTop: -45,
    },
    logoWrapper: {
        marginRight: 14,
    },
    logoContainer: {
        position: 'relative',
    },
    logo: {
        width: 90,
        height: 90,
        borderRadius: 18,
        borderWidth: 4,
        borderColor: '#fff',
        backgroundColor: '#f0f0f0',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#8b5cf6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    verifiedIcon: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    organizationText: {
        fontSize: 12,
        color: '#8b5cf6',
        marginBottom: 6,
        textDecorationLine: 'underline',
    },
    infoContainer: {
        flex: 1,
        paddingTop: 50,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 2,
        flexWrap: 'wrap',
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#f3e8ff',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        fontSize: 12,
        color: '#8b5cf6',
        fontWeight: '600',
    },
    ratingSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
    },
    starsContainer: {
        flexDirection: 'row',
        marginRight: 6,
    },
    starFilled: {
        fontSize: 16,
        color: '#fbbf24',
    },
    starHalf: {
        fontSize: 16,
        color: '#fcd34d',
    },
    starEmpty: {
        fontSize: 16,
        color: '#d1d5db',
    },
    ratingText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1a1a1a',
        marginRight: 4,
    },
    reviewsText: {
        fontSize: 13,
        color: '#6b7280',
    },
    scheduleContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#f0fdf4',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginHorizontal: 16,
        marginBottom: 12,
    },
    scheduleContainerClosed: {
        backgroundColor: '#fef2f2',
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusOpen: {
        backgroundColor: '#22c55e',
    },
    statusClosed: {
        backgroundColor: '#ef4444',
    },
    statusText: {
        fontSize: 13,
        fontWeight: '600',
        marginRight: 8,
    },
    statusTextOpen: {
        color: '#166534',
    },
    statusTextClosed: {
        color: '#dc2626',
    },
    scheduleDivider: {
        fontSize: 10,
        color: '#9ca3af',
        marginRight: 8,
    },
    scheduleIcon: {
        fontSize: 12,
        marginRight: 4,
    },
    scheduleDetails: {
        flexDirection: 'column',
        flex: 1,
    },
    scheduleText: {
        fontSize: 12,
        color: '#166534',
        fontWeight: '500',
    },
    scheduleTextClosed: {
        color: '#991b1b',
    },
    description: {
        fontSize: 14,
        color: '#4b5563',
        lineHeight: 20,
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    actionIcon: {
        fontSize: 18,
        marginBottom: 4,
    },
    actionLabel: {
        fontSize: 11,
        color: '#fff',
        fontWeight: '600',
    },
});
