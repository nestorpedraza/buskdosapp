import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AppButton from './AppButton';
import AppInput from './AppInput';
import Divider from './Divider';
import LogoHeader from './LogoHeader';

interface AuthFormProps {
    type: 'login' | 'register';
}

export default function AuthForm({ type }: AuthFormProps) {
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
            if (type === 'login') {
                router.push('/home');
            }
        }
    };

    const handleCancel = () => {
        setEmail('');
        setPassword('');
        setValidationError('');
    };

    return (
        <View style={styles.contentContainer}>
            <LogoHeader />

            <AppInput
                label="Correo Electrónico"
                placeholder="tu.email@dominio.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
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
                error={validationError}
            />

            <AppButton
                label={type === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                onPress={handleSubmit}
                containerStyle={{ width: '100%' }}
            />

            {type === 'login' && (
                <>
                    <AppButton
                        label="¿Olvidaste tu contraseña?"
                        variant="link"
                        containerStyle={{ width: '100%' }}
                        onPress={handleCancel}
                    />

                    <Divider />

                    <AppButton
                        label="Crear cuenta nueva"
                        variant="outline"
                        containerStyle={{ width: '100%' }}
                        onPress={() => router.push('/register')}
                    />
                </>
            )}

            {type === 'register' && (
                <>
                    <Divider />

                    <AppButton
                        label="Ya tengo cuenta"
                        variant="outline"
                        containerStyle={{ width: '100%' }}
                        onPress={() => router.push('/login')}
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        width: '100%',
    },
});
