import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function DesignResponsive() {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.9}
            onPress={() => router.replace('/login')}
        >
            <View style={styles.container}>
                <View style={styles.header} />
                <View style={styles.main}>
                    <View style={styles.section1} />
                    <View style={styles.section2} />
                </View>
                <View style={styles.footer} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f0f0",
    },
    header: {
        height: 100,
        backgroundColor: "#4CAF50",
    },
    main: {
        flex: 1,
        flexDirection: "row",
    },
    section1: {
        flex: 0.5,
        backgroundColor: "#2196F3",
    },
    section2: {
        flex: 4,
        backgroundColor: "#FFC107",
    },
    footer: {
        height: 50,
        backgroundColor: "#f44336",
    },
});