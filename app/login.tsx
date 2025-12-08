import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, Stop, LinearGradient as SvgLinearGradient, Text as SvgText } from 'react-native-svg';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validationError, setValidationError] = useState('');

    const handleSubmit = () => {
        if (email === '') {
            setValidationError('El email es obligatorio.');
        } else {
            setValidationError('');
            // Lógica de envío...
        }
    };
    const handleCancel = () => {
        setEmail('');
        setPassword('');
        setValidationError('');
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/images/city.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.overlay} />
            </ImageBackground>

            <View style={styles.contentContainer}>

                {/*  Container del logo */}
                <Pressable style={styles.logoContainer} onPress={() => router.push('/')}>
                    {/* Logo */}
                    <Image
                        source={require('../assets/images/buskados_vectorizado_200x200.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Pressable>
                <View style={{ alignItems: 'center', width: '100%' }}>
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
                {/* Input de Email */}
                <AppInput
                    label="Correo Electrónico"
                    placeholder="tu.email@dominio.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    // Le pasamos el error para que active el estilo y muestre el texto
                    error={validationError}
                />

                <AppInput
                    label="Contraseña"
                    placeholder="********"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    // Le pasamos el error para que active el estilo y muestre el texto
                    error={validationError}
                />

                <AppButton
                    label="Iniciar Sesión"
                    onPress={() => router.push('/HomeScreen')}
                    containerStyle={{ width: '100%' }}
                />
                <AppButton label="¿Olvidaste tu contraseña?" variant="link" containerStyle={{ width: '100%' }} onPress={handleCancel} />
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>o</Text>
                    <View style={styles.dividerLine} />
                </View>

                <AppButton label="Crear cuenta nueva" variant="outline" containerStyle={{ width: '100%' }} onPress={() => router.push('/register')} />


            </View>


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
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        width: '100%',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 250,
        height: 250,
        borderRadius: 125,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#999',
        fontFamily: 'Poppins_400Regular',
    },
});