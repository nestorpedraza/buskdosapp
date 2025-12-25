import React, { ReactNode } from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './Header';
import TabBar from './TabBar';

interface AppSafeAreaProps {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    activeRoute?: string;
}

export default function AppSafeArea({ children, style, activeRoute }: AppSafeAreaProps) {
    return (
        <SafeAreaView
            style={[
                { flex: 1, backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? 0 : 0 },
                style,
            ]}
            edges={['top', 'bottom']}
        >
            <View style={styles.container}>
                {/* Header */}
                <Header />
                {/* Body */}
                <View style={styles.containerBody}>
                    {children}
                </View>
                {/* Bottom Tab Bar */}
                <TabBar activeRoute={activeRoute} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    containerBody: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
