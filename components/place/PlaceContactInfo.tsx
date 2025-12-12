import React from 'react';
import {
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface PlaceContactInfoProps {
    address: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    phone: string;
    whatsapp: string;
    schedule: string;
    website: string;
}

export default function PlaceContactInfo({
    address,
    coordinates,
    phone,
    whatsapp,
    schedule,
    website,
}: PlaceContactInfoProps) {
    const handleOpenMaps = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`;
        Linking.openURL(url);
    };

    const handleCall = () => {
        Linking.openURL(`tel:${phone}`);
    };

    const handleWhatsApp = () => {
        const cleanNumber = whatsapp.replace(/\D/g, '');
        Linking.openURL(`whatsapp://send?phone=${cleanNumber}`);
    };

    const handleWebsite = () => {
        let url = website;
        if (!url.startsWith('http')) {
            url = 'https://' + url;
        }
        Linking.openURL(url);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Información de Contacto</Text>

            {/* Mapa */}
            <TouchableOpacity style={styles.mapContainer} onPress={handleOpenMaps}>
                <Image
                    source={require('../../assets/images/mapa.png')}
                    style={styles.mapImage}
                    resizeMode="cover"
                />
                <View style={styles.mapOverlay}>
                    <View style={styles.mapPin}>
                        <Text style={styles.mapPinIcon}>📍</Text>
                    </View>
                    <Text style={styles.mapText}>Ver en Google Maps</Text>
                </View>
            </TouchableOpacity>

            {/* Lista de contactos */}
            <View style={styles.contactList}>
                {/* Dirección */}
                <View style={styles.contactItem}>
                    <View style={styles.contactIcon}>
                        <Text style={styles.iconEmoji}>📍</Text>
                    </View>
                    <View style={styles.contactContent}>
                        <Text style={styles.contactLabel}>Dirección</Text>
                        <Text style={styles.contactValue}>{address}</Text>
                    </View>
                    <TouchableOpacity style={styles.actionButton} onPress={handleOpenMaps}>
                        <Text style={styles.actionButtonText}>Ir</Text>
                    </TouchableOpacity>
                </View>

                {/* Teléfono */}
                <View style={styles.contactItem}>
                    <View style={styles.contactIcon}>
                        <Text style={styles.iconEmoji}>📞</Text>
                    </View>
                    <View style={styles.contactContent}>
                        <Text style={styles.contactLabel}>Teléfono</Text>
                        <Text style={styles.contactValue}>{phone}</Text>
                    </View>
                    <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
                        <Text style={styles.actionButtonText}>Llamar</Text>
                    </TouchableOpacity>
                </View>

                {/* WhatsApp */}
                <View style={styles.contactItem}>
                    <View style={[styles.contactIcon, styles.whatsappIcon]}>
                        <Text style={styles.iconEmoji}>💬</Text>
                    </View>
                    <View style={styles.contactContent}>
                        <Text style={styles.contactLabel}>WhatsApp</Text>
                        <Text style={styles.contactValue}>{whatsapp}</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.whatsappButton]}
                        onPress={handleWhatsApp}
                    >
                        <Text style={[styles.actionButtonText, styles.whatsappButtonText]}>
                            Chat
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Horario */}
                <View style={styles.contactItem}>
                    <View style={styles.contactIcon}>
                        <Text style={styles.iconEmoji}>🕐</Text>
                    </View>
                    <View style={styles.contactContent}>
                        <Text style={styles.contactLabel}>Horario</Text>
                        <Text style={styles.contactValue}>{schedule}</Text>
                    </View>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>Abierto</Text>
                    </View>
                </View>

                {/* Sitio web */}
                {website && (
                    <View style={styles.contactItem}>
                        <View style={styles.contactIcon}>
                            <Text style={styles.iconEmoji}>🌐</Text>
                        </View>
                        <View style={styles.contactContent}>
                            <Text style={styles.contactLabel}>Sitio web</Text>
                            <Text style={styles.contactValue} numberOfLines={1}>{website}</Text>
                        </View>
                        <TouchableOpacity style={styles.actionButton} onPress={handleWebsite}>
                            <Text style={styles.actionButtonText}>Visitar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingVertical: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    mapContainer: {
        marginHorizontal: 16,
        height: 160,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapPin: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#8b5cf6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    mapPinIcon: {
        fontSize: 24,
    },
    mapText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    contactList: {
        paddingHorizontal: 16,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    contactIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#f3e8ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    whatsappIcon: {
        backgroundColor: '#dcfce7',
    },
    iconEmoji: {
        fontSize: 20,
    },
    contactContent: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 14,
        color: '#1a1a1a',
        fontWeight: '500',
    },
    actionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f3f4f6',
        borderRadius: 20,
    },
    actionButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4b5563',
    },
    whatsappButton: {
        backgroundColor: '#25D366',
    },
    whatsappButtonText: {
        color: '#fff',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#dcfce7',
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#16a34a',
    },
});
