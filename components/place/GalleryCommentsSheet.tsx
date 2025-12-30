import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Comment {
    userName: string;
    text: string;
    timestamp: string;
    id?: string;
    replies?: Comment[];
}

interface GalleryCommentsSheetProps {
    visible: boolean;
    onClose: () => void;
    comments: Comment[];
    onAddComment?: (comment: Comment) => void;
}

export default function GalleryCommentsSheet({ visible, onClose, comments, onAddComment }: GalleryCommentsSheetProps) {
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const [localComments, setLocalComments] = useState<Comment[]>(comments || []);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState<{ id: string; userName: string } | null>(null);

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
            setLocalComments(
                (comments || []).map((c, idx) => ({
                    ...c,
                    id: c.id ?? `c-${idx}`,
                    replies: c.replies ?? [],
                }))
            );
        } else {
            Animated.timing(slideAnim, {
                toValue: SCREEN_HEIGHT,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, slideAnim, comments]);

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.overlayContainer}>
                <Pressable style={styles.backdrop} onPress={onClose} />

                <Animated.View
                    style={[
                        styles.sheetContainer,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Comentarios ({localComments.length})</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeIcon}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {localComments.length === 0 ? (
                            <Text style={styles.emptyText}>Sé el primero en comentar</Text>
                        ) : (
                            localComments.map((c, idx) => (
                                <View key={c.id ?? idx} style={styles.commentBlock}>
                                    <View style={styles.commentRow}>
                                        <View style={styles.commentLeft}>
                                            <View style={styles.commentAvatarSmall}>
                                                <Text style={styles.avatarLetter}>{c.userName.charAt(0).toUpperCase()}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.commentRight}>
                                            <Text style={styles.commentName}>{c.userName}</Text>
                                            <Text style={styles.commentText}>{c.text}</Text>
                                            <Text style={styles.commentTime}>{c.timestamp}</Text>
                                            <View style={styles.commentActions}>
                                                <TouchableOpacity
                                                    onPress={() => setReplyTo({ id: c.id ?? `c-${idx}`, userName: c.userName })}
                                                    disabled={c.userName === 'Tú'}
                                                >
                                                    <Text style={[styles.replyAction, c.userName === 'Tú' && styles.replyActionDisabled]}>
                                                        Responder
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                    {(c.replies ?? []).map((r, rIdx) => (
                                        <View key={`${c.id ?? idx}-r-${rIdx}`} style={styles.replyRow}>
                                            <View style={styles.replyLeft}>
                                                <View style={styles.replyAvatarSmall}>
                                                    <Text style={styles.replyAvatarLetter}>{r.userName.charAt(0).toUpperCase()}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.replyRight}>
                                                <Text style={styles.replyName}>{r.userName}</Text>
                                                <Text style={styles.replyText}>{r.text}</Text>
                                                <Text style={styles.replyTime}>{r.timestamp}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            ))
                        )}
                    </ScrollView>

                    <View style={styles.inputArea}>
                        {replyTo ? (
                            <View style={styles.replyBanner}>
                                <Text style={styles.replyBannerText}>Respondiendo a @{replyTo.userName}</Text>
                                <TouchableOpacity onPress={() => setReplyTo(null)}>
                                    <Text style={styles.replyBannerCancel}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        ) : null}
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                placeholder="Añadir un comentario..."
                                placeholderTextColor="#999"
                                value={newComment}
                                onChangeText={setNewComment}
                                multiline
                                maxLength={500}
                            />
                            <TouchableOpacity
                                style={[styles.submitButton, !newComment.trim() && styles.submitButtonDisabled]}
                                disabled={!newComment.trim()}
                                onPress={() => {
                                    const text = newComment.trim();
                                    if (!text) return;
                                    if (replyTo) {
                                        setLocalComments(prev =>
                                            prev.map(c => {
                                                if ((c.id ?? '') === replyTo.id) {
                                                    const reply: Comment = {
                                                        userName: 'Tú',
                                                        text,
                                                        timestamp: 'Ahora',
                                                    };
                                                    return { ...c, replies: [reply, ...(c.replies ?? [])] };
                                                }
                                                return c;
                                            })
                                        );
                                        setNewComment('');
                                        setReplyTo(null);
                                    } else {
                                        const comment: Comment = {
                                            userName: 'Tú',
                                            text,
                                            timestamp: 'Ahora',
                                        };
                                        setLocalComments(prev => [comment, ...prev]);
                                        setNewComment('');
                                        onAddComment?.(comment);
                                    }
                                }}
                            >
                                <Text style={styles.submitButtonText}>Enviar</Text>
                            </TouchableOpacity>
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
        height: SCREEN_HEIGHT * 0.7,
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
        justifyContent: 'center',
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
    commentBlock: {
        marginBottom: 14,
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
    commentActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 6,
    },
    replyAction: {
        color: '#2563eb',
        fontSize: 12,
        fontWeight: '700',
    },
    replyActionDisabled: {
        color: '#9ca3af',
    },
    replyRow: {
        flexDirection: 'row',
        marginTop: 8,
        marginLeft: 44,
    },
    replyLeft: {
        marginRight: 10,
    },
    replyAvatarSmall: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#e5e7eb',
        justifyContent: 'center',
        alignItems: 'center',
    },
    replyAvatarLetter: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6b7280',
    },
    replyRight: {
        flex: 1,
    },
    replyName: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6b7280',
        marginBottom: 2,
    },
    replyText: {
        fontSize: 13,
        color: '#111827',
        lineHeight: 18,
        marginBottom: 2,
    },
    replyTime: {
        fontSize: 11,
        color: '#9ca3af',
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
        paddingBottom: Platform.OS === 'ios' ? 34 : 12,
    },
    replyBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#eef2ff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 8,
    },
    replyBannerText: {
        color: '#1f2937',
        fontSize: 12,
        fontWeight: '600',
    },
    replyBannerCancel: {
        color: '#ef4444',
        fontSize: 12,
        fontWeight: '700',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
    },
    input: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        color: '#000',
        minHeight: 40,
        maxHeight: 100,
    },
    submitButton: {
        backgroundColor: '#111827',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
    },
    submitButtonDisabled: {
        backgroundColor: '#9ca3af',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: '700',
    },
});
