import React, { useEffect, useRef } from 'react';
import { Dimensions, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GalleryItem } from '../../types/place.types';

const { width, height } = Dimensions.get('window');

interface GalleryViewerProps {
    visible: boolean;
    items: GalleryItem[];
    initialIndex: number;
    onClose: () => void;
}

export default function GalleryViewer({ visible, items, initialIndex, onClose }: GalleryViewerProps) {
    const flatListRef = useRef<FlatList<GalleryItem>>(null);
    const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

    useEffect(() => {
        if (visible && flatListRef.current) {
            setTimeout(() => {
                flatListRef.current?.scrollToIndex({ index: initialIndex, animated: false });
                setCurrentIndex(initialIndex);
            }, 100);
        }
    }, [visible, initialIndex]);

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems && viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

    const currentItem = items[currentIndex] || items[0];

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <FlatList
                    ref={flatListRef}
                    data={items}
                    pagingEnabled
                    initialScrollIndex={initialIndex}
                    getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.imageContainer}>
                            <Image source={item.url} style={styles.image} resizeMode="cover" />
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                    horizontal={false}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewConfigRef.current}
                    decelerationRate="fast"
                    snapToInterval={height}
                    snapToAlignment="start"
                    disableIntervalMomentum={true}
                />

                {/* Barra superior con botón de regresar */}
                <View style={styles.topBar}>
                    <TouchableOpacity style={styles.backButton} onPress={onClose}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.topButton}>
                        <Text style={styles.topButtonText}>Following</Text>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.topButton}>
                        <Text style={[styles.topButtonText, styles.activeTab]}>For You</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.searchButton}>
                        <Text style={styles.searchIcon}>🔍</Text>
                    </TouchableOpacity>
                </View>

                {/* Acciones laterales */}
                <View style={styles.actionsSidebar}>
                    {/* Avatar */}
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>👤</Text>
                        </View>
                        <View style={styles.followButton}>
                            <Text style={styles.followIcon}>+</Text>
                        </View>
                    </View>

                    {/* Like */}
                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.iconCircle}>
                            <Text style={styles.actionIcon}>❤️</Text>
                        </View>
                        <Text style={styles.actionCount}>{currentItem?.likes ?? 208}</Text>
                    </TouchableOpacity>

                    {/* Comentarios */}
                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.iconCircle}>
                            <Text style={styles.actionIcon}>💬</Text>
                        </View>
                        <Text style={styles.actionCount}>{currentItem?.comments ?? 19}</Text>
                    </TouchableOpacity>

                    {/* Favoritos */}
                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.iconCircle}>
                            <Text style={styles.actionIcon}>⭐</Text>
                        </View>
                        <Text style={styles.actionCount}>Add favorite</Text>
                    </TouchableOpacity>

                    {/* Compartir */}
                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.iconCircle}>
                            <Text style={styles.actionIcon}>↗️</Text>
                        </View>
                        <Text style={styles.actionCount}>{currentItem?.shares ?? 82}</Text>
                    </TouchableOpacity>

                    {/* Disco giratorio */}
                    <TouchableOpacity style={styles.discContainer}>
                        <View style={styles.iconCircle}>
                            <Text style={styles.discIcon}>🎵</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Información inferior */}
                <View style={styles.infoContainer}>
                    <Text style={styles.username}>@username</Text>
                    <Text style={styles.description}>
                        {currentItem?.description || 'There are so many things I want to say to you'}
                    </Text>
                    <Text style={styles.caption}>#goon</Text>
                    <View style={styles.musicInfo}>
                        <Text style={styles.musicIcon}>🎵</Text>
                        <Text style={styles.musicText}>
                            original sound - username
                        </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#000',
    },
    imageContainer: {
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width,
        height: height,
    },
    // Barra superior
    topBar: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    topButton: {
        backgroundColor: 'rgba(64, 64, 64, 0.71)',
        paddingHorizontal: 16,
    },
    topButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
        opacity: 0.7,
    },
    activeTab: {
        opacity: 1,
        fontWeight: '700',
    },
    divider: {
        width: 1,
        height: 12,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    searchButton: {
        position: 'absolute',
        right: 20,
    },
    searchIcon: {
        fontSize: 20,
    },
    backButton: {
        position: 'absolute',
        left: 10,
        top: 0,
        zIndex: 20,
        width: 44,
        height: 44,
        backgroundColor: '#333',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        borderWidth: 2,
        borderColor: '#fff',
    },
    backIcon: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold',
    },
    // Acciones laterales
    actionsSidebar: {
        position: 'absolute',
        right: 12,
        bottom: 120,
        alignItems: 'center',
        zIndex: 5,
    },
    avatarContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    avatarText: {
        fontSize: 24,
    },
    followButton: {
        position: 'absolute',
        bottom: -6,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#FE2C55',
        justifyContent: 'center',
        alignItems: 'center',
    },
    followIcon: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    actionButton: {
        marginBottom: 20,
        alignItems: 'center',
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
        borderColor: '#fff',
        borderWidth: 2,
    },
    actionIcon: {
        fontSize: 26,
    },
    actionCount: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    discContainer: {
        marginTop: 10,
    },
    discIcon: {
        fontSize: 20,
    },
    // Información inferior
    infoContainer: {
        position: 'absolute',
        left: 16,
        bottom: 120,
        right: 90,
        zIndex: 5,
    },
    username: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        color: '#fff',
        fontSize: 15,
        lineHeight: 20,
        marginBottom: 4,
    },
    caption: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 8,
    },
    musicInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    musicIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    musicText: {
        color: '#fff',
        fontSize: 13,
        flex: 1,
    },
});