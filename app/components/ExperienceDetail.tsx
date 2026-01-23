import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { Dimensions, Image, Modal, ScrollView, Text, TouchableOpacity, View, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BookingFlow from "./BookingFlow";
import { API_URL } from "../constants/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get('window');

interface Experience {
    id: string;
    title: string;
    category: string;
    image: string;
    price: string;
    rating: number;
    reviews: string;
    features: string;
    isOriginal?: boolean;
    certified?: boolean;
    description?: string;
}

interface Props {
    visible: boolean;
    experience: Experience | null;
    onClose: () => void;
}

export default function ExperienceDetail({ visible, experience, onClose }: Props) {
    const insets = useSafeAreaInsets();
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isBookingFlowVisible, setIsBookingFlowVisible] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    useEffect(() => {
        if (visible && experience) {
            checkWishlistStatus();
        }
    }, [visible, experience]);

    const checkWishlistStatus = async () => {
        try {
            const userInfo = await AsyncStorage.getItem('userInfo');
            if (!userInfo) return;
            const { token } = JSON.parse(userInfo);

            const response = await fetch(`${API_URL}/users/wishlist`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (response.ok && Array.isArray(data)) {
                setIsInWishlist(data.some((item: any) => item._id === experience?.id));
            }
        } catch (error) {
            console.error("Error checking wishlist:", error);
        }
    };

    const toggleWishlist = async () => {
        if (!experience) return;
        setWishlistLoading(true);

        try {
            const userInfo = await AsyncStorage.getItem('userInfo');
            if (!userInfo) {
                Alert.alert("Login Required", "Please login to add items to wishlist");
                return;
            }
            const { token } = JSON.parse(userInfo);

            const url = `${API_URL}/users/wishlist/${experience.id}`;
            const method = isInWishlist ? 'DELETE' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setIsInWishlist(!isInWishlist);
            }
        } catch (error) {
            console.error("Error toggling wishlist:", error);
        } finally {
            setWishlistLoading(false);
        }
    };

    if (!experience) return null;

    // Generate next 10 days
    const dates = Array.from({ length: 10 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
            id: i.toString(),
            dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNumber: date.getDate().toString(),
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            fullDate: date.toDateString(),
        };
    });

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-white dark:bg-black">
                <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                    {/* IMAGE SECTION */}
                    <View className="relative">
                        <Image source={{ uri: experience.image }} className="w-full h-[400px]" />

                        {/* CLOSE BUTTON */}
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedDate(null);
                                onClose();
                            }}
                            style={{ top: (insets?.top ?? 0) + 10 }}
                            className="absolute left-4 w-10 h-10 bg-black/30 rounded-full items-center justify-center"
                        >
                            <Ionicons name="close" size={24} color="white" />
                        </TouchableOpacity>

                        {/* ACTION BUTTONS */}
                        <View style={{ top: (insets?.top ?? 0) + 10 }} className="absolute right-4 flex-row gap-3">
                            <TouchableOpacity className="w-10 h-10 bg-black/30 rounded-full items-center justify-center">
                                <Ionicons name="share-outline" size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={toggleWishlist}
                                disabled={wishlistLoading}
                                className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
                            >
                                <Ionicons
                                    name={isInWishlist ? "heart" : "heart-outline"}
                                    size={22}
                                    color={isInWishlist ? "#ef4444" : "white"}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* CONTENT SECTION */}
                    <View className="p-6">
                        <Text className="text-gray-500 dark:text-gray-400 font-bold tracking-widest uppercase text-xs">
                            {experience.category}
                        </Text>
                        <Text className="text-gray-900 dark:text-white font-extrabold text-3xl mt-2 leading-tight">
                            {experience.title}
                        </Text>

                        {/* RATING SECTION */}
                        <View className="flex-row items-center mt-4 gap-2">
                            <View className="flex-row">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Ionicons key={s} name="star" size={16} color={s <= Math.floor(experience.rating || 0) ? "#fbbf24" : "#4b5563"} />
                                ))}
                            </View>
                            <Text className="text-gray-900 dark:text-white font-bold text-lg">{experience.rating || '0.0'}</Text>
                            <Text className="text-gray-500 dark:text-gray-400 text-base">({experience.reviews || '0'} reviews)</Text>
                        </View>

                        {/* BADGES */}
                        {(experience.isOriginal || experience.certified) && (
                            <View className="flex-row flex-wrap gap-2 mt-4">
                                {experience.isOriginal && (
                                    <View className="flex-row items-center bg-orange-100 dark:bg-orange-950/30 px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-900/50">
                                        <Text className="text-orange-700 dark:text-orange-400 text-xs font-bold">TravellersDeal Original</Text>
                                    </View>
                                )}
                                {experience.certified && (
                                    <View className="flex-row items-center bg-blue-100 dark:bg-blue-950/30 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-900/50">
                                        <Ionicons name="shield-checkmark" size={14} color="#1d4ed8" className="mr-1" />
                                        <Text className="text-blue-700 dark:text-blue-400 text-xs font-bold">Certified Provider</Text>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* DATE SELECTION SECTION */}
                        <View className="mt-8">
                            <Text className="text-gray-900 dark:text-white font-extrabold text-xl mb-4">Select date</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ gap: 12 }}
                            >
                                {dates.map((d) => (
                                    <TouchableOpacity
                                        key={d.id}
                                        onPress={() => setSelectedDate(d.fullDate)}
                                        className={`w-16 h-20 rounded-2xl items-center justify-center border-2 ${selectedDate === d.fullDate
                                            ? 'bg-[#002b5c] border-[#002b5c] dark:bg-[#58a6ff] dark:border-[#58a6ff]'
                                            : 'bg-white dark:bg-[#1c1c1e] border-gray-100 dark:border-gray-800'
                                            }`}
                                    >
                                        <Text className={`text-[10px] font-bold uppercase ${selectedDate === d.fullDate ? 'text-blue-100 dark:text-white' : 'text-gray-400'
                                            }`}>
                                            {d.dayName}
                                        </Text>
                                        <Text className={`text-lg font-extrabold my-0.5 ${selectedDate === d.fullDate ? 'text-white' : 'text-gray-900 dark:text-white'
                                            }`}>
                                            {d.dayNumber}
                                        </Text>
                                        <Text className={`text-[10px] font-bold ${selectedDate === d.fullDate ? 'text-blue-100 dark:text-white' : 'text-gray-500'
                                            }`}>
                                            {d.month}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* QUICK INFO */}
                        <View className="mt-8 border-y border-gray-100 dark:border-gray-800 py-6">
                            <View className="flex-row items-center mb-4">
                                <Ionicons name="time-outline" size={24} color="#9ca3af" />
                                <View className="ml-4">
                                    <Text className="text-gray-900 dark:text-white font-bold">Duration</Text>
                                    <Text className="text-gray-500 dark:text-gray-400">{(experience.features || '').split('•')[0].trim() || 'Flexible'}</Text>
                                </View>
                            </View>
                            <View className="flex-row items-center">
                                <Ionicons name="flash-outline" size={24} color="#9ca3af" />
                                <View className="ml-4">
                                    <Text className="text-gray-900 dark:text-white font-bold">Booking</Text>
                                    <Text className="text-gray-500 dark:text-gray-400">Instant confirmation</Text>
                                </View>
                            </View>
                        </View>

                        {/* DESCRIPTION */}
                        <View className="mt-8">
                            <Text className="text-gray-900 dark:text-white font-extrabold text-xl mb-4">About this experience</Text>
                            <Text className="text-gray-600 dark:text-gray-300 leading-7 text-base">
                                {experience.description || "Discover the magic of this unforgettable journey. Guided by experts, you'll explore hidden gems and iconic landmarks, creating memories that will last a lifetime. Book your spot today and experience the very best that this destination has to offer."}
                            </Text>
                        </View>

                        <View className="h-24" />
                    </View>
                </ScrollView>

                {/* BOTTOM BOOKING BAR */}
                <View
                    style={{ paddingBottom: (insets?.bottom ?? 0) + 16 }}
                    className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#1c1c1e] border-t border-gray-100 dark:border-gray-800 px-6 pt-4 flex-row items-center justify-between"
                >
                    <View>
                        <Text className="text-gray-500 dark:text-gray-400 text-xs">Total from</Text>
                        <Text className="text-gray-900 dark:text-white font-extrabold text-2xl">₹{experience.price}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => setIsBookingFlowVisible(true)}
                        className={`px-10 py-4 rounded-full shadow-lg ${selectedDate ? 'bg-[#002b5c] dark:bg-[#58a6ff]' : 'bg-gray-300 dark:bg-gray-800'
                            }`}
                        disabled={!selectedDate}
                    >
                        <Text className={`font-bold text-lg ${selectedDate ? 'text-white' : 'text-gray-500'}`}>
                            {selectedDate ? 'Book Now' : 'Select a date'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <BookingFlow
                    visible={isBookingFlowVisible}
                    onClose={() => setIsBookingFlowVisible(false)}
                    experience={experience}
                    selectedDate={selectedDate}
                />
            </View>
        </Modal>
    );
}
