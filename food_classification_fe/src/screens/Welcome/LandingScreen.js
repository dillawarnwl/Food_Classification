import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Animated, Easing } from 'react-native';
import ScreenWrapper from '../Navigation/ScreenWrapper';
import food1 from '../../../assets/cuisines/food1.jpeg';
import * as NavigationBar from 'expo-navigation-bar';

export default function LandingScreen({ navigation }) {
    const fadeAnim = new Animated.Value(0);
    const translateYAnim = new Animated.Value(30);

    useEffect(() => {
        // Hide native Android navigation bar for immersive feel
        NavigationBar.setVisibilityAsync('hidden');
        NavigationBar.setBehaviorAsync('overlay-swipe');

        // Animate hero text
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(translateYAnim, {
                toValue: 0,
                duration: 800,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    return (
        <ScreenWrapper navigation={navigation} title="">
            <ImageBackground
                source={food1}
                style={styles.background}
                imageStyle={styles.imageStyle}
            >
                <View style={styles.overlay}>
                    <Animated.View 
                        style={[
                            styles.textContainer,
                            { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }
                        ]}
                    >
                        <Text style={styles.headline}>
                            Instantly{"\n"}Identify Any{"\n"}Cuisine with AI
                        </Text>

                        <Text style={styles.subheading}>
                            Snap or upload a photo — AI detects your cuisine and dish in seconds.
                        </Text>

                        <TouchableOpacity
                            style={styles.button}
                            activeOpacity={0.85}
                            onPress={() => navigation.navigate('HowItWorks')}
                        >
                            <Text style={styles.buttonText}>Try it Now</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </ImageBackground>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, resizeMode: 'cover' },
    imageStyle: { opacity: 0.8 },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    textContainer: {
        alignItems: 'center',
        maxWidth: 340,
    },
    headline: {
        fontSize: 36,
        fontWeight: '700',
        color: '#FFFFFF',
        lineHeight: 44,
        textAlign: 'center',
        marginBottom: 16,
    },
    subheading: {
        fontSize: 16,
        color: '#EAEAEA',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
    },
    button: {
        backgroundColor: '#D4FF00',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 30,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
});
