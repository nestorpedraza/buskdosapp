import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import HomeTabBar from '../components/HomeTabBar';

const { width } = Dimensions.get('window');

interface MenuItem {
    id: string;
    icon: string;
    title: string;
    subtitle?: string;
    route?: string;
}

interface UserStats {
    reviews: number;
    favorites: number;
    visited: number;
}

export default function ProfileScreen() {
    const router = useRouter();

    const userStats = useMemo<UserStats>(() => ({
        reviews: 23,
        favorites: 45,
        visited: 78,
    }), []);

    const menuItems = useMemo<MenuItem[]>(() => [
        { id: '1', icon: '👤', title: 'Editar perfil', subtitle: 'Nombre, foto, bio' },
        { id: '2', icon: '📍', title: 'Mis direcciones', subtitle: 'Casa, trabajo, otros' },
        { id: '3', icon: '🔔', title: 'Notificaciones', subtitle: 'Push, email, promociones' },
        { id: '4', icon: '🔒', title: 'Privacidad', subtitle: 'Contraseña, datos' },
        { id: '5', icon: '💳', title: 'Métodos de pago', subtitle: 'Tarjetas, wallets' },
        { id: '6', icon: '🎁', title: 'Mis recompensas', subtitle: '250 puntos disponibles' },
    ], []);

    const supportItems = useMemo<MenuItem[]>(() => [
        { id: '1', icon: '❓', title: 'Centro de ayuda' },
        { id: '2', icon: '💬', title: 'Contactar soporte' },
        { id: '3', icon: '📝', title: 'Términos y condiciones' },
        { id: '4', icon: '🔐', title: 'Política de privacidad' },
    ], []);

    const handleLogout = () => {
        router.push('/login');
    };

    return (
        <View style={styles.container}>
            {/* Header with gradient */}
            <LinearGradient
                colors={['#9900ff', '#ff00f7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.headerGradient}
            >
                {/* Settings Icon */}
                <Pressable style={styles.settingsButton}>
                    <Text style={styles.settingsIcon}>⚙️</Text>
                </Pressable>

                {/* Profile Info */}
                <View style={styles.profileInfo}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={require('../assets/images/city.png')}
                            style={styles.avatar}
                        />
                        <View style={styles.avatarBadge}>
                            <Text style={styles.avatarBadgeText}>✓</Text>
                        </View>
                    </View>
                    <Text style={styles.userName}>Juan Pérez</Text>
                    <Text style={styles.userEmail}>juan.perez@email.com</Text>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{userStats.reviews}</Text>
                        <Text style={styles.statLabel}>Reseñas</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{userStats.favorites}</Text>
                        <Text style={styles.statLabel}>Favoritos</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{userStats.visited}</Text>
                        <Text style={styles.statLabel}>Visitados</Text>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Premium Card */}
                <Pressable style={styles.premiumCard}>
                    <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.premiumGradient}
                    >
                        <View style={styles.premiumContent}>
                            <Text style={styles.premiumIcon}>👑</Text>
                            <View style={styles.premiumInfo}>
                                <Text style={styles.premiumTitle}>Hazte Premium</Text>
                                <Text style={styles.premiumSubtitle}>
                                    Accede a ofertas exclusivas
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.premiumArrow}>›</Text>
                    </LinearGradient>
                </Pressable>

                {/* Menu Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mi cuenta</Text>
                    <View style={styles.menuCard}>
                        {menuItems.map((item, index) => (
                            <Pressable
                                key={item.id}
                                style={[
                                    styles.menuItem,
                                    index === menuItems.length - 1 && styles.menuItemLast
                                ]}
                            >
                                <View style={styles.menuIconContainer}>
                                    <Text style={styles.menuIcon}>{item.icon}</Text>
                                </View>
                                <View style={styles.menuContent}>
                                    <Text style={styles.menuTitle}>{item.title}</Text>
                                    {item.subtitle && (
                                        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                                    )}
                                </View>
                                <Text style={styles.menuArrow}>›</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Support Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Soporte</Text>
                    <View style={styles.menuCard}>
                        {supportItems.map((item, index) => (
                            <Pressable
                                key={item.id}
                                style={[
                                    styles.menuItem,
                                    index === supportItems.length - 1 && styles.menuItemLast
                                ]}
                            >
                                <View style={styles.menuIconContainer}>
                                    <Text style={styles.menuIcon}>{item.icon}</Text>
                                </View>
                                <View style={styles.menuContent}>
                                    <Text style={styles.menuTitle}>{item.title}</Text>
                                </View>
                                <Text style={styles.menuArrow}>›</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Logout Button */}
                <Pressable style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutIcon}>🚪</Text>
                    <Text style={styles.logoutText}>Cerrar sesión</Text>
                </Pressable>

                {/* App Version */}
                <Text style={styles.versionText}>Buskdos v1.0.0</Text>
            </ScrollView>

            <HomeTabBar activeRoute="/profile" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    headerGradient: {
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    settingsButton: {
        position: 'absolute',
        top: 50,
        right: 20,
    },
    settingsIcon: {
        fontSize: 24,
    },
    profileInfo: {
        alignItems: 'center',
        marginTop: 10,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: '#fff',
    },
    avatarBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    avatarBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 12,
    },
    userEmail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    premiumCard: {
        marginHorizontal: 20,
        marginTop: -15,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
    },
    premiumGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 18,
    },
    premiumContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    premiumIcon: {
        fontSize: 28,
        marginRight: 12,
    },
    premiumInfo: {},
    premiumTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    premiumSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    premiumArrow: {
        fontSize: 24,
        color: '#fff',
    },
    section: {
        marginTop: 25,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    menuCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    menuItemLast: {
        borderBottomWidth: 0,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#f5f0ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuIcon: {
        fontSize: 18,
    },
    menuContent: {
        flex: 1,
        marginLeft: 12,
    },
    menuTitle: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    menuSubtitle: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    menuArrow: {
        fontSize: 22,
        color: '#ccc',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 30,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ff4757',
    },
    logoutIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    logoutText: {
        fontSize: 15,
        color: '#ff4757',
        fontWeight: '600',
    },
    versionText: {
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
        fontSize: 12,
        color: '#999',
    },
});
