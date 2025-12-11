import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeHeader() {
    const router = useRouter();
    const [isFocused, setIsFocused] = useState(false);

    return (
        <LinearGradient
            colors={['#9900ff', '#ff00f7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
        >
            {/* Logo Section */}
            <View style={styles.logoSection}>
                <Pressable onPress={() => router.push('/')} style={styles.logoPressable}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/images/buskados_vectorizado_200x200.png')}
                            style={styles.logoImage}
                        />
                        <View style={styles.logoTextContainer}>
                            <Text style={styles.logoMainText}>Buskdos</Text>
                            <Text style={styles.logoSubText}>Descubre & Compra</Text>
                        </View>
                    </View>
                </Pressable>
            </View>


        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    headerGradient: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        shadowColor: '#9900ff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 8,
    },
    logoSection: {
        marginBottom: 16,
    },
    logoPressable: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logoIcon: {
        fontSize: 40,
    },
    logoImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        resizeMode: 'cover',
    },
    logoTextContainer: {
        justifyContent: 'center',
    },
    logoMainText: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 0.5,
    },
    logoSubText: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.85)',
        fontWeight: '500',
        marginTop: 2,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 28,
        paddingHorizontal: 16,
        paddingVertical: 2,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    searchContainerFocused: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    searchIconLeft: {
        fontSize: 18,
        marginRight: 10,
        opacity: 0.9,
    },
    searchInput: {
        flex: 1,
        height: 46,
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
    },
    clearButton: {
        padding: 8,
        marginLeft: 4,
    },
    clearIcon: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.7)',
    },
});
