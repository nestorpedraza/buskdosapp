import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DeliveryAppLinks } from '../../types/place.types';

interface PlaceDeliveryAppsProps {
    deliveryApps: DeliveryAppLinks;
}

interface AppItem {
    id: string;
    name: string;
    icon: string;
    color: string;
    url?: string;
}

export default function PlaceDeliveryApps({ deliveryApps }: PlaceDeliveryAppsProps) {
    const deliveryAppsList: AppItem[] = [
        { id: 'rappi', name: 'Rappi', icon: '🛵', color: '#FF441F', url: deliveryApps.rappi },
        { id: 'didifood', name: 'DiDi Food', icon: '🍔', color: '#FF7D41', url: deliveryApps.didifood },
        { id: 'ubereats', name: 'Uber Eats', icon: '🥡', color: '#06C167', url: deliveryApps.ubereats },
        { id: 'ifood', name: 'iFood', icon: '🍕', color: '#EA1D2C', url: deliveryApps.ifood },
        { id: 'domicilios', name: 'Domicilios.com', icon: '📦', color: '#FF3008', url: deliveryApps.domicilios },
        { id: 'merqueo', name: 'Merqueo', icon: '🛒', color: '#00C389', url: deliveryApps.merqueo },
        { id: 'mensajerosurbanos', name: 'Mensajeros Urbanos', icon: '🏍️', color: '#00A651', url: deliveryApps.mensajerosurbanos },
        { id: 'picap', name: 'Picap', icon: '🚀', color: '#FFD700', url: deliveryApps.picap },
    ].filter(app => app.url);

    const handleOpenApp = async (url: string) => {
        try {
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
                await Linking.openURL(url);
            } else {
                await Linking.openURL(url);
            }
        } catch (error) {
            console.log('Error opening URL:', error);
        }
    };

    const renderAppItem = (app: AppItem) => (
        <TouchableOpacity
            key={app.id}
            style={styles.appItem}
            onPress={() => app.url && handleOpenApp(app.url)}
        >
            <View style={[styles.appIcon, { backgroundColor: app.color + '15' }]}>
                <Text style={styles.appEmoji}>{app.icon}</Text>
            </View>
            <Text style={styles.appName} numberOfLines={1}>{app.name}</Text>
        </TouchableOpacity>
    );

    if (deliveryAppsList.length === 0) return null;

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pide a Domicilio</Text>
            <Text style={styles.sectionSubtitle}>Disponible en estas apps</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.appsRow}
            >
                {deliveryAppsList.map(renderAppItem)}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
        paddingHorizontal: 16,
    },
    sectionSubtitle: {
        fontSize: 13,
        color: '#6b7280',
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    appsRow: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 16,
    },
    appItem: {
        alignItems: 'center',
        width: 72,
    },
    appIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    appEmoji: {
        fontSize: 26,
    },
    appName: {
        fontSize: 11,
        color: '#4b5563',
        textAlign: 'center',
    },
});
