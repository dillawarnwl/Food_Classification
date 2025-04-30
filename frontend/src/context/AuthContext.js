import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { saveToken, getToken, deleteToken } from "./Storage";
import { removeItem } from "./Storage";

const API_BASE_URL = "http://192.168.100.6:8000";
const LOGIN_URL = `${API_BASE_URL}/auth/login/`;
const LOGOUT_URL = `${API_BASE_URL}/auth/logout/`;
const PROFILE_URL = `${API_BASE_URL}/accounts/profile/`;
const GOOGLE_LOGIN_URL = `${API_BASE_URL}/accounts/google-login/`;
const FACEBOOK_LOGIN_URL = `${API_BASE_URL}/accounts/facebook-login/`;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    const authAxios = axios.create({
        baseURL: API_BASE_URL,
    });

    // Automatically attach token to every request
    authAxios.interceptors.request.use(
        async (config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const storedToken = await getToken();
                if (storedToken) {
                    setToken(storedToken);
                    await fetchUserProfile(storedToken);
                }
            } catch (error) {
                console.error("Error loading user data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadUserData();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axios.post(LOGIN_URL, { username, password });
            const authToken = response.data.access || response.data.token;
            const email = response.data.user.email 
            await saveToken('email',email);
            await saveToken('authToken',authToken);
            setToken(authToken);
            await fetchUserProfile(authToken);
            return { success: true };
        } catch (error) {
            console.log("error:", error)
            console.error("Login Error:", error.response?.data || error.message);
            return { success: false, error: error.response?.data || "Login failed" };
        }
    };

    const fetchUserProfile = async (authToken) => {
        try {
            const response = await authAxios.get(PROFILE_URL, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch profile:", error.response?.data || error.message);
        }
    };

    const logout = async () => {
        try {
            await authAxios.post(LOGOUT_URL);
        } catch (error) {
            console.error("Logout Error:", error.response?.data || error.message);
        } finally {
            await deleteToken();
            setUser(null);
            setToken(null);
            await removeItem('email');
            await removeItem('authToken');

        }
    };

    const loginWithGoogle = async (accessToken) => {
        try {
            const response = await axios.post(GOOGLE_LOGIN_URL, { access_token: accessToken });
            const authToken = response.data.access || response.data.key;
            await saveToken(authToken);
            setToken(authToken);
            await fetchUserProfile(authToken);
            return { success: true };
        } catch (error) {
            console.error("Google Login Error:", error.response?.data || error.message);
            return { success: false, error: error.response?.data || "Google login failed" };
        }
    };

    const loginWithFacebook = async (accessToken) => {
        try {
            const response = await axios.post(FACEBOOK_LOGIN_URL, { access_token: accessToken });
            const authToken = response.data.access || response.data.key;
            await saveToken(authToken);
            setToken(authToken);
            await fetchUserProfile(authToken);
            return { success: true };
        } catch (error) {
            console.error("Facebook Login Error:", error.response?.data || error.message);
            return { success: false, error: error.response?.data || "Facebook login failed" };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                logout,
                loginWithGoogle,
                loginWithFacebook,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
