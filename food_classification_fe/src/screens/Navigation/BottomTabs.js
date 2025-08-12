import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function BottomTabs() {
    const navigation = useNavigation();

    return (
        <View style={styles.footer}>
            <FooterButton
                icon={<Ionicons name="home-outline" size={24} color="#4CAF50" />}
                label="Home"
                onPress={() => navigation.navigate('Home')}
            />
            <FooterButton
                icon={<Ionicons name="help-circle-outline" size={24} color="#4CAF50" />}
                label="How It Works"
                onPress={() => navigation.navigate('HowItWorks')}
            />
            <FooterButton
                icon={<MaterialCommunityIcons name="star-outline" size={24} color="#4CAF50" />}
                label="Features"
                onPress={() => navigation.navigate('Features')}
            />
            <FooterButton
                icon={<Ionicons name="analytics-outline" size={24} color="#4CAF50" />}
                label="Classify"
                onPress={() => navigation.navigate('Upload')}
            />
        </View>
    );
}

function FooterButton({ icon, label, onPress }) {
    return (
        <TouchableOpacity style={styles.footerButton} onPress={onPress}>
            {icon}
            <Text style={styles.footerText}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },
    footerButton: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        marginTop: 4,
        color: '#4CAF50',
        textAlign: 'center',
    },
});
