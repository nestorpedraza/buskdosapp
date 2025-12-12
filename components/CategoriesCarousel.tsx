import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { CAROUSEL_CONFIG, Category, SubCategory } from '../types/home.types';
import CategoryItem from './CategoryItem';

const AnimatedCategoryList = Animated.FlatList<Category>;

interface CategoriesCarouselProps {
    categories: Category[];
    onCategoryPress?: (item: Category) => void;
    onSubcategoryPress?: (category: Category, subcategory: SubCategory) => void;
}

export default function CategoriesCarousel({ categories, onCategoryPress, onSubcategoryPress }: CategoriesCarouselProps) {
    const categoryListRef = React.useRef<Animated.FlatList<Category>>(null);
    const categoryScrollX = useSharedValue(0);

    const categoryPaginationCount = useMemo(() =>
        Math.min(categories.length, 10),
        [categories.length]
    );

    const categoryScrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            categoryScrollX.value = event.contentOffset.x;
        },
    });

    const handleCategoryPress = useCallback((item: Category) => {
        onCategoryPress?.(item);
    }, [onCategoryPress]);

    const handleSubcategoryPress = useCallback((category: Category, subcategory: SubCategory) => {
        onSubcategoryPress?.(category, subcategory);
    }, [onSubcategoryPress]);

    const renderCategoryItem = useCallback(({ item }: { item: Category }) => (
        <CategoryItem
            item={item}
            onPress={handleCategoryPress}
            onSubcategoryPress={handleSubcategoryPress}
        />
    ), [handleCategoryPress, handleSubcategoryPress]);

    const categoryKeyExtractor = useCallback((item: Category) => item.id, []);

    const CategoryPaginationDot = useCallback(({ index }: { index: number }) => {
        const animatedStyle = useAnimatedStyle(() => {
            const inputRange = [
                (index - 1) * CAROUSEL_CONFIG.SNAP_INTERVAL,
                index * CAROUSEL_CONFIG.SNAP_INTERVAL,
                (index + 1) * CAROUSEL_CONFIG.SNAP_INTERVAL,
            ];

            const width = interpolate(
                categoryScrollX.value,
                inputRange,
                [8, 20, 8],
                Extrapolation.CLAMP
            );

            const opacity = interpolate(
                categoryScrollX.value,
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
    }, [categoryScrollX]);

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categorías</Text>
            <AnimatedCategoryList
                ref={categoryListRef}
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CAROUSEL_CONFIG.SNAP_INTERVAL}
                decelerationRate="fast"
                contentContainerStyle={styles.categoryCarouselContainer}
                onScroll={categoryScrollHandler}
                scrollEventThrottle={16}
                renderItem={renderCategoryItem}
                keyExtractor={categoryKeyExtractor}
                removeClippedSubviews={false}
                maxToRenderPerBatch={5}
                windowSize={5}
                initialNumToRender={4}
                getItemLayout={(_, index) => ({
                    length: CAROUSEL_CONFIG.SNAP_INTERVAL,
                    offset: CAROUSEL_CONFIG.SNAP_INTERVAL * index,
                    index,
                })}
            />

            {/* Pagination Dots Animados */}
            <View style={styles.paginationContainer}>
                {Array.from({ length: categoryPaginationCount }).map((_, index) => (
                    <CategoryPaginationDot key={index} index={index} />
                ))}
            </View>
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
    categoryCarouselContainer: {
        paddingRight: CAROUSEL_CONFIG.CARD_WIDTH / 2,
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
