import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { POPULAR_CAROUSEL_CONFIG, PopularItem } from '../types/home.types';
import PopularCard from './PopularCard';

const AnimatedPopularList = Animated.FlatList<PopularItem>;

interface PopularCarouselProps {
    title: string;
    items: PopularItem[];
    onItemPress?: (item: PopularItem) => void;
    onDetailPress?: (item: PopularItem) => void;
    onMapPress?: (item: PopularItem) => void;
}

export default function PopularCarousel({ title, items, onItemPress, onDetailPress, onMapPress }: PopularCarouselProps) {
    const listRef = React.useRef<Animated.FlatList<PopularItem>>(null);
    const scrollX = useSharedValue(0);

    const paginationCount = useMemo(() =>
        Math.min(items.length, 10),
        [items.length]
    );

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    const handleItemPress = useCallback((item: PopularItem) => {
        onItemPress?.(item);
    }, [onItemPress]);

    const renderItem = useCallback(({ item }: { item: PopularItem }) => (
        <PopularCard item={item} onPress={handleItemPress} onDetailPress={onDetailPress} onMapPress={onMapPress} />
    ), [handleItemPress, onDetailPress, onMapPress]);

    const keyExtractor = useCallback((item: PopularItem) => item.id, []);

    const PaginationDot = useCallback(({ index }: { index: number }) => {
        const animatedStyle = useAnimatedStyle(() => {
            const inputRange = [
                (index - 1) * POPULAR_CAROUSEL_CONFIG.SNAP_INTERVAL,
                index * POPULAR_CAROUSEL_CONFIG.SNAP_INTERVAL,
                (index + 1) * POPULAR_CAROUSEL_CONFIG.SNAP_INTERVAL,
            ];

            const width = interpolate(
                scrollX.value,
                inputRange,
                [8, 20, 8],
                Extrapolation.CLAMP
            );

            const opacity = interpolate(
                scrollX.value,
                inputRange,
                [0.3, 1, 0.3],
                Extrapolation.CLAMP
            );

            return {
                width,
                opacity,
            };
        });

        return (
            <Animated.View
                style={[styles.paginationDot, animatedStyle]}
            />
        );
    }, [scrollX]);

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <AnimatedPopularList
                ref={listRef}
                data={items}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={POPULAR_CAROUSEL_CONFIG.SNAP_INTERVAL}
                decelerationRate="fast"
                contentContainerStyle={styles.carouselContainer}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                removeClippedSubviews={true}
                maxToRenderPerBatch={5}
                windowSize={5}
                initialNumToRender={3}
                getItemLayout={(_, index) => ({
                    length: POPULAR_CAROUSEL_CONFIG.SNAP_INTERVAL,
                    offset: POPULAR_CAROUSEL_CONFIG.SNAP_INTERVAL * index,
                    index,
                })}
            />

            {/* Pagination Dots Animados */}
            <View style={styles.paginationContainer}>
                {Array.from({ length: paginationCount }).map((_, index) => (
                    <PaginationDot key={index} index={index} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 12,
        paddingTop: 28,
        paddingBottom: 24,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    carouselContainer: {
        paddingRight: POPULAR_CAROUSEL_CONFIG.CARD_MARGIN,
        paddingBottom: 16,
        paddingLeft: 0,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12,
    },
    paginationDot: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#9900ff',
        marginHorizontal: 4,
    },
});
