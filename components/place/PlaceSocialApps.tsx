import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SocialMediaLinks } from '../../types/place.types';

interface PlaceSocialAppsProps {
    socialMedia: SocialMediaLinks;
}

interface AppItem {
    id: string;
    name: string;
    icon: string;
    color: string;
    url?: string;
}

export default function PlaceSocialApps({ socialMedia }: PlaceSocialAppsProps) {
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

    if (socialMediaApps.length === 0) return null;

    return (
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
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 16,
        backgroundColor: '#fff',
        paddingTop: 10,
        paddingBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
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
