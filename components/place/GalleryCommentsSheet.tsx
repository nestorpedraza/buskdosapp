import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Modal,
    TouchableOpacity,
    Pressable,
    Animated,
    Dimensions,
    Platform
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Comment {
    userName: string;
    text: string;
    timestamp: string;
}

interface GalleryCommentsSheetProps {
    visible: boolean;
    onClose: () => void;
    comments: Comment[];
}

export default function GalleryCommentsSheet({ visible, onClose, comments }: GalleryCommentsSheetProps) {
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: SCREEN_HEIGHT,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.overlayContainer}>
                {/* Backdrop - Click outside to close */}
                <Pressable style={styles.backdrop} onPress={onClose} />

                {/* Bottom Sheet */}
                <Animated.View
                    style={[
                        styles.sheetContainer,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Comentarios ({comments.length})</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeIcon}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {comments.length === 0 ? (
                            <Text style={styles.emptyText}>Sé el primero en comentar</Text>
                        ) : (
                            comments.map((c, idx) => (
                                <View key={idx} style={styles.commentRow}>
                                    <View style={styles.commentLeft}>
                                        <View style={styles.commentAvatarSmall}>
                                            <Text style={styles.avatarLetter}>{c.userName.charAt(0).toUpperCase()}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.commentRight}>
                                        <Text style={styles.commentName}>{c.userName}</Text>
                                        <Text style={styles.commentText}>{c.text}</Text>
                                        <Text style={styles.commentTime}>{c.timestamp}</Text>
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>

                    {/* Input area placeholder */}
                    <View style={styles.inputArea}>
                        <View style={styles.inputPlaceholder}>
                            <Text style={styles.inputTextPlaceholder}>Añadir un comentario...</Text>
                        </View>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlayContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        zIndex: 1000,
        elevation: 1000,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheetContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: SCREEN_HEIGHT * 0.7, // Occupy 70% of screen height
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 2000,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center title
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        position: 'relative',
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    closeButton: {
        position: 'absolute',
        right: 16,
        padding: 4,
    },
    closeIcon: {
        fontSize: 20,
        color: '#333',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 80,
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        marginTop: 40,
        fontSize: 14,
    },
    commentRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    commentLeft: {
        marginRight: 12,
    },
    commentAvatarSmall: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarLetter: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    commentRight: {
        flex: 1,
    },
    commentName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
    },
    commentText: {
        fontSize: 14,
        color: '#000',
        lineHeight: 20,
        marginBottom: 4,
    },
    commentTime: {
        fontSize: 12,
        color: '#999',
    },
    inputArea: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#fff',
        paddingBottom: Platform.OS === 'ios' ? 34 : 12, // Safe area for iPhone
    },
    inputPlaceholder: {
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    inputTextPlaceholder: {
        color: '#999',
        fontSize: 14,
    },
});
