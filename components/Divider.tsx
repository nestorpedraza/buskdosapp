import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DividerProps {
    text?: string;
    style?: object;
}

export default function Divider({ text = 'o', style }: DividerProps) {
    return (
        <View style={[styles.divider, style]}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{text}</Text>
            <View style={styles.dividerLine} />
        </View>
    );
}

const styles = StyleSheet.create({
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#999',
        fontFamily: 'Poppins_400Regular',
    },
});
