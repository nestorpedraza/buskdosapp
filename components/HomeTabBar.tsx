import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeTabBar() {
    const router = useRouter();

    return (
        <View style={styles.tabBar}>
            <Pressable style={styles.tabItem}>
                <Text style={[styles.tabIcon, styles.tabIconActive]}>🏠</Text>
                <Text style={[styles.tabText, styles.tabTextActive]}>Home</Text>
            </Pressable>
            <Pressable style={styles.tabItem} onPress={() => router.push('/likes')}>
                <Text style={styles.tabIcon}>❤️</Text>
                <Text style={styles.tabText}>Likes</Text>
            </Pressable>
            <Pressable style={styles.tabItemCenter} onPress={() => router.push('/map')}>
                <LinearGradient
                    colors={['#9900ff', '#ff00f7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.tabCenterButton}
                >
                    <Text style={styles.tabCenterIcon}>📍</Text>
                </LinearGradient>
            </Pressable>
            <Pressable style={styles.tabItem} onPress={() => router.push('/nav')}>
                <Text style={styles.tabIcon}>🧭</Text>
                <Text style={styles.tabText}>Nav</Text>
            </Pressable>
            <Pressable style={styles.tabItem} onPress={() => router.push('/profile')}>
                <Text style={styles.tabIcon}>👤</Text>
                <Text style={styles.tabText}>Profile</Text>
            </Pressable>
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
        paddingBottom: 25,
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
