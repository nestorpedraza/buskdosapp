import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function Header() {
    const router = useRouter();
    const [isFocused, setIsFocused] = useState(false);

    return (
        <LinearGradient
            colors={['#9900ff', '#ff00f7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
        >
            <View style={styles.logoSection}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/images/buskados_vectorizado_200x200.png')}
                        style={styles.logoImage}
                    />
                    <View style={styles.logoTextContainer}>
                        <Text style={styles.logoMainText}>Buskdos</Text>
                        <Text style={styles.logoSubText}>Explora, Descubre & Compra</Text>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    headerGradient: {
        paddingTop: 10,
        paddingBottom: 1,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
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
})
