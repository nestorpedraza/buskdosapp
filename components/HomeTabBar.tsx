import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface HomeTabBarProps {
    activeRoute?: string;
}

export default function HomeTabBar({ activeRoute = '/' }: HomeTabBarProps) {
    const router = useRouter();

    // Definir colores de gradiente según la ruta activa
    const getGradientColors = (): readonly [string, string] => {
        switch (activeRoute) {
            case '/home':
                return ['#9900ff', '#ff00f774'] as const; // Home - Morado/Rosa
            case '/likes':
                return ['#ff0080', '#ff4d946f'] as const; // Likes - Rosa intenso
            case '/map':
                return ['#0048ff85', '#1e00ff62'] as const; // Map - Azul
            case '/nav':
                return ['#ff00519d', '#ffa2008f'] as const; // Nav - Naranja
            case '/profile':
                return ['#c0c0c0ff', '#3d3d3d7b'] as const; // Profile - Verde
            default:
                return ['#9900ff', '#c300ff5b'] as const;
        }
    };

    // Obtener los tabs inactivos
    const inactiveTabs = [
        { route: '/home', icon: '🏠', label: 'Home', path: '/home' as const },
        { route: '/likes', icon: '❤️', label: 'Likes', path: '/likes' as const },
        { route: '/map', icon: '📍', label: 'Map', path: '/map' as const },
        { route: '/nav', icon: '🧭', label: 'Nav', path: '/nav' as const },
        { route: '/profile', icon: '👤', label: 'Profile', path: '/profile' as const },
    ].filter(tab => tab.route !== activeRoute);

    // Dividir tabs: 2 a la izquierda, 2 a la derecha
    const leftTabs = inactiveTabs.slice(0, 2);
    const rightTabs = inactiveTabs.slice(2, 4);

    return (
        <View style={styles.tabBar}>
            {/* Tabs izquierda */}
            {leftTabs.map((tab) => (
                <Pressable key={tab.route} style={styles.tabItem} onPress={() => router.push(tab.path)}>
                    <Text style={styles.tabIcon}>{tab.icon}</Text>
                    <Text style={styles.tabText}>{tab.label}</Text>
                </Pressable>
            ))}

            {/* Tab central activo */}
            <Pressable style={styles.tabItemCenter} onPress={() => router.push('/home')}>
                <LinearGradient
                    colors={getGradientColors()}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.tabCenterButton}
                >
                    <Text style={styles.tabCenterIcon}>
                        {activeRoute === '/home' && '🏠'}
                        {activeRoute === '/likes' && '❤️'}
                        {activeRoute === '/map' && '📍'}
                        {activeRoute === '/nav' && '🧭'}
                        {activeRoute === '/profile' && '👤'}
                    </Text>
                </LinearGradient>
            </Pressable>

            {/* Tabs derecha */}
            {rightTabs.map((tab) => (
                <Pressable key={tab.route} style={styles.tabItem} onPress={() => router.push(tab.path)}>
                    <Text style={styles.tabIcon}>{tab.icon}</Text>
                    <Text style={styles.tabText}>{tab.label}</Text>
                </Pressable>
            ))}
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
        paddingBottom: 0,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    tabItem: {
        alignItems: 'center',
        flex: 1,
    },
    tabItemCenter: {
        alignItems: 'center',
        marginTop: -30,
    },
    tabCenterButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#9900ff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    tabCenterIcon: {
        fontSize: 24,
    },
    tabIcon: {
        fontSize: 22,
        marginBottom: 4,
        opacity: 0.5,
    },
    tabIconActive: {
        opacity: 1,
    },
    tabText: {
        fontSize: 11,
        color: '#999',
    },
    tabTextActive: {
        color: '#9900ff',
        fontWeight: '600',
    },
});
