import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useRef } from 'react';
import { Dimensions, FlatList, Image, ImageSourcePropType, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GalleryItem } from '../../types/place.types';
import GalleryCommentsSheet from './GalleryCommentsSheet';

const { width } = Dimensions.get('window');

interface GalleryViewerProps {
    visible: boolean;
    items: GalleryItem[];
    initialIndex: number;
    onClose: () => void;
    placeLogo?: ImageSourcePropType;
}

export default function GalleryViewer({ visible, items, initialIndex, onClose, placeLogo }: GalleryViewerProps) {
    const flatListRef = useRef<FlatList<GalleryItem>>(null);
    const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
    const commentsRef = useRef<ScrollView>(null);
    const [commentsVisible, setCommentsVisible] = React.useState(false);
    const playersRef = useRef<Record<string, any>>({});
    const autoPlayedRef = useRef<Set<string>>(new Set());
    const [activeId, setActiveId] = React.useState<string | null>(items[initialIndex]?.id ?? null);
    const [playSignalMap, setPlaySignalMap] = React.useState<Record<string, number>>({});
    const insets = useSafeAreaInsets();
    const [isFollowing, setIsFollowing] = React.useState(false);
    const [likedSet, setLikedSet] = React.useState<Set<string>>(new Set());
    const [likesMap, setLikesMap] = React.useState<Record<string, number>>({});
    const [favoriteSet, setFavoriteSet] = React.useState<Set<string>>(new Set());

    // Calculamos la altura real considerando el safe area
    const containerHeight = Dimensions.get('window').height - insets.top - insets.bottom;

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
        const idx = Math.round(offsetY / containerHeight);
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

    const FullscreenVideoComponent = ({
        source,
        itemId,
        isActive,
        playSignal,
        onRegister,
        onRequestPlay,
        height,
    }: {
        source: any;
        itemId: string;
        isActive: boolean;
        playSignal: number;
        onRegister: (id: string, player: any) => void;
        onRequestPlay: (id: string) => void;
        height: number;
    }) => {
        const [isPlaying, setIsPlaying] = React.useState(false);
        const [currentTime, setCurrentTime] = React.useState(0);
        const [duration, setDuration] = React.useState(0);
        const [barWidth, setBarWidth] = React.useState(0);
        const playerRef = useRef<any>(null);

        const player = useVideoPlayer(source, (p: any) => {
            playerRef.current = p;
            p.loop = false;
            p.muted = false;
            try {
                p.pause();
            } catch (e) {
                console.log('Initial pause error:', e);
            }
        });

        useEffect(() => {
            const id = setInterval(() => {
                try {
                    if (playerRef.current) {
                        const cur = playerRef.current?.currentTime ?? 0;
                        const dur = playerRef.current?.duration ?? 0;
                        setCurrentTime(cur);
                        setDuration(dur);
                    }
                } catch (e) {
                    // Player might be released
                }
            }, 250);
            return () => clearInterval(id);
        }, []);

        useEffect(() => {
            if (player) {
                onRegister(itemId, player);
            }
        }, [itemId, player, onRegister]);

        useEffect(() => {
            if (isActive && playSignal > 0) {
                try {
                    if (playerRef.current) {
                        playerRef.current.play();
                        setIsPlaying(true);
                    }
                } catch (e) {
                    console.log('Play error:', e);
                }
            }
        }, [isActive, playSignal]);

        const togglePlay = () => {
            try {
                if (!playerRef.current) return;

                if (isPlaying) {
                    playerRef.current.pause();
                    setIsPlaying(false);
                } else {
                    onRequestPlay(itemId);
                    playerRef.current.play();
                    setIsPlaying(true);
                }
            } catch (e) {
                console.log('Toggle play error:', e);
            }
        };

        const seekToPercent = (pct: number) => {
            try {
                if (!playerRef.current) return;
                const dur = playerRef.current?.duration ?? 0;
                if (dur > 0) {
                    const next = dur * pct;
                    playerRef.current.seekTo(next);
                    setCurrentTime(next);
                }
            } catch (e) {
                console.log('Seek error:', e);
            }
        };

        const progress = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
        const fmt = (s: number) => {
            const mm = Math.floor(s / 60);
            const ss = Math.floor(s % 60);
            return `${mm}:${String(ss).padStart(2, '0')}`;
        };

        if (!player) {
            return <View style={{ width, height, backgroundColor: '#000' }} />;
        }

        return (
            <View style={{ width, height }}>
                <VideoView
                    player={player}
                    style={styles.previewFullMedia}
                    allowsPictureInPicture={false}
                    contentFit="contain"
                    surfaceType={Platform.OS === 'android' ? 'textureView' : undefined}
                    pointerEvents="none"
                    nativeControls={false}
                />
                <View
                    style={[
                        styles.controlsOverlay,
                        { bottom: Math.max(16, insets.bottom + 16) + (commentsVisible ? 120 : 0) },
                    ]}
                    pointerEvents="box-none"
                >
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
    const FullscreenVideo = React.memo(FullscreenVideoComponent);

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay} pointerEvents="box-none">
                <FlatList
                    ref={flatListRef}
                    data={items}
                    pagingEnabled
                    initialScrollIndex={initialIndex}
                    getItemLayout={(_, index) => ({ length: containerHeight, offset: containerHeight * index, index })}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={[styles.imageContainer, { height: containerHeight }]} pointerEvents="box-none">
                            {item.type === 'video' ? (
                                <FullscreenVideo
                                    source={require('../../assets/videos/video.mp4')}
                                    itemId={item.id}
                                    isActive={activeId === item.id}
                                    playSignal={playSignalMap[item.id] ?? 0}
                                    onRegister={registerPlayer}
                                    onRequestPlay={requestPlay}
                                    height={containerHeight}
                                />
                            ) : (
                                <Image source={item.url} style={[styles.image, { height: containerHeight }]} resizeMode="cover" />
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
                    snapToInterval={containerHeight}
                    snapToAlignment="start"
                    disableIntervalMomentum={true}
                />

                {/* Barra superior con botón de regresar */}
                <View style={[styles.topBar, { top: insets.top + 10 }]} pointerEvents="auto">
                    <TouchableOpacity style={styles.backButton} onPress={onClose}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                </View>

                {/* Acciones laterales */}
                <View style={styles.actionsSidebar}>
                    {/* Avatar */}
                    <View style={styles.avatarContainer}>
                        <Image
                            source={placeLogo ?? require('../../assets/images/city.png')}
                            style={styles.avatarImage}
                        />
                        <TouchableOpacity
                            style={[styles.followButton, isFollowing && styles.followButtonActive]}
                            onPress={() => setIsFollowing(v => !v)}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.followIcon}>{isFollowing ? '✓' : '+'}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Like */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                            const id = currentItem?.id;
                            if (!id) return;
                            setLikedSet(prev => {
                                const ns = new Set(prev);
                                const isLiked = ns.has(id);
                                const base = typeof (likesMap[id]) === 'number' ? likesMap[id] : (currentItem?.likes ?? 0);
                                const nextCount = isLiked ? Math.max(0, base - 1) : base + 1;
                                setLikesMap(m => ({ ...m, [id]: nextCount }));
                                if (isLiked) {
                                    ns.delete(id);
                                } else {
                                    ns.add(id);
                                }
                                return ns;
                            });
                        }}
                        activeOpacity={0.85}
                    >
                        <View style={styles.iconCircle}>
                            <Text style={styles.actionIcon}>
                                {likedSet.has(currentItem?.id || '') ? '💜' : '❤️'}
                            </Text>
                        </View>
                        <Text style={styles.actionCount}>
                            {typeof likesMap[currentItem?.id || ''] === 'number'
                                ? likesMap[currentItem?.id || '']
                                : (currentItem?.likes ?? 0)}
                        </Text>
                    </TouchableOpacity>

                    {/* Comentarios */}
                    <TouchableOpacity style={styles.actionButton} onPress={() => setCommentsVisible(v => !v)}>
                        <View style={styles.iconCircle}>
                            <Text style={styles.actionIcon}>💬</Text>
                        </View>
                        <Text style={styles.actionCount}>{currentItem?.comments?.length ?? currentItem?.commentsCount ?? 0}</Text>
                    </TouchableOpacity>

                    {/* Favoritos */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                            const id = currentItem?.id;
                            if (!id) return;
                            setFavoriteSet(prev => {
                                const ns = new Set(prev);
                                if (ns.has(id)) {
                                    ns.delete(id);
                                } else {
                                    ns.add(id);
                                }
                                return ns;
                            });
                        }}
                        activeOpacity={0.85}
                    >
                        <View style={styles.iconCircle}>
                            <Text style={styles.actionIcon}>
                                {favoriteSet.has(currentItem?.id || '') ? '🌟' : '⭐'}
                            </Text>
                        </View>
                        <Text style={styles.actionCount}>
                            {favoriteSet.has(currentItem?.id || '') ? 'Agregado' : 'agregar a favoritos'}
                        </Text>
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

                <GalleryCommentsSheet
                    visible={commentsVisible}
                    onClose={() => setCommentsVisible(false)}
                    comments={comments}
                />
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width,
    },
    previewFullMedia: {
        width: '100%',
        height: '100%',
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
        left: 0,
        right: 0,
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        zIndex: 200,
        elevation: 1000,
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
        zIndex: 200,
        elevation: 1000,
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
    avatarImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#fff',
        backgroundColor: '#333',
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
    followButtonActive: {
        backgroundColor: '#22c55e',
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
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 4,
    },
    // Información inferior
    infoContainer: {
        position: 'absolute',
        left: 16,
        bottom: 160,
        right: 90,
        zIndex: 150,
        elevation: 500,
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
