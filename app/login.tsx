import React from 'react';
import AuthBackground from '../components/AuthBackground';
import AuthForm from '../components/AuthForm';

export default function Login() {
    return (
        <AuthBackground>
            <AuthForm type="login" />
        </AuthBackground>
    );
}