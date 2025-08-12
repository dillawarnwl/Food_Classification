import React from 'react';
import { View, SafeAreaView, StyleSheet, StatusBar, Text } from 'react-native';
import BottomTabs from './BottomTabs';

export default function ScreenWrapper({ children, title }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.header}>
                <Text style={styles.headerText}>{title}</Text>
            </View>

            <View style={styles.content}>
                {children}
            </View>

            <BottomTabs />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingTop: 35,
        paddingBottom: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    content: {
        flex: 1,
    },
});
