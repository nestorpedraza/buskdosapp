import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Defs, Stop, LinearGradient as SvgLinearGradient, Text as SvgText } from 'react-native-svg';

interface LogoHeaderProps {
    showLogo?: boolean;
    showTitle?: boolean;
    onLogoPress?: () => void;
}

export default function LogoHeader({
    showLogo = true,
    showTitle = true,
    onLogoPress
}: LogoHeaderProps) {
    const router = useRouter();

    const handleLogoPress = () => {
        if (onLogoPress) {
            onLogoPress();
        } else {
            router.push('/');
        }
    };

    return (
        <>
            {showLogo && (
                <Pressable style={styles.logoContainer} onPress={handleLogoPress}>
                    <Image
                        source={require('../assets/images/buskados_vectorizado_200x200.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Pressable>
            )}

            {showTitle && (
                <View style={styles.titleContainer}>
                    <Svg height="60" width="400">
                        <Defs>
                            <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <Stop offset="0%" stopColor="#0073ffff" stopOpacity="1" />
                                <Stop offset="50%" stopColor="#9900ffff" stopOpacity="1" />
                                <Stop offset="100%" stopColor="#ff00f7ff" stopOpacity="1" />
                            </SvgLinearGradient>
                        </Defs>
                        <SvgText
                            fill="url(#grad)"
                            fontSize="46"
                            fontWeight="bold"
                            x="200"
                            y="40"
                            textAnchor="middle"
                        >
                            Buskdos
                        </SvgText>
                    </Svg>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 250,
        height: 250,
        borderRadius: 125,
    },
    titleContainer: {
        alignItems: 'center',
        width: '100%',
    },
});
