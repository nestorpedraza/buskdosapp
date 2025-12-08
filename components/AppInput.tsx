import React, { FC } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';

// 1. Tipado de Props robusto (Extiende todas las props nativas de TextInput)
interface AppInputProps extends TextInputProps {
    /** Etiqueta que aparece sobre el input. Obligatorio para accesibilidad. */
    label: string;
    /** Mensaje de error a mostrar (activará el estilo de error). */
    error?: string;
    /** Estilos opcionales para el contenedor externo. */
    containerStyle?: ViewStyle;
}

// 2. Componente de Input Funcional
const AppInput: FC<AppInputProps> = ({
    label,
    error,
    containerStyle,
    style, // Desestructuramos para aplicarlo al final del array de estilos
    ...rest // Captura el resto de las props de TextInput (value, onChangeText, etc.)
}) => {
    // CRÍTICA: La gestión del foco (onFocus/onBlur) y animaciones
    // se harían aquí si fuera un componente avanzado (e.g., con Reanimated).
    // Por simplicidad, se omite, pero es un "code smell" si se usa en apps
    // con diseño muy complejo.

    const inputContainerStyles = [
        styles.input,
        error && styles.inputError, // Aplica estilo de error si existe
        style, // Aplica el estilo pasado por el padre, si existe
    ];

    return (
        <View style={[styles.container, containerStyle]}>
            {/* Etiqueta del Input */}
            <Text style={styles.label}>{label}</Text>

            {/* TextInput principal */}
            <TextInput
                style={inputContainerStyles}
                placeholderTextColor="#9CA3AF" // Mantiene el color base que definiste
                {...rest} // Pasa TODAS las demás props (value, onChangeText, keyboardType, etc.)
            />

            {/* Manejo de Error */}
            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : null}
        </View>
    );
};

// 3. Estilos de Rendimiento (StyleSheet.create)
const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        width: '100%',
    } as ViewStyle,
    label: {
        fontSize: 14,
        color: '#9a9a9aff',
        marginBottom: 2,
        fontWeight: '600',
    } as TextStyle,
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#8f8f8fff', // Gris claro por defecto
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#333333', // Color de texto oscuro
        backgroundColor: '#FFFFFF',
        textAlign: 'left',
        writingDirection: 'ltr',
    } as TextStyle,
    inputError: {
        borderColor: '#EF4444', // Rojo para el estado de error
    } as TextStyle,
    errorText: {
        marginTop: 4,
        fontSize: 12,
        color: '#EF4444', // Rojo para el texto de error
    } as TextStyle,
});

export default AppInput;