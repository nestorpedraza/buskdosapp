import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

interface TabBarProps {
    activeRoute?: string;
}

export default function TabBar({ activeRoute = '/' }: TabBarProps) {
    const router = useRouter();
    const getGradientColors = (): readonly [string, string] => {
        switch (activeRoute) {
            case '/home':
                return ['#9900ff', '#ff00f774'] as const;
            case '/likes':
                return ['#ff0080', '#ff4d946f'] as const;
            case '/map':
                return ['#0048ff85', '#1e00ff62'] as const;
            case '/nav':
                return ['#ff00519d', '#ffa2008f'] as const;
            case '/profile':
                return ['#c0c0c0ff', '#3d3d3d7b'] as const;
            case '/chats':
                return ['#00c2ff', '#0066ff7b'] as const;
            default:
                return ['#9900ff', '#c300ff5b'] as const;
        }
    };
    const allTabs = [
        { route: '/home', icon: '🏠', label: 'Home', path: '/home' as const },
        { route: '/likes', icon: '❤️', label: 'Likes', path: '/likes' as const },
        { route: '/map', icon: '📍', label: 'Map', path: '/map' as const },
        { route: '/chats', icon: '💬', label: 'Chats', path: '/chats' as const },
        { route: '/profile', icon: '👤', label: 'Profile', path: '/profile' as const },
        { route: '/nav', icon: '🧭', label: 'Nav', path: '/nav' as const },
    ];
    const displayOrderRoutes: readonly string[] = ['/likes', '/map', '/chats', '/profile', '/nav'];
    const orderedInactive = displayOrderRoutes
        .map(r => allTabs.find(t => t.route === r)!)
        .filter(t => t.route !== activeRoute);
    const leftTabs = orderedInactive.slice(0, 2);
    const rightTabs = orderedInactive.slice(2, 4);
    return (
        <View style={styles.tabBar}>
            {leftTabs.map((tab) => (
                <Pressable key={tab.route} style={styles.tabItem} onPress={() => router.push(tab.path)}>
                    <Text style={styles.tabIcon}>{tab.icon}</Text>
                    <Text style={styles.tabText}>{tab.label}</Text>
                </Pressable>
            ))}
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
                        {activeRoute === '/chats' && '💬'}
                        {activeRoute === '/profile' && '👤'}
                    </Text>
                </LinearGradient>
            </Pressable>
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
        paddingBottom: Platform.OS === 'ios' ? 16 : 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 50,
        elevation: 0,
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
    tabText: {
        fontSize: 11,
        color: '#999',
    },
})
