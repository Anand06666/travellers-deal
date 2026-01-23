import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../constants/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ReviewFormProps {
    visible: boolean;
    onClose: () => void;
    experienceId: string;
    experienceTitle: string;
    onReviewSubmitted?: () => void;
}

export default function ReviewForm({ visible, onClose, experienceId, experienceTitle, onReviewSubmitted }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            Alert.alert('Rating Required', 'Please select a rating before submitting');
            return;
        }

        if (comment.trim().length < 10) {
            Alert.alert('Comment Too Short', 'Please write at least 10 characters in your review');
            return;
        }

        setSubmitting(true);
        try {
            const userInfo = await AsyncStorage.getItem('userInfo');
            if (!userInfo) {
                Alert.alert('Login Required', 'Please login to submit a review');
                return;
            }
            const { token } = JSON.parse(userInfo);

            const response = await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    experienceId,
                    rating,
                    comment: comment.trim()
                })
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Your review has been submitted!');
                setRating(0);
                setComment('');
                onReviewSubmitted?.();
                onClose();
            } else {
                Alert.alert('Error', data.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            Alert.alert('Error', 'Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-white dark:bg-black">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <Text className="text-xl font-bold text-gray-900 dark:text-white">Write a Review</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={28} color="#6b7280" />
                    </TouchableOpacity>
                </View>

                <View className="flex-1 px-6 py-8">
                    {/* Experience Title */}
                    <Text className="text-gray-500 dark:text-gray-400 text-sm mb-2">Reviewing</Text>
                    <Text className="text-gray-900 dark:text-white font-bold text-lg mb-8">{experienceTitle}</Text>

                    {/* Rating Section */}
                    <Text className="text-gray-900 dark:text-white font-bold text-base mb-4">Your Rating</Text>
                    <View className="flex-row gap-3 mb-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                                key={star}
                                onPress={() => setRating(star)}
                                className="p-2"
                            >
                                <Ionicons
                                    name={star <= rating ? "star" : "star-outline"}
                                    size={40}
                                    color={star <= rating ? "#fbbf24" : "#d1d5db"}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {rating > 0 && (
                        <Text className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                            {rating === 1 && "Poor"}
                            {rating === 2 && "Fair"}
                            {rating === 3 && "Good"}
                            {rating === 4 && "Very Good"}
                            {rating === 5 && "Excellent"}
                        </Text>
                    )}

                    {/* Comment Section */}
                    <Text className="text-gray-900 dark:text-white font-bold text-base mb-4">Your Review</Text>
                    <TextInput
                        placeholder="Share your experience with others..."
                        placeholderTextColor="#9ca3af"
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                        className="bg-gray-50 dark:bg-[#1c1c1e] border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-gray-900 dark:text-white text-base"
                        value={comment}
                        onChangeText={setComment}
                        maxLength={500}
                    />
                    <Text className="text-gray-400 text-xs mt-2 text-right">{comment.length}/500</Text>
                </View>

                {/* Submit Button */}
                <View className="px-6 pb-8 border-t border-gray-100 dark:border-gray-800 pt-4">
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={submitting || rating === 0}
                        className={`py-4 rounded-full ${rating === 0 || submitting ? 'bg-gray-300 dark:bg-gray-700' : 'bg-[#002b5c] dark:bg-[#58a6ff]'}`}
                    >
                        {submitting ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text className={`text-center font-bold text-lg ${rating === 0 ? 'text-gray-500' : 'text-white'}`}>
                                Submit Review
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
