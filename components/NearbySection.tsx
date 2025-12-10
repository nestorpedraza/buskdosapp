import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { NEARBY_GRID_CONFIG, NearbyItem } from '../types/home.types';
import NearbyCard from './NearbyCard';

const NearbyGridList = Animated.FlatList<NearbyItem>;

interface NearbySectionProps {
    items: NearbyItem[];
    onItemPress?: (item: NearbyItem) => void;
}

export default function NearbySection({ items, onItemPress }: NearbySectionProps) {
    const handleItemPress = useCallback((item: NearbyItem) => {
        onItemPress?.(item);
    }, [onItemPress]);

    const renderItem = useCallback(({ item }: { item: NearbyItem }) => (
        <NearbyCard item={item} onPress={handleItemPress} />
    ), [handleItemPress]);

    const keyExtractor = useCallback((item: NearbyItem) => item.id, []);

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sitios Cercanos</Text>
            <NearbyGridList
                data={items}
                numColumns={NEARBY_GRID_CONFIG.NUM_COLUMNS}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.nearbyGridContainer}
                columnWrapperStyle={styles.nearbyColumnWrapper}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                removeClippedSubviews={true}
                maxToRenderPerBatch={6}
                initialNumToRender={6}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    nearbyGridContainer: {
        paddingBottom: 8,
    },
    nearbyColumnWrapper: {
        justifyContent: 'space-between',
    },
});
