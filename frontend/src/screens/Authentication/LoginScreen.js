import React, { useState, useContext } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../../context/AuthContext";

const LoginScreen = ({ navigation }) => {
    const { login } = useContext(AuthContext);
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!username || !password) {
            setError("Please fill in both fields.");
            return;
        }

        setLoading(true);
        setError("");

        const result = await login(username, password);
        setLoading(false);

        if (!result.success) {
            setError(result.error || "Login failed. Please try again.");
        } else {
            navigation.replace("Main");
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {/* Back Arrow */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.title}>Log in</Text>

            {error !== "" && (
                <Text style={styles.errorText}>
                    {typeof error === "string"
                        ? error
                        : error?.non_field_errors?.[0] || "Something went wrong"}
                </Text>
            )}

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#B0B3B8"
                value={username}
                onChangeText={setUserName}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => this.passwordInput?.focus()}
            />

            <TextInput
                ref={(input) => (this.passwordInput = input)}
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#B0B3B8"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
            />


            <TouchableOpacity
                style={[styles.loginButton, loading && { opacity: 0.6 }]}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.loginText}>Log In</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity>
                <Text style={styles.footerText}>
                    New User?{" "}
                    <Text
                        style={styles.signupText}
                        onPress={() => navigation.replace("SignUp")}
                    >
                        Sign Up
                    </Text>
                </Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#070D23",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
        zIndex: 10,
    },
    title: {
        fontSize: 28,
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 30,
    },
    input: {
        width: "100%",
        backgroundColor: "#1A1D2E",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        color: "#fff",
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: "#3B82F6",
        paddingVertical: 15,
        borderRadius: 25,
        width: "100%",
        alignItems: "center",
        marginTop: 20,
    },
    loginText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    signupText: {
        color: "#3B82F6",
        fontWeight: "bold",
    },
    footerText: {
        color: "#aaa",
        marginTop: 20,
    },
    errorText: {
        color: "red",
        marginBottom: 15,
        textAlign: "center",
    },
});

export default LoginScreen;
