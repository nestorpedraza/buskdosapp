import React, { useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { PlaceReview } from '../../types/place.types';

interface PlaceCommentsProps {
    reviews: PlaceReview[];
    totalReviews: number;
    averageRating: number;
    onSubmitReview?: (rating: number, comment: string) => void;
    onLikeReview?: (reviewId: string) => void;
    onReplyReview?: (reviewId: string) => void;
}

export default function PlaceComments({
    reviews,
    totalReviews,
    averageRating,
    onSubmitReview,
    onLikeReview,
    onReplyReview,
}: PlaceCommentsProps) {
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [selectedRating, setSelectedRating] = useState(0);
    const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set());

    const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

    const handleLike = (reviewId: string) => {
        setLikedReviews(prev => {
            const newSet = new Set(prev);
            if (newSet.has(reviewId)) {
                newSet.delete(reviewId);
            } else {
                newSet.add(reviewId);
            }
            return newSet;
        });
        onLikeReview?.(reviewId);
    };

    const handleSubmit = () => {
        if (selectedRating > 0 && newComment.trim()) {
            onSubmitReview?.(selectedRating, newComment.trim());
            setNewComment('');
            setSelectedRating(0);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Ayer';
        if (diffDays < 7) return `Hace ${diffDays} días`;
        if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
        if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
        return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const renderStars = (rating: number, size: number = 14, interactive: boolean = false) => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        disabled={!interactive}
                        onPress={() => interactive && setSelectedRating(star)}
                        style={styles.starButton}
                    >
                        <Text style={[styles.star, { fontSize: size }]}>
                            {star <= rating ? '⭐' : '☆'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const getRatingDistribution = () => {
        const distribution = [0, 0, 0, 0, 0];
        reviews.forEach(review => {
            if (review.rating >= 1 && review.rating <= 5) {
                distribution[5 - review.rating]++;
            }
        });
        return distribution;
    };

    const ratingDistribution = getRatingDistribution();
    const maxCount = Math.max(...ratingDistribution, 1);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>💬 Comentarios y reseñas</Text>
                <Text style={styles.sectionSubtitle}>{totalReviews} opiniones</Text>
            </View>

            {/* Resumen de calificación */}
            <View style={styles.ratingSummary}>
                <View style={styles.ratingLeft}>
                    <Text style={styles.ratingBig}>{averageRating.toFixed(1)}</Text>
                    {renderStars(Math.round(averageRating), 16)}
                    <Text style={styles.ratingCount}>{totalReviews} reseñas</Text>
                </View>
                <View style={styles.ratingRight}>
                    {ratingDistribution.map((count, index) => (
                        <View key={5 - index} style={styles.ratingBar}>
                            <Text style={styles.ratingBarLabel}>{5 - index}</Text>
                            <View style={styles.ratingBarBg}>
                                <View
                                    style={[
                                        styles.ratingBarFill,
                                        { width: `${(count / maxCount) * 100}%` }
                                    ]}
                                />
                            </View>
                            <Text style={styles.ratingBarCount}>{count}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Formulario para nueva reseña */}
            <View style={styles.newReviewContainer}>
                <Text style={styles.newReviewTitle}>¿Qué te pareció?</Text>
                <View style={styles.ratingSelector}>
                    {renderStars(selectedRating, 28, true)}
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Escribe tu comentario..."
                        placeholderTextColor="#9ca3af"
                        value={newComment}
                        onChangeText={setNewComment}
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            (!selectedRating || !newComment.trim()) && styles.submitButtonDisabled
                        ]}
                        onPress={handleSubmit}
                        disabled={!selectedRating || !newComment.trim()}
                    >
                        <Text style={styles.submitButtonText}>Enviar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Lista de reseñas */}
            <View style={styles.reviewsList}>
                {displayedReviews.map((review) => (
                    <View key={review.id} style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                            <Image source={review.userAvatar} style={styles.avatar} />
                            <View style={styles.reviewHeaderInfo}>
                                <Text style={styles.userName}>{review.userName}</Text>
                                <View style={styles.reviewMeta}>
                                    {renderStars(review.rating, 12)}
                                    <Text style={styles.reviewDate}>
                                        {formatDate(review.date)}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <Text style={styles.reviewComment}>{review.comment}</Text>

                        <View style={styles.reviewActions}>
                            <TouchableOpacity
                                style={styles.reviewAction}
                                onPress={() => handleLike(review.id)}
                            >
                                <Text style={styles.reviewActionIcon}>
                                    {likedReviews.has(review.id) ? '❤️' : '🤍'}
                                </Text>
                                <Text style={styles.reviewActionText}>
                                    {review.likes + (likedReviews.has(review.id) ? 1 : 0)}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.reviewAction}
                                onPress={() => onReplyReview?.(review.id)}
                            >
                                <Text style={styles.reviewActionIcon}>💬</Text>
                                <Text style={styles.reviewActionText}>Responder</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>

            {/* Botón ver más */}
            {reviews.length > 3 && (
                <TouchableOpacity
                    style={styles.showMoreButton}
                    onPress={() => setShowAllReviews(!showAllReviews)}
                >
                    <Text style={styles.showMoreText}>
                        {showAllReviews ? 'Ver menos' : `Ver todas (${reviews.length})`}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
    },
    header: {
        paddingHorizontal: 16,
        marginBottom: 16,
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
    ratingSummary: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 20,
        backgroundColor: '#f9fafb',
        marginHorizontal: 16,
        borderRadius: 12,
        padding: 16,
    },
    ratingLeft: {
        alignItems: 'center',
        marginRight: 20,
        minWidth: 80,
    },
    ratingBig: {
        fontSize: 40,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    starsContainer: {
        flexDirection: 'row',
        marginVertical: 4,
    },
    starButton: {
        padding: 2,
    },
    star: {
        color: '#fbbf24',
    },
    ratingCount: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 4,
    },
    ratingRight: {
        flex: 1,
        justifyContent: 'center',
    },
    ratingBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    ratingBarLabel: {
        width: 16,
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'center',
    },
    ratingBarBg: {
        flex: 1,
        height: 8,
        backgroundColor: '#e5e7eb',
        borderRadius: 4,
        marginHorizontal: 8,
        overflow: 'hidden',
    },
    ratingBarFill: {
        height: '100%',
        backgroundColor: '#8b5cf6',
        borderRadius: 4,
    },
    ratingBarCount: {
        width: 24,
        fontSize: 11,
        color: '#9ca3af',
        textAlign: 'right',
    },
    newReviewContainer: {
        marginHorizontal: 16,
        marginBottom: 20,
        padding: 16,
        backgroundColor: '#faf5ff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9d5ff',
    },
    newReviewTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 8,
        textAlign: 'center',
    },
    ratingSelector: {
        alignItems: 'center',
        marginBottom: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        color: '#1a1a1a',
        minHeight: 44,
        maxHeight: 100,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    submitButton: {
        backgroundColor: '#8b5cf6',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
    },
    submitButtonDisabled: {
        backgroundColor: '#d1d5db',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    reviewsList: {
        paddingHorizontal: 16,
    },
    reviewCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    reviewHeader: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    reviewHeaderInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 2,
    },
    reviewMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviewDate: {
        fontSize: 11,
        color: '#9ca3af',
        marginLeft: 8,
    },
    reviewComment: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
        marginBottom: 10,
    },
    reviewActions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        paddingTop: 10,
        gap: 20,
    },
    reviewAction: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviewActionIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    reviewActionText: {
        fontSize: 12,
        color: '#6b7280',
    },
    showMoreButton: {
        marginHorizontal: 16,
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 10,
    },
    showMoreText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8b5cf6',
    },
});
