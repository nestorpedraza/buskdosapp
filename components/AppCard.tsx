import React, { FC, ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

// 1. Tipado de Props (incluyendo 'children' para el contenido)
interface AppCardProps {
    /** El contenido a renderizar dentro de la tarjeta (Inputs, texto, etc.). */
    children: ReactNode;
    /** Estilos opcionales para sobrescribir o extender los estilos del contenedor. */
    style?: ViewStyle;
}

// 2. Componente Funcional
const AppCard: FC<AppCardProps> = ({ children, style }) => {
    // CRÍTICA CONSTRUCTIVA: El uso de 'Shadow Props' (elevation, shadowColor, etc.)
    // es conocido por ser costoso en rendimiento, especialmente en Android.
    // Es una compensación de diseño vs. rendimiento. Lo incluimos para un look
    // moderno, pero úsalo con moderación en listas grandes.

    return (
        // Combina los estilos base con los estilos opcionales del padre
        <View style={[styles.cardContainer, style]}>
            {children}
        </View>
    );
};

// 3. Estilos de Rendimiento y Diseño de Superficie
const styles = StyleSheet.create({
    cardContainer: {
        // Estilos de la tarjeta
        backgroundColor: '#FFFFFF', // Fondo blanco (estándar para superficies)
        borderRadius: 12, // Bordes redondeados
        padding: 20, // Espaciado interno general
        flex: 1,
        margin: 20, // Espaciado externo
        // Sombra (Usar con cautela, es costoso)
        // iOS Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',

        // Android Shadow
        elevation: 8,
        justifyContent: 'center',

        paddingHorizontal: 30,

        // CRÍTICA: La sombra es suave y ligera (opacity 0.1) para evitar
        // que se vea tosca. Ajusta la 'elevation' de Android para que coincida con iOS.
    } as ViewStyle,
});

export default AppCard;