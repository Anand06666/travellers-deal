import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ExperienceDetail from "../components/ExperienceDetail";
import { API_URL } from "../constants/Config";
import { formatPrice } from "../utils/currency";
import { useColorScheme } from "nativewind";

const { width, height } = Dimensions.get('window');

const FILTERS = {
    interests: ["Tours", "Tickets", "Day Trips", "Food", "Nature", "Adventure", "Sightseeing", "Culture", "Sports"],
    prices: [
        { label: "Under $50", min: 0, max: 50 },
        { label: "$50 - $100", min: 50, max: 100 },
        { label: "$100 - $200", min: 100, max: 200 },
        { label: "Over $200", min: 200, max: 10000 },
    ]
};

export default function SearchScreen() {
    const { colorScheme } = useColorScheme();
    const params = useLocalSearchParams();
    const [query, setQuery] = useState(params.query as string || '');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
    const [selectedExperience, setSelectedExperience] = useState<any | null>(null);

    // Filters
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
    const [selectedPriceIdx, setSelectedPriceIdx] = useState<number | null>(null);

    const insets = useSafeAreaInsets();
    const router = useRouter();

    useEffect(() => {
        if (params.query) {
            setQuery(params.query as string);
            fetchResults();
        }
        fetchWishlistIds();
    }, [params.query]);

    useEffect(() => {
        fetchResults();
    }, [selectedCategories, selectedPriceIdx]);

    const fetchWishlistIds = async () => {
        try {
            const userInfo = await AsyncStorage.getItem('userInfo');
            if (!userInfo) return;
            const { token } = JSON.parse(userInfo);

            const response = await fetch(`${API_URL}/users/wishlist`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok && Array.isArray(data)) {
                setWishlistIds(new Set(data.map((item: any) => item._id)));
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    };

    const fetchResults = async () => {
        setLoading(true);
        try {
            let url = `${API_URL}/experiences?pageNumber=1`;
            if (query) url += `&keyword=${encodeURIComponent(query)}`;

            if (selectedCategories.size > 0) {
                url += `&category=${Array.from(selectedCategories).join(',')}`;
            }

            if (selectedPriceIdx !== null) {
                const priceRange = FILTERS.prices[selectedPriceIdx];
                url += `&minPrice=${priceRange.min}&maxPrice=${priceRange.max}`;
            }

            const response = await fetch(url);
            const data = await response.json();
            setResults(data.experiences || []);
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleWishlist = async (experienceId: string) => {
        try {
            const userInfo = await AsyncStorage.getItem('userInfo');
            if (!userInfo) {
                router.push("/(auth)/login");
                return;
            }
            const { token } = JSON.parse(userInfo);
            const isInWishlist = wishlistIds.has(experienceId);

            setWishlistIds(prev => {
                const next = new Set(prev);
                if (isInWishlist) next.delete(experienceId);
                else next.add(experienceId);
                return next;
            });

            const method = isInWishlist ? 'DELETE' : 'POST';
            await fetch(`${API_URL}/users/wishlist/${experienceId}`, {
                method,
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Error toggling wishlist:", error);
            fetchWishlistIds();
        }
    };

    const renderCard = ({ item }: { item: any }) => {
        const isLiked = wishlistIds.has(item._id);
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setSelectedExperience(item)}
                className="bg-white dark:bg-[#1c1c1e] rounded-2xl overflow-hidden mb-4 shadow-sm border border-gray-100 dark:border-gray-800"
            >
                <View className="relative">
                    <Image source={{ uri: item.images?.[0] || 'https://via.placeholder.com/400x300' }} className="w-full h-48" />
                    <TouchableOpacity
                        onPress={() => toggleWishlist(item._id)}
                        className="absolute top-3 right-3 w-9 h-9 bg-white dark:bg-gray-800 rounded-full items-center justify-center shadow-lg"
                    >
                        <Ionicons name={isLiked ? "heart" : "heart-outline"} size={20} color={isLiked ? "#ef4444" : "#6b7280"} />
                    </TouchableOpacity>
                    <View className="absolute top-3 left-3 bg-gray-900/80 px-2 py-1 rounded-md">
                        <Text className="text-white text-[10px] font-bold uppercase">{item.category}</Text>
                    </View>
                </View>

                <View className="p-4">
                    <Text className="text-gray-900 dark:text-white font-bold text-lg leading-tight mb-2" numberOfLines={2}>{item.title}</Text>

                    <View className="flex-row items-center mb-2">
                        <Ionicons name="location-outline" size={14} color="#6b7280" />
                        <Text className="text-gray-500 text-xs ml-1">{item.location?.city || 'Unknown'}</Text>
                    </View>

                    <View className="flex-row items-center justify-between mt-2">
                        <View className="flex-row items-center gap-1">
                            <Ionicons name="star" size={14} color="#fbbf24" />
                            <Text className="font-bold text-sm dark:text-white">{item.rating || 0}</Text>
                            <Text className="text-gray-400 text-xs">({item.numReviews || 0})</Text>
                        </View>
                        <View>
                            <Text className="text-xs text-gray-400 text-right">From</Text>
                            <Text className="font-extrabold text-lg dark:text-white">{formatPrice(item.price, item.currency)}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 bg-gray-50 dark:bg-black" style={{ paddingTop: insets.top }}>
            {/* Header */}
            <View className="px-4 py-3 flex-row items-center bg-white dark:bg-[#1c1c1e] border-b border-gray-100 dark:border-gray-800">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Ionicons name="arrow-back" size={24} color={Platform.OS === 'ios' ? '#007AFF' : (colorScheme === 'dark' ? '#fff' : '#000')} />
                </TouchableOpacity>
                <View className="flex-1 flex-row items-center bg-gray-100 dark:bg-gray-900 rounded-lg px-3 h-10">
                    <Ionicons name="search" size={18} color="#9ca3af" />
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        onSubmitEditing={() => fetchResults()}
                        placeholder="Where to?"
                        className="flex-1 ml-2 text-base dark:text-white"
                        returnKeyType="search"
                        placeholderTextColor="#9ca3af"
                    />
                </View>
                <TouchableOpacity onPress={() => setShowFilters(true)} className="ml-3 p-2">
                    <Ionicons name="options-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                </TouchableOpacity>
            </View>

            {/* Content */}
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#002b5c" />
                </View>
            ) : (
                <FlatList
                    data={results}
                    renderItem={renderCard}
                    keyExtractor={(item: any) => item._id}
                    contentContainerStyle={{ padding: 16 }}
                    ListHeaderComponent={
                        <View className="mb-4">
                            <Text className="text-2xl font-bold dark:text-white">Results for "{query}"</Text>
                            <Text className="text-gray-500">{results.length} experiences found</Text>
                        </View>
                    }
                    ListEmptyComponent={
                        <View className="items-center mt-20">
                            <Ionicons name="search-outline" size={64} color="#d1d5db" />
                            <Text className="text-gray-500 mt-4 text-center">No results found for "{query}".{'\n'}Try adjusting your filters.</Text>
                        </View>
                    }
                />
            )}

            {/* Filter Modal */}
            <Modal
                visible={showFilters}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowFilters(false)}
            >
                <View className="flex-1 bg-white dark:bg-[#1c1c1e]">
                    <View className="px-5 py-4 flex-row items-center justify-between border-b border-gray-100 dark:border-gray-800">
                        <Text className="text-xl font-bold dark:text-white">Filters</Text>
                        <TouchableOpacity onPress={() => setShowFilters(false)}>
                            <Ionicons name="close" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 p-5">
                        <Text className="font-bold mb-4 text-gray-900 dark:text-white uppercase tracking-wider text-xs">Interests</Text>
                        <View className="flex-row flex-wrap gap-2 mb-8">
                            {FILTERS.interests.map(cat => (
                                <TouchableOpacity
                                    key={cat}
                                    onPress={() => {
                                        const newSet = new Set(selectedCategories);
                                        if (newSet.has(cat)) newSet.delete(cat);
                                        else newSet.add(cat);
                                        setSelectedCategories(newSet);
                                    }}
                                    className={`px-4 py-2 rounded-full border ${selectedCategories.has(cat)
                                        ? 'bg-black border-black dark:bg-white dark:border-white'
                                        : 'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-700'
                                        }`}
                                >
                                    <Text className={selectedCategories.has(cat) ? "text-white dark:text-black font-medium" : "text-gray-700 dark:text-gray-300"}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text className="font-bold mb-4 text-gray-900 dark:text-white uppercase tracking-wider text-xs">Price</Text>
                        <View className="gap-3 mb-8">
                            {FILTERS.prices.map((price, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    onPress={() => setSelectedPriceIdx(selectedPriceIdx === idx ? null : idx)}
                                    className="flex-row items-center"
                                >
                                    <View className={`w-5 h-5 rounded border mr-3 items-center justify-center ${selectedPriceIdx === idx ? 'bg-black border-black dark:bg-white dark:border-white' : 'border-gray-300'
                                        }`}>
                                        {selectedPriceIdx === idx && <Ionicons name="checkmark" size={14} color="white" />}
                                    </View>
                                    <Text className="text-lg text-gray-800 dark:text-white">{price.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <View className="p-5 border-t border-gray-100 dark:border-gray-800">
                        <TouchableOpacity
                            onPress={() => setShowFilters(false)}
                            className="bg-black dark:bg-white w-full py-4 rounded-xl items-center"
                        >
                            <Text className="text-white dark:text-black font-bold text-lg">Show Results</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <ExperienceDetail
                visible={!!selectedExperience}
                experience={selectedExperience}
                onClose={() => setSelectedExperience(null)}
            />
        </View>
    );
}
