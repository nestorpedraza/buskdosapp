import React, { FC } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle
} from "react-native";

type ButtonVariant = "primary" | "secondary" | "outline" | "link";

interface AppButtonProps extends TouchableOpacityProps {
    label: string;
    loading?: boolean;
    variant?: ButtonVariant;
    containerStyle?: ViewStyle;
    textStyle?: TextStyle;
}

const AppButton: FC<AppButtonProps> = ({
    label,
    loading = false,
    variant = "primary",
    containerStyle,
    textStyle,
    disabled,
    ...rest
}) => {
    const isDisabled = disabled || loading;
    const { backgroundColor, textColor, borderColor } = variantStyles[variant];

    return (
        <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.4}
            disabled={isDisabled}
            style={[
                styles.button,
                { backgroundColor },
                borderColor ? [styles.outline, { borderColor }] : undefined,
                isDisabled ? styles.disabled : undefined,
                containerStyle,
            ]}
            {...rest}
        >
            {loading ? (
                <ActivityIndicator color={textColor} />
            ) : (
                <Text style={[styles.label, { color: textColor }, textStyle]}>{label}</Text>
            )}
        </TouchableOpacity>
    );
};

const variantStyles: Record<
    ButtonVariant,
    { backgroundColor: string; textColor: string; borderColor?: string }
> = {
    primary: {
        backgroundColor: "#6600ff",
        textColor: "#FFFFFF",
    },
    secondary: {
        backgroundColor: "#f90ce0",
        textColor: "#FFFFFF",

    },
    outline: {
        backgroundColor: "#FFFFFF",
        textColor: "#6600ff",
        borderColor: "#6600ff",
    },
    link: {
        backgroundColor: "transparent",
        textColor: "#6600ff",
        borderColor: "transparent",
    },
};

const styles = StyleSheet.create({
    button: {
        minHeight: 40,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        margin: 4,
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
    },
    outline: {
        borderWidth: 1,
    },
    disabled: {
        opacity: 0.5,
    },
});

export default AppButton;