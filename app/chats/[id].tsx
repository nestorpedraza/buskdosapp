import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import TabBar from '../../components/TabBar';

interface Message {
    id: string;
    fromMe: boolean;
    timestamp: number;
    kind: 'text' | 'image';
    text?: string;
    imageUri?: string;
    reported?: boolean;
}

export default function ChatDetailScreen() {
    const params = useLocalSearchParams<{ id: string; placeName?: string }>();
    const chatId = String(params.id || '');
    const [input, setInput] = useState('');
    const TABBAR_SPACE = Platform.OS === 'ios' ? 92 : 76;
    const initial = useMemo<Message[]>(() => {
        const now = Date.now();
        return [
            { id: 'm1', fromMe: false, kind: 'text', text: '¡Hola! 👋 ¿En qué puedo ayudarte hoy?', timestamp: now - 1000 * 60 * 30 },
            { id: 'm2', fromMe: true, kind: 'text', text: 'Hola, quería consultar si tienen promociones hoy.', timestamp: now - 1000 * 60 * 28 },
            { id: 'm3', fromMe: false, kind: 'text', text: 'Sí, tenemos 2x1 en algunos productos. ¿Te gustaría más información?', timestamp: now - 1000 * 60 * 26 },
            { id: 'm4', fromMe: true, kind: 'text', text: '¡Genial! ¿Cuáles productos aplican?', timestamp: now - 1000 * 60 * 25 },
            { id: 'm5', fromMe: false, kind: 'text', text: 'Aplica en panadería y pastelería. ¿Te envío la lista?', timestamp: now - 1000 * 60 * 24 },
            { id: 'm6', fromMe: true, kind: 'text', text: 'Sí, por favor.', timestamp: now - 1000 * 60 * 23 },
            { id: 'm7', fromMe: false, kind: 'image', imageUri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', timestamp: now - 1000 * 60 * 22 },
            { id: 'm8', fromMe: false, kind: 'text', text: 'Aquí tienes la lista de productos en promoción.', timestamp: now - 1000 * 60 * 22 },
            { id: 'm9', fromMe: true, kind: 'text', text: '¡Perfecto! ¿Hasta qué hora están abiertos hoy?', timestamp: now - 1000 * 60 * 21 },
            { id: 'm10', fromMe: false, kind: 'text', text: 'Hoy cerramos a las 9pm.', timestamp: now - 1000 * 60 * 20 },
            { id: 'm11', fromMe: true, kind: 'text', text: 'Gracias, pasaré más tarde.', timestamp: now - 1000 * 60 * 19 },
            { id: 'm12', fromMe: false, kind: 'text', text: '¡Te esperamos! 😊', timestamp: now - 1000 * 60 * 18 },
            { id: 'm13', fromMe: false, kind: 'text', text: '¿Te gustaría recibir nuestras ofertas por WhatsApp?', timestamp: now - 1000 * 60 * 17 },
            { id: 'm14', fromMe: true, kind: 'text', text: 'Sí, me interesa.', timestamp: now - 1000 * 60 * 16 },
            { id: 'm15', fromMe: false, kind: 'text', text: 'Perfecto, te agregaremos a la lista de difusión.', timestamp: now - 1000 * 60 * 15 },
            { id: 'm16', fromMe: true, kind: 'text', text: '¿Tienen opciones sin gluten?', timestamp: now - 1000 * 60 * 14 },
            { id: 'm17', fromMe: false, kind: 'text', text: 'Sí, contamos con pan y pasteles sin gluten.', timestamp: now - 1000 * 60 * 13 },
            { id: 'm18', fromMe: true, kind: 'text', text: '¿Me puedes enviar fotos?', timestamp: now - 1000 * 60 * 12 },
            { id: 'm19', fromMe: false, kind: 'image', imageUri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', timestamp: now - 1000 * 60 * 11 },
            { id: 'm20', fromMe: false, kind: 'text', text: 'Aquí tienes algunos de nuestros productos sin gluten.', timestamp: now - 1000 * 60 * 11 },
            { id: 'm21', fromMe: true, kind: 'text', text: '¡Se ven deliciosos! ¿Cuánto cuestan?', timestamp: now - 1000 * 60 * 10 },
            { id: 'm22', fromMe: false, kind: 'text', text: 'El pan sin gluten cuesta $50 y los pasteles $80.', timestamp: now - 1000 * 60 * 9 },
            { id: 'm23', fromMe: true, kind: 'text', text: '¿Puedo reservar para recoger más tarde?', timestamp: now - 1000 * 60 * 8 },
            { id: 'm24', fromMe: false, kind: 'text', text: '¡Por supuesto! ¿A qué hora pasarías?', timestamp: now - 1000 * 60 * 7 },
            { id: 'm25', fromMe: false, kind: 'image', imageUri: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca', timestamp: now - 1000 * 60 * 6 },
        ];
    }, []);
    const [messages, setMessages] = useState<Message[]>(initial);
    const [attachMode, setAttachMode] = useState(false);
    const [attachUrl, setAttachUrl] = useState('');
    const placeName = useMemo(() => {
        if (params.placeName) return String(params.placeName);
        switch (chatId) {
            case 'c1': return 'Boutique Fashion';
            case 'c2': return 'Pan del Día';
            case 'c3': return 'Sushi Bar';
            case 'c4': return 'Farma Salud';
            default: return 'Chat';
        }
    }, [chatId, params.placeName]);
    const avatar = useMemo(() => {
        return require('../../assets/images/city.png');
    }, [chatId]);
    const handleSend = () => {
        const text = input.trim();
        if (!text) return;
        const msg: Message = { id: 'm' + (messages.length + 1), fromMe: true, kind: 'text', text, timestamp: Date.now() };
        setMessages(prev => [...prev, msg]);
        setInput('');
    };
    const handleAttach = () => {
        setAttachMode(true);
    };
    const handleAddImage = () => {
        const url = attachUrl.trim();
        if (!url) return;
        const msg: Message = { id: 'm' + (messages.length + 1), fromMe: true, kind: 'image', imageUri: url, timestamp: Date.now() };
        setMessages(prev => [...prev, msg]);
        setAttachMode(false);
        setAttachUrl('');
    };
    const handleCancelAttach = () => {
        setAttachMode(false);
        setAttachUrl('');
    };
    const handleReport = (m: Message) => {
        Alert.alert('Reportar mensaje', '¿Deseas reportar este mensaje?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Reportar',
                style: 'destructive',
                onPress: () => setMessages(prev => prev.map(x => x.id === m.id ? { ...x, reported: true } : x)),
            },
        ]);
    };
    const renderItem = ({ item }: { item: Message }) => {
        return (
            <Pressable
                style={[styles.bubble, item.fromMe ? styles.bubbleMe : styles.bubbleOther]}
                onLongPress={() => handleReport(item)}
            >
                {item.kind === 'text' ? (
                    <Text style={[styles.bubbleText, item.fromMe ? styles.bubbleTextMe : styles.bubbleTextOther]}>{item.text}</Text>
                ) : (
                    <Image source={{ uri: item.imageUri! }} style={styles.imageBubble} />
                )}
                {item.reported && (
                    <Text style={styles.reportedTag}>Reportado</Text>
                )}
            </Pressable>
        );
    };
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.container, { paddingBottom: TABBAR_SPACE }]}>
                <Header />
                <View style={styles.titleBar}>
                    <View style={styles.titleRow}>
                        <Image source={avatar} style={styles.titleAvatar} />
                        <Text style={styles.title}>{placeName}</Text>
                    </View>
                </View>
                <View style={styles.chatArea}>
                    <FlatList
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={(m) => m.id}
                        contentContainerStyle={styles.listContent}
                    />
                </View>
                {attachMode && (
                    <View style={styles.attachBar}>
                        <TextInput
                            style={styles.attachInput}
                            placeholder="URL de imagen (https://...)"
                            placeholderTextColor="#9ca3af"
                            value={attachUrl}
                            onChangeText={setAttachUrl}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <Pressable style={[styles.sendBtn, styles.attachAction]} onPress={handleAddImage}>
                            <Text style={styles.sendText}>Adjuntar</Text>
                        </Pressable>
                        <Pressable style={[styles.attachBtn, styles.attachAction]} onPress={handleCancelAttach}>
                            <Text style={styles.attachText}>✖️</Text>
                        </Pressable>
                    </View>
                )}
                <View style={styles.inputBar}>
                    <TextInput
                        style={styles.input}
                        placeholder="Escribe un mensaje"
                        placeholderTextColor="#9ca3af"
                        value={input}
                        onChangeText={setInput}
                    />
                    <Pressable style={styles.sendBtn} onPress={handleSend}>
                        <Text style={styles.sendText}>Enviar</Text>
                    </Pressable>
                    <Pressable style={styles.attachBtn} onPress={handleAttach}>
                        <Text style={styles.attachText}>📎</Text>
                    </Pressable>
                </View>
                <TabBar activeRoute="/chats" />
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? 0 : 0,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    titleBar: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    titleAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    chatArea: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        paddingBottom: 120,
    },
    bubble: {
        maxWidth: '78%',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 8,
    },
    bubbleMe: {
        alignSelf: 'flex-end',
        backgroundColor: '#8b5cf6',
    },
    bubbleOther: {
        alignSelf: 'flex-start',
        backgroundColor: '#f3f4f6',
    },
    bubbleText: {
        fontSize: 14,
    },
    bubbleTextMe: {
        color: '#fff',
        fontWeight: '600',
    },
    bubbleTextOther: {
        color: '#1f2937',
    },
    imageBubble: {
        width: 220,
        height: 140,
        borderRadius: 12,
    },
    reportedTag: {
        marginTop: 6,
        fontSize: 10,
        color: '#ef4444',
        fontWeight: '700',
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        height: 42,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        paddingHorizontal: 12,
        fontSize: 14,
        color: '#111827',
        backgroundColor: '#fff',
    },
    sendBtn: {
        height: 42,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#9900ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    attachBtn: {
        height: 42,
        width: 42,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    attachText: {
        fontSize: 18,
    },
    attachBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fafafa',
    },
    attachInput: {
        flex: 1,
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        paddingHorizontal: 10,
        fontSize: 13,
        color: '#111827',
        backgroundColor: '#fff',
    },
    attachAction: {
        height: 40,
    },
});
