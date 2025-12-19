import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

interface LikedItem {
    id: string;
    tag: string;
    title: string;
    subtitle: string;
    price: string;
    rating: number;
    reviews: number;
    image: any;
    distance: string;
}

interface Props {
    item: LikedItem;
    onUnlike: (id: string) => void;
}

export default function LikedCard({ item, onUnlike }: Props) {
    return (
        <View style={styles.card}>
            <Image source={item.image} style={styles.cardImage} />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.cardGradient}
            />
            <Pressable
                style={styles.likeButton}
                onPress={() => onUnlike(item.id)}
            >
                <Text style={styles.likeIcon}>❤️</Text>
            </Pressable>
            <View style={styles.cardContent}>
                <View style={styles.tagContainer}>
                    <Text style={styles.tag}>{item.tag}</Text>
                </View>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cardSubtitle} numberOfLines={1}>{item.subtitle}</Text>
                <View style={styles.cardFooter}>
                    <Text style={styles.rating}>⭐ {item.rating}</Text>
                    <Text style={styles.distance}>📍 {item.distance}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: 200,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '70%',
    },
    likeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    likeIcon: {
        fontSize: 16,
    },
    cardContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
    },
    tagContainer: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(153, 0, 255, 0.8)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        marginBottom: 5,
    },
    tag: {
        fontSize: 9,
        color: '#fff',
        fontWeight: '600',
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    cardSubtitle: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
    },
    rating: {
        fontSize: 11,
        color: '#fff',
        fontWeight: '600',
    },
    distance: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.8)',
    },
});
