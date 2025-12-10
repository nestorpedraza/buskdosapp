import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

interface AuthBackgroundProps {
    children: React.ReactNode;
}

export default function AuthBackground({ children }: AuthBackgroundProps) {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/images/city.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.overlay} />
            </ImageBackground>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#7300ff5f",
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
    },
});
