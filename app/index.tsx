import { useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, Stop, LinearGradient as SvgLinearGradient, Text as SvgText } from 'react-native-svg';

const Index = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={() => router.replace('/login')}
    >
      <ImageBackground
        source={require('../assets/images/city.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
      </ImageBackground>
      {/* Título */}
      <View style={styles.titleContainer}>
        <View style={{ marginBottom: 16, borderRadius: 125, overflow: 'hidden' }}>
          <ImageBackground
            source={require('../assets/images/buskados_vectorizado_200x200.png')}
            style={{ width: 250, height: 250 }}
            resizeMode="contain"
          />
        </View>
        <Svg height="60" width="400">
          <Defs>
            <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#9900ffff" stopOpacity="1" />
              <Stop offset="50%" stopColor="#4400ffff" stopOpacity="1" />
              <Stop offset="100%" stopColor="#006effff" stopOpacity="1" />
            </SvgLinearGradient>
          </Defs>
          <SvgText
            fill="url(#grad)"
            fontSize="46"
            fontWeight="bold"
            fontFamily="Poppins_700Bold"
            x="200"
            y="40"
            textAnchor="middle"
          >
            Buskdos
          </SvgText>
        </Svg>
        <Text style={styles.subtitle}>
          Descubre tiendas, negocios, emprendimientos y oportunidades cerca de ti
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.2
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  titleContainer: {
    position: 'absolute',
    top: '25%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    color: '#00d2ff',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(106, 106, 106, 0.5)',
    textShadowOffset: { width: 0, height: 5 },
    textShadowRadius: 5,
  },
  subtitle: {
    color: '#4b4b4bff',
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
    justifyContent: 'center',
  },
});

export default Index;
