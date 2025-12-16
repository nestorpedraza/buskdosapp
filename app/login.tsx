import React from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import AuthBackground from '../components/AuthBackground';
import AuthForm from '../components/AuthForm';

export default function Login() {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{ flex: 1 }}>
                <AuthBackground>
                    <AuthForm type="login" />
                </AuthBackground>
            </View>
        </TouchableWithoutFeedback>
    );
}
