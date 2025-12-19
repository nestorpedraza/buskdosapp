import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface Props {
    likedCount?: number;
    title?: string;
    subtitle?: string;
}

export default function LikesHeader({ likedCount, title = 'Titulo', subtitle = 'Subtitulo' }: Props) {
    return (
        <View style={styles.sectionHeader}>
            <View style={styles.titleRow}>
                <Text style={styles.headerTitle}>{title}</Text>
                {likedCount !== undefined && (
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{likedCount}</Text>
                    </View>
                )}
            </View>
            <Text style={styles.headerSubtitle}>
                {subtitle}
            </Text>
            <View style={styles.separator} />
        </View>
    );
}

const styles = StyleSheet.create({
    sectionHeader: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        backgroundColor: '#fff',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '600',
        color: '#555',
        marginRight: 10,
    },
    countBadge: {
        backgroundColor: '#9900ff',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        minWidth: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#999',
        lineHeight: 20,
    },
    separator: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginTop: 15,
    },
});
