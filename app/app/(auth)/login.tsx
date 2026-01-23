import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "../../constants/Config";

export default function LoginScreen() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!identifier || !password) {
            Alert.alert("Error", "Please enter email and password");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: identifier,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem('userInfo', JSON.stringify(data));
                router.replace("/(tabs)");
            } else {
                Alert.alert("Login Failed", data.message || "Invalid credentials");
            }
        } catch (error) {
            console.error("Login Error:", error);
            Alert.alert("Error", "Network request failed. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <View className="flex-1 px-8 pt-12 pb-10">
                    {/* Header Section */}
                    <View className="items-center mb-10">
                        <Image
                            source={require("../../assets/images/icon.png")}
                            className="w-48 h-48 rounded-3xl shadow-sm"
                            resizeMode="contain"
                        />
                        <View className="mt-6">
                            <Text className="text-3xl font-extrabold text-[#002b5c] text-center">
                                Welcome Back
                            </Text>
                            <Text className="text-gray-500 text-lg mt-2 text-center">
                                Sign in to continue your journey
                            </Text>
                        </View>
                    </View>

                    {/* Form Section */}
                    <View className="space-y-6">
                        <View>
                            <Text className="text-[#002b5c] font-bold text-sm uppercase tracking-wider mb-2 ml-1">
                                Email
                            </Text>
                            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4">
                                <Ionicons name="mail-outline" size={20} color="#6b7280" />
                                <TextInput
                                    placeholder="Enter your email"
                                    value={identifier}
                                    onChangeText={setIdentifier}
                                    autoCapitalize="none"
                                    className="flex-1 ml-3 text-gray-800 text-base"
                                    placeholderTextColor="#9ca3af"
                                />
                            </View>
                        </View>

                        <View className="mt-4">
                            <Text className="text-[#002b5c] font-bold text-sm uppercase tracking-wider mb-2 ml-1">
                                Password
                            </Text>
                            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4">
                                <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
                                <TextInput
                                    placeholder="Enter your password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    className="flex-1 ml-3 text-gray-800 text-base"
                                    placeholderTextColor="#9ca3af"
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => { }}
                            className="self-end pt-2"
                        >
                            <Text className="text-[#002b5c] font-semibold">Forgot Password?</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            activeOpacity={0.8}
                            className="bg-[#002b5c] py-5 rounded-2xl shadow-lg mt-8 shadow-[#002b5c]/30 flex-row justify-center items-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white text-center font-bold text-lg">
                                    Sign In
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Footer Section */}
                    <View className="mt-auto pt-10 flex-row justify-center items-center">
                        <Text className="text-gray-500 text-base">Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push("/registration")}>
                            <Text className="text-[#002b5c] font-bold text-base">Create Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
