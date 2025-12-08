import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, Stop, LinearGradient as SvgLinearGradient, Text as SvgText } from 'react-native-svg';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';

export default function Register() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!email) {
            newErrors.email = 'El email es obligatorio.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'El email no es válido.';
        }

        if (!name) {
            newErrors.name = 'El nombre es obligatorio.';
        }

        if (!password) {
            newErrors.password = 'La contraseña es obligatoria.';
        } else if (password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Debes confirmar la contraseña.';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden.';
        }

        if (!acceptTerms) {
            newErrors.terms = 'Debes aceptar los términos y condiciones.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            // Lógica de registro...
            console.log('Registro exitoso', { email, name, password });
        }
    };

    const handleCancel = () => {
        setEmail('');
        setName('');
        setPassword('');
        setConfirmPassword('');
        setAcceptTerms(false);
        setErrors({});
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

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.contentContainer}>

                    {/* Container del logo */}
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/images/buskados_vectorizado_200x200.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>

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
                                fontSize="32"
                                fontWeight="bold"
                                x="200"
                                y="40"
                                textAnchor="middle"
                            >
                                Crear Cuenta
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
                        error={errors.email}
                    />

                    {/* Input de Nombre */}
                    <AppInput
                        label="Nombre completo"
                        placeholder="Tu nombre"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        error={errors.name}
                    />

                    {/* Input de Contraseña */}
                    <AppInput
                        label="Contraseña"
                        placeholder="Mínimo 6 caracteres"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        error={errors.password}
                    />

                    {/* Input de Confirmar Contraseña */}
                    <AppInput
                        label="Confirmar Contraseña"
                        placeholder="Repite tu contraseña"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        error={errors.confirmPassword}
                    />

                    {/* Checkbox de Términos y Condiciones */}
                    <Pressable
                        style={styles.checkboxContainer}
                        onPress={() => setAcceptTerms(!acceptTerms)}
                    >
                        <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                            {acceptTerms && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.checkboxLabel}>
                            Acepto los{' '}
                            <Text style={styles.link}>términos y condiciones</Text>
                        </Text>
                    </Pressable>
                    {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

                    {/* Botones */}
                    <AppButton
                        label="Crear Cuenta"
                        onPress={handleSubmit}
                        containerStyle={{ width: '100%', marginTop: 16 }}
                    />

                    <AppButton
                        label="Limpiar formulario"
                        variant="link"
                        containerStyle={{ width: '100%' }}
                        onPress={handleCancel}
                    />

                    <AppButton label="Regresar" variant="outline" containerStyle={{ width: '100%' }} onPress={() => router.push('/login')} />

                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#7300ff5f",
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
    scrollView: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 40,
    },
    contentContainer: {
        alignItems: 'center',
        paddingHorizontal: 30,
        width: '100%',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    logo: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginTop: 16,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#6600ff',
        borderRadius: 4,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#6600ff',
    },
    checkmark: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    link: {
        color: '#6600ff',
        textDecorationLine: 'underline',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
});