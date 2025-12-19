import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
    Dimensions,
    Image,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
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
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <Header />

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

                    {/* Profile Card */}
                    <View style={styles.profileCard}>
                        {/* Profile Info */}
                        <View style={styles.profileInfo}>
                            <View style={styles.avatarContainer}>
                                <Image
                                    source={require('../assets/images/city.png')}
                                    style={styles.avatar}
                                />
                                <Pressable style={styles.avatarEditButton}>
                                    <Text style={styles.avatarEditIcon}>📷</Text>
                                </Pressable>
                            </View>
                            <Text style={styles.userName}>Juan Pérez</Text>
                            <Text style={styles.userEmail}>juan.perez@email.com</Text>
                            <View style={styles.verifiedBadge}>
                                <Text style={styles.verifiedIcon}>✓</Text>
                                <Text style={styles.verifiedText}>Verificado</Text>
                            </View>
                        </View>

                        {/* Stats */}
                        <View style={styles.statsContainer}>
                            <Pressable style={styles.statItem}>
                                <Text style={styles.statNumber}>{userStats.reviews}</Text>
                                <Text style={styles.statLabel}>Reseñas</Text>
                            </Pressable>
                            <View style={styles.statDivider} />
                            <Pressable style={styles.statItem}>
                                <Text style={styles.statNumber}>{userStats.favorites}</Text>
                                <Text style={styles.statLabel}>Favoritos</Text>
                            </Pressable>
                            <View style={styles.statDivider} />
                            <Pressable style={styles.statItem}>
                                <Text style={styles.statNumber}>{userStats.visited}</Text>
                                <Text style={styles.statLabel}>Visitados</Text>
                            </Pressable>
                        </View>
                    </View>



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
        backgroundColor: '#f8f8f8',
    },
    profileCard: {
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    profileInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#e0e0e0',
    },
    avatarEditButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#9900ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    avatarEditIcon: {
        fontSize: 16,
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e8f5e9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        gap: 5,
    },
    verifiedIcon: {
        fontSize: 12,
        color: '#4CAF50',
    },
    verifiedText: {
        color: '#4CAF50',
        fontSize: 12,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        borderRadius: 15,
        paddingVertical: 16,
        paddingHorizontal: 10,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#ddd',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    premiumCard: {
        marginHorizontal: 20,
        marginTop: 10,
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
