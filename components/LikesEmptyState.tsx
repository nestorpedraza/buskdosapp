import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface Props {
    onExplore: () => void;
}

export default function LikesEmptyState({ onExplore }: Props) {
    return (
        <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💔</Text>
            <Text style={styles.emptyTitle}>Sin favoritos aún</Text>
            <Text style={styles.emptySubtitle}>
                Explora y guarda los lugares que te gusten
            </Text>
            <Pressable
                style={styles.exploreButton}
                onPress={onExplore}
            >
                <LinearGradient
                    colors={['#9900ff', '#ff00f7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.exploreButtonGradient}
                >
                    <Text style={styles.exploreButtonText}>Explorar</Text>
                </LinearGradient>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        fontSize: 60,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginBottom: 30,
    },
    exploreButton: {
        borderRadius: 25,
        overflow: 'hidden',
    },
    exploreButtonGradient: {
        paddingHorizontal: 40,
        paddingVertical: 15,
    },
    exploreButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
