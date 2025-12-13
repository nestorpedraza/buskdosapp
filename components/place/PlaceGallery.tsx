import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Linking,
    Modal,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { GalleryItem } from '../../types/place.types';
import GalleryViewer from './GalleryViewer';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ITEM_SIZE = (SCREEN_WIDTH - 48) / 3;

interface PlaceGalleryProps {
    items: GalleryItem[];
    onItemPress?: (item: GalleryItem) => void;
}

export default function PlaceGallery({ items, onItemPress }: PlaceGalleryProps) {
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const [viewerVisible, setViewerVisible] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
    const [favoriteItems, setFavoriteItems] = useState<Set<string>>(new Set());

    const handleItemPress = (item: GalleryItem) => {
        setSelectedItem(item);
        setViewerIndex(items.findIndex(i => i.id === item.id));
        setViewerVisible(true);
        onItemPress?.(item);
    };

    const handleLike = (itemId: string) => {
        setLikedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const handleFavorite = (itemId: string) => {
        setFavoriteItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const handleShare = async (platform?: string) => {
        if (!selectedItem) return;

        const message = `¡Mira esto en Buskados! ${selectedItem.description || ''}`;

        if (platform) {
            let url = '';
            switch (platform) {
                case 'whatsapp':
                    url = `whatsapp://send?text=${encodeURIComponent(message)}`;
                    break;
                case 'instagram':
                    url = 'instagram://camera';
                    break;
                case 'facebook':
                    url = `fb://share?quote=${encodeURIComponent(message)}`;
                    break;
                case 'twitter':
                    url = `twitter://post?message=${encodeURIComponent(message)}`;
                    break;
                case 'tiktok':
                    url = 'tiktok://';
                    break;
                case 'telegram':
                    url = `tg://msg?text=${encodeURIComponent(message)}`;
                    break;
            }

            try {
                const canOpen = await Linking.canOpenURL(url);
                if (canOpen) {
                    await Linking.openURL(url);
                }
            } catch (error) {
                console.log('Error opening app:', error);
            }
        } else {
            try {
                await Share.share({ message });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        }

        setShowShareMenu(false);
    };

    const renderGalleryItem = ({ item }: { item: GalleryItem }) => (
        <TouchableOpacity
            style={styles.gridItem}
            onPress={() => handleItemPress(item)}
            activeOpacity={0.8}
        >
            <Image source={item.url} style={styles.gridImage} />
            {item.type === 'video' && (
                <View style={styles.videoIndicatorCentered}>
                    <View style={styles.videoIndicatorCircle}>
                        <Text style={styles.videoIcon}>▶</Text>
                    </View>
                </View>
            )}
            <View style={styles.gridStats}>
                <Text style={styles.gridStatText}>❤️ {item.likes}</Text>
            </View>
        </TouchableOpacity>
    );

    const shareOptions = [
        { id: 'whatsapp', icon: '📱', label: 'WhatsApp', color: '#25D366' },
        { id: 'instagram', icon: '📷', label: 'Instagram', color: '#E4405F' },
        { id: 'facebook', icon: '👤', label: 'Facebook', color: '#1877F2' },
        { id: 'twitter', icon: '🐦', label: 'X', color: '#000000' },
        { id: 'tiktok', icon: '🎵', label: 'TikTok', color: '#000000' },
        { id: 'telegram', icon: '✈️', label: 'Telegram', color: '#0088cc' },
        { id: 'copy', icon: '🔗', label: 'Copiar enlace', color: '#6b7280' },
        { id: 'more', icon: '•••', label: 'Más opciones', color: '#6b7280' },
    ];


    // Agrupar los ítems en páginas de 9 (3x3)
    const chunkedItems: GalleryItem[][] = [];
    for (let i = 0; i < items.length; i += 9) {
        chunkedItems.push(items.slice(i, i + 9));
    }

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Galería</Text>
            <Text style={styles.sectionSubtitle}>Productos, servicios y más</Text>

            <FlatList
                data={chunkedItems}
                renderItem={({ item, index: pageIdx }) => (
                    <View style={{ width: SCREEN_WIDTH - 32, marginRight: 16 }} key={`gallery-page-${pageIdx}`}>
                        {[0, 1, 2].map(rowIdx => {
                            const rowItems = item.slice(rowIdx * 3, rowIdx * 3 + 3);
                            if (rowItems.length === 0) return null;
                            return (
                                <View style={styles.carouselRow} key={`gallery-row-${pageIdx}-${rowIdx}`}>
                                    {rowItems.map((galleryItem, colIdx) => (
                                        <View
                                            key={galleryItem.id}
                                            style={{ marginRight: colIdx < 2 ? 8 : 0 }}
                                        >
                                            {renderGalleryItem({ item: galleryItem })}
                                        </View>
                                    ))}
                                </View>
                            );
                        })}
                    </View>
                )}
                keyExtractor={(_, idx) => `gallery-page-${idx}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carouselContainer}
                snapToInterval={SCREEN_WIDTH - 32}
                decelerationRate="fast"
                pagingEnabled
            />

            {/* GalleryViewer tipo TikTok */}
            <GalleryViewer
                visible={viewerVisible}
                items={items}
                initialIndex={viewerIndex}
                onClose={() => setViewerVisible(false)}
            />

            {/* Modal de compartir */}
            <Modal
                visible={showShareMenu}
                transparent
                animationType="slide"
                onRequestClose={() => setShowShareMenu(false)}
            >
                <TouchableOpacity
                    style={styles.shareOverlay}
                    activeOpacity={1}
                    onPress={() => setShowShareMenu(false)}
                >
                    <View style={styles.shareMenu}>
                        <View style={styles.shareHandle} />
                        <Text style={styles.shareTitle}>Compartir en</Text>

                        <View style={styles.shareGrid}>
                            {shareOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={styles.shareOption}
                                    onPress={() => handleShare(option.id === 'more' ? undefined : option.id)}
                                >
                                    <View style={[styles.shareIconContainer, { backgroundColor: option.color + '20' }]}>
                                        <Text style={styles.shareIcon}>{option.icon}</Text>
                                    </View>
                                    <Text style={styles.shareLabel}>{option.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setShowShareMenu(false)}
                        >
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingVertical: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
        paddingHorizontal: 16,
    },
    sectionSubtitle: {
        fontSize: 13,
        color: '#6b7280',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    carouselContainer: {
        paddingHorizontal: 16,
    },
    carouselRow: {
        flexDirection: 'row',
        width: SCREEN_WIDTH - 32,
        justifyContent: 'space-between',
    },
    gridItem: {
        width: ITEM_SIZE,
        height: ITEM_SIZE * 1.3,
        // El margen derecho ahora se maneja en el contenedor de la columna
        marginBottom: 8,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },
    videoIndicatorCentered: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoIndicatorCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoIcon: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
    gridStats: {
        position: 'absolute',
        bottom: 8,
        left: 8,
    },
    gridStatText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    modalClose: {
        position: 'absolute',
        top: 50,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    modalCloseIcon: {
        color: '#fff',
        fontSize: 18,
    },
    modalContent: {
        flex: 1,
        justifyContent: 'center',
    },
    modalImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.7,
    },
    actionsSidebar: {
        position: 'absolute',
        right: 12,
        bottom: 120,
        alignItems: 'center',
    },
    actionButton: {
        alignItems: 'center',
        marginBottom: 20,
    },
    actionIcon: {
        fontSize: 28,
    },
    likedIcon: {
        transform: [{ scale: 1.1 }],
    },
    favoriteIcon: {
        color: '#fbbf24',
    },
    actionCount: {
        color: '#fff',
        fontSize: 12,
        marginTop: 4,
    },
    descriptionContainer: {
        position: 'absolute',
        bottom: 40,
        left: 16,
        right: 80,
    },
    descriptionText: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 20,
    },
    shareOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    shareMenu: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 34,
    },
    shareHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#d1d5db',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 16,
    },
    shareTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 20,
    },
    shareGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
    },
    shareOption: {
        width: '25%',
        alignItems: 'center',
        marginBottom: 20,
    },
    shareIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    shareIcon: {
        fontSize: 24,
    },
    shareLabel: {
        fontSize: 12,
        color: '#4b5563',
    },
    cancelButton: {
        marginTop: 8,
        marginHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6b7280',
    },
});
