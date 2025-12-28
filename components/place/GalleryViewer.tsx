import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useRef } from 'react';
import { Dimensions, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    const commentsRef = useRef<ScrollView>(null);
    const [commentsVisible, setCommentsVisible] = React.useState(false);
    const playersRef = useRef<Record<string, any>>({});
    const autoPlayedRef = useRef<Set<string>>(new Set());
    const [activeId, setActiveId] = React.useState<string | null>(items[initialIndex]?.id ?? null);
    const [playSignalMap, setPlaySignalMap] = React.useState<Record<string, number>>({});

    useEffect(() => {
        if (visible && flatListRef.current) {
            setTimeout(() => {
                flatListRef.current?.scrollToIndex({ index: initialIndex, animated: false });
                setCurrentIndex(initialIndex);
            }, 100);
        }
    }, [visible, initialIndex]);

    useEffect(() => {
        commentsRef.current?.scrollTo({ y: 0, animated: false });
    }, [currentIndex]);
    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems && viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

    const currentItem = items[currentIndex] || items[0];

    const onScrollHandler = useRef((e: any) => {
        const offsetY = e?.nativeEvent?.contentOffset?.y || 0;
        const idx = Math.round(offsetY / height);
        if (idx >= 0 && idx < items.length) {
            setCurrentIndex(idx);
        }
    }).current;

    const comments = currentItem?.comments || [];

    const registerPlayer = (id: string, player: any) => {
        playersRef.current[id] = player;
    };

    const requestPlay = (id: string) => {
        // Pause and reset all other players
        Object.entries(playersRef.current).forEach(([pid, p]) => {
            if (pid !== id) {
                (p as any)?.pause?.();
                (p as any)?.seekTo?.(0);
            }
        });
        setActiveId(id);
    };

    useEffect(() => {
        const id = items[currentIndex]?.id;
        if (!id) return;
        // On item change, stop previous videos and reset audio
        Object.entries(playersRef.current).forEach(([pid, p]) => {
            if (pid !== id) {
                (p as any)?.pause?.();
                (p as any)?.seekTo?.(0);
            }
        });
        setActiveId(id);
        // Auto-play only the first time this item becomes active
        if (!autoPlayedRef.current.has(id)) {
            autoPlayedRef.current.add(id);
            setPlaySignalMap(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
        }
    }, [currentIndex, items]);

    const FullscreenVideo = ({
        uri,
        itemId,
        isActive,
        playSignal,
        onRegister,
        onRequestPlay,
    }: {
        uri: string;
        itemId: string;
        isActive: boolean;
        playSignal: number;
        onRegister: (id: string, player: any) => void;
        onRequestPlay: (id: string) => void;
    }) => {
        const initPlayer = React.useCallback((p: any) => {
            p.loop = false;
            p.pause();
        }, []);
        const player = useVideoPlayer(uri, initPlayer);
        const [isPlaying, setIsPlaying] = React.useState(false);
        const [currentTime, setCurrentTime] = React.useState(0);
        const [duration, setDuration] = React.useState(0);
        const [barWidth, setBarWidth] = React.useState(0);

        useEffect(() => {
            const id = setInterval(() => {
                const cur = (player as any)?.currentTime ?? 0;
                const dur = (player as any)?.duration ?? 0;
                setCurrentTime(cur);
                setDuration(dur);
            }, 250);
            return () => clearInterval(id);
        }, [player]);

        useEffect(() => {
            onRegister(itemId, player);
            return () => {
                // Deregister the player on unmount to avoid calling methods on a released instance
                if (playersRef.current[itemId] === player) {
                    delete playersRef.current[itemId];
                }
            };
        }, [itemId, player, onRegister]);

        useEffect(() => {
            if (isActive && playSignal > 0) {
                (player as any)?.play?.();
                setIsPlaying(true);
            }
        }, [isActive, playSignal, player]);

        const togglePlay = () => {
            if (isPlaying) {
                (player as any)?.pause?.();
                setIsPlaying(false);
            } else {
                onRequestPlay(itemId);
                (player as any)?.play?.();
                setIsPlaying(true);
            }
        };

        const seekToPercent = (pct: number) => {
            const dur = (player as any)?.duration ?? 0;
            if (dur > 0) {
                const next = dur * pct;
                (player as any)?.seekTo?.(next);
                setCurrentTime(next);
            }
        };

        const progress = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
        const fmt = (s: number) => {
            const mm = Math.floor(s / 60);
            const ss = Math.floor(s % 60);
            return `${mm}:${String(ss).padStart(2, '0')}`;
        };

        return (
            <View style={{ width, height }}>
                <VideoView
                    player={player}
                    style={styles.media}
                    allowsFullscreen={false}
                    allowsPictureInPicture={false}
                    contentFit="contain"
                />
                <View style={styles.controlsOverlay}>
                    <View style={styles.controlsRow}>
                        <TouchableOpacity style={styles.controlButton} onPress={togglePlay} activeOpacity={0.85}>
                            <Text style={styles.controlButtonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
                        </TouchableOpacity>
                        <Text style={styles.timeText}>
                            {fmt(currentTime)} / {fmt(duration)}
                        </Text>
                    </View>
                    <Pressable
                        style={styles.progressContainer}
                        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
                        onPress={(e) => {
                            const x = (e as any)?.nativeEvent?.locationX ?? 0;
                            if (barWidth > 0) {
                                seekToPercent(Math.min(1, Math.max(0, x / barWidth)));
                            }
                        }}
                    >
                        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                    </Pressable>
                </View>
            </View>
        );
    };

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
                        <View style={styles.imageContainer} pointerEvents="box-none">
                            {item.type === 'video' ? (
                                <FullscreenVideo
                                    uri={'https://www.w3schools.com/html/mov_bbb.mp4'}
                                    itemId={item.id}
                                    isActive={activeId === item.id}
                                    playSignal={playSignalMap[item.id] ?? 0}
                                    onRegister={registerPlayer}
                                    onRequestPlay={requestPlay}
                                />
                            ) : (
                                <Image source={item.url} style={styles.image} resizeMode="cover" />
                            )}
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                    horizontal={false}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewConfigRef.current}
                    onScroll={onScrollHandler}
                    scrollEventThrottle={16}
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
                    <TouchableOpacity style={styles.actionButton} onPress={() => setCommentsVisible(v => !v)}>
                        <View style={styles.iconCircle}>
                            <Text style={styles.actionIcon}>💬</Text>
                        </View>
                        <Text style={styles.actionCount}>{currentItem?.comments?.length ?? currentItem?.commentsCount ?? 0}</Text>
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

                {commentsVisible ? (
                    <View style={styles.commentsOverlay}>
                        <Text style={styles.commentsTitle}>Comentarios</Text>
                        <ScrollView ref={commentsRef} style={styles.commentsScroll} showsVerticalScrollIndicator={false}>
                            {comments.map((c: any, idx: number) => (
                                <View key={idx} style={styles.commentRow}>
                                    <View style={styles.commentLeft}>
                                        <View style={styles.commentAvatarSmall} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.commentNameSmall}>{c.userName}</Text>
                                        <Text style={styles.commentTextSmall}>{c.text}</Text>
                                        <Text style={styles.commentTextExtraSmall}>{c.timestamp}</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                ) : null}
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
    media: {
        width: width,
        height: height,
    },
    controlsOverlay: {
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 32,
        zIndex: 20,
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 10,
    },
    controlButton: {
        backgroundColor: 'rgba(64,64,64,0.7)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#fff',
    },
    controlButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    timeText: {
        color: '#fff',
        fontSize: 12,
        opacity: 0.8,
        fontWeight: '600',
    },
    progressContainer: {
        width: '100%',
        height: 6,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.25)',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#fff',
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
        bottom: 300,
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
    // Información inferior
    infoContainer: {
        position: 'absolute',
        left: 16,
        bottom: 160,
        right: 90,
        zIndex: 7,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 10,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
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
    commentsOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 10,
        overflow: 'hidden',
        zIndex: 7,
    },
    commentsTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 6,
    },
    commentsScroll: {
        maxHeight: 100,
    },
    commentRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    commentLeft: {
        marginRight: 8,
    },
    commentAvatarSmall: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#d1d5db',
    },
    commentNameSmall: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
    },
    commentTextSmall: {
        color: '#e5e7eb',
        fontSize: 12,
        lineHeight: 16,
    },
    commentTextExtraSmall: {
        color: '#e5e7eb',
        fontSize: 8,
        lineHeight: 16,
        fontWeight: '700',
    },
});
