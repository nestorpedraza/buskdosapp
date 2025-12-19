import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface TabBarProps {
    activeRoute?: string;
}

export default function TabBar({ activeRoute = '/home' }: TabBarProps) {
    const router = useRouter();
    const getGradientColors = (): readonly [string, string] => {
        switch (activeRoute) {
            case '/home': return ['#9900ff', '#ff00f774'] as const;
            case '/likes': return ['#ff0080', '#ff4d946f'] as const;
            case '/map': return ['#0048ff85', '#1e00ff62'] as const;
            case '/chats': return ['#00c2ff', '#0066ff7b'] as const;
            case '/profile': return ['#c0c0c0ff', '#3d3d3d7b'] as const;
            case '/nav': return ['#ff00519d', '#ffa2008f'] as const;
            default: return ['#9900ff', '#c300ff5b'] as const;
        }
    };
    const allTabs = [
        { route: '/home', icon: '🏠', label: 'Inicio', path: '/home' as const },
        { route: '/nav', icon: '🧭', label: 'Explorar', path: '/nav' as const },
        { route: '/map', icon: '📍', label: 'Mapa', path: '/map' as const },
        { route: '/likes', icon: '❤️', label: 'Favoritos', path: '/likes' as const },
        { route: '/chats', icon: '💬', label: 'Mensajes', path: '/chats' as const },
        { route: '/profile', icon: '👤', label: 'Perfil', path: '/profile' as const },
    ];
    return (
        <View style={styles.tabBar}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {allTabs.map((tab) => {
                    const isActive = tab.route === activeRoute;
                    return (
                        <Pressable
                            key={tab.route}
                            style={styles.tabItem}
                            onPress={() => router.push(tab.path)}
                        >
                            <View style={styles.iconWrapper}>
                                {isActive ? (
                                    <LinearGradient
                                        colors={getGradientColors()}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.activeIconBg}
                                    >
                                        <Text style={styles.tabIconActive}>{tab.icon}</Text>
                                    </LinearGradient>
                                ) : (
                                    <Text style={styles.tabIcon}>{tab.icon}</Text>
                                )}
                            </View>
                            <Text style={isActive ? styles.tabTextActive : styles.tabText}>{tab.label}</Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingBottom: Platform.OS === 'ios' ? 16 : 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignItems: 'center',
        justifyContent: 'flex-start',
        zIndex: 50,
        elevation: 0,
    },
    scrollContent: {
        paddingHorizontal: 12,
        alignItems: 'center',
        gap: 12,
    },
    tabItem: {
        alignItems: 'center',
        minWidth: 72,
    },
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeIconBg: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#9900ff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    tabIcon: {
        fontSize: 20,
        marginBottom: 4,
        opacity: 0.5,
    },
    tabIconActive: {
        fontSize: 20,
        marginBottom: 0,
        color: '#fff',
        opacity: 1,
    },
    tabText: {
        fontSize: 10,
        color: '#999',
    },
    tabTextActive: {
        fontSize: 10,
        color: '#333',
        fontWeight: '600',
    },
})
