import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import AuthBackground from '../components/AuthBackground';
import Divider from '../components/Divider';
import LogoHeader from '../components/LogoHeader';

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
        <AuthBackground>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.contentContainer}>
                    <LogoHeader showTitle={false} />

                    <View style={{ alignItems: 'center', width: '100%', marginBottom: 20 }}>
                        <Text style={styles.title}>Crear Cuenta</Text>
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

                    <Divider text="o" />

                    <AppButton
                        label="Ya tengo cuenta"
                        variant="outline"
                        containerStyle={{ width: '100%' }}
                        onPress={() => router.push('/login')}
                    />
                </View>
            </ScrollView>
        </AuthBackground>
    );
}

const styles = StyleSheet.create({
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
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#9900ff',
        textAlign: 'center',
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