import React from 'react';
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { DeliveryAppLinks, SocialMediaLinks } from '../../types/place.types';

interface PlaceAppsProps {
    socialMedia: SocialMediaLinks;
    deliveryApps: DeliveryAppLinks;
}

interface AppItem {
    id: string;
    name: string;
    icon: string;
    color: string;
    url?: string;
}

export default function PlaceApps({ socialMedia, deliveryApps }: PlaceAppsProps) {
    const socialMediaApps: AppItem[] = [
        { id: 'facebook', name: 'Facebook', icon: '👤', color: '#1877F2', url: socialMedia.facebook },
        { id: 'instagram', name: 'Instagram', icon: '📷', color: '#E4405F', url: socialMedia.instagram },
        { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000', url: socialMedia.tiktok },
        { id: 'twitter', name: 'X', icon: '𝕏', color: '#000000', url: socialMedia.twitter },
        { id: 'youtube', name: 'YouTube', icon: '▶️', color: '#FF0000', url: socialMedia.youtube },
        { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0A66C2', url: socialMedia.linkedin },
        { id: 'pinterest', name: 'Pinterest', icon: '📌', color: '#E60023', url: socialMedia.pinterest },
        { id: 'snapchat', name: 'Snapchat', icon: '👻', color: '#FFFC00', url: socialMedia.snapchat },
        { id: 'telegram', name: 'Telegram', icon: '✈️', color: '#0088cc', url: socialMedia.telegram },
        { id: 'discord', name: 'Discord', icon: '🎮', color: '#5865F2', url: socialMedia.discord },
    ].filter(app => app.url);

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
                // Fallback to browser
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

    return (
        <View style={styles.container}>
            {/* Redes Sociales */}
            {socialMediaApps.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Redes Sociales</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.appsRow}
                    >
                        {socialMediaApps.map(renderAppItem)}
                    </ScrollView>
                </View>
            )}

            {/* Apps de Domicilios */}
            {deliveryAppsList.length > 0 && (
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
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingVertical: 8,
    },
    section: {
        marginBottom: 16,
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
