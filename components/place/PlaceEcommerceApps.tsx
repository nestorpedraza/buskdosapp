import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ECOMMERCE_APPS = [
    {
        id: 'mercadolibre',
        name: 'Mercado Libre',
        icon: null,
        url: 'https://mercadolibre.com/',
    },
    {
        id: 'aliexpress',
        name: 'AliExpress',
        icon: null,
        url: 'https://aliexpress.com/',
    },
    {
        id: 'temu',
        name: 'Temu',
        icon: null,
        url: 'https://temu.com/',
    },
    {
        id: 'shein',
        name: 'Shein',
        icon: null,
        url: 'https://shein.com/',
    },
    {
        id: 'amazon',
        name: 'Amazon',
        icon: null,
        url: 'https://amazon.com/',
    },
];

export default function PlaceEcommerceApps() {
    const renderIcon = (id: string) => {
        switch (id) {
            case 'mercadolibre':
                return <MaterialCommunityIcons name="cart-outline" size={36} color="#ffe600" style={{ backgroundColor: '#222', borderRadius: 18, padding: 4 }} />;
            case 'aliexpress':
                return <FontAwesome5 name="store" size={36} color="#ff4747" style={{ backgroundColor: '#fff', borderRadius: 18, padding: 4 }} />;
            case 'temu':
                return <FontAwesome5 name="shopping-bag" size={36} color="#ff6600" style={{ backgroundColor: '#fff', borderRadius: 18, padding: 4 }} />;
            case 'shein':
                return <FontAwesome name="shopping-bag" size={36} color="#000" style={{ backgroundColor: '#fff', borderRadius: 18, padding: 4 }} />;
            case 'amazon':
                return <FontAwesome5 name="amazon" size={36} color="#232f3e" style={{ backgroundColor: '#fff', borderRadius: 18, padding: 4 }} />;
            default:
                return <FontAwesome5 name="shopping-cart" size={36} color="#888" />;
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>E-commerce</Text>
            <Text style={styles.subtitle}>Compra en tus apps favoritas</Text>
            <View style={styles.appList}>
                {ECOMMERCE_APPS.map(app => (
                    <TouchableOpacity
                        key={app.id}
                        style={styles.appItem}
                        onPress={() => Linking.openURL(app.url)}
                        activeOpacity={0.8}
                    >
                        {renderIcon(app.id)}
                        <Text style={styles.appName}>{app.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingTop: 2,
        paddingBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
        paddingHorizontal: 16,
    },
    subtitle: {
        fontSize: 13,
        color: '#6b7280',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    appList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    appItem: {
        alignItems: 'center',
        flex: 1,
    },
    appIcon: {
        width: 48,
        height: 48,
        marginBottom: 6,
        resizeMode: 'contain',
    },
    appName: {
        fontSize: 12,
        color: '#374151',
        textAlign: 'center',
    },
});
