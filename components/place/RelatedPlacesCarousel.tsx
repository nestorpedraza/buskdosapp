import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface RelatedPlace {
    id: string;
    name: string;
    image: any;
    category?: string;
}

interface RelatedPlacesCarouselProps {
    places: RelatedPlace[];
    onPlacePress: (place: RelatedPlace) => void;
}

const RelatedPlacesCarousel: React.FC<RelatedPlacesCarouselProps> = ({ places, onPlacePress }) => {
    if (!places || places.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Otros lugares de la misma cuenta</Text>
            <FlatList
                data={places}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => onPlacePress(item)}>
                        <Image source={item.image} style={styles.image} />
                        <Text style={styles.placeName} numberOfLines={1}>{item.name}</Text>
                        {item.category && <Text style={styles.category}>{item.category}</Text>}
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 16,
        marginBottom: 8,
        color: '#222',
    },
    listContent: {
        paddingLeft: 12,
        paddingRight: 8,
    },
    card: {
        width: 120,
        marginRight: 12,
        marginTop: 2,
        marginBottom: 4,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
        alignItems: 'center',
    },
    image: {
        width: 120,
        height: 80,
        resizeMode: 'cover',
    },
    placeName: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 6,
        color: '#333',
        textAlign: 'center',
    },
    category: {
        fontSize: 12,
        color: '#888',
        marginBottom: 6,
        textAlign: 'center',
    },
});

export default RelatedPlacesCarousel;
