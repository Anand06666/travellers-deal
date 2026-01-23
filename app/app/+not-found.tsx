import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-6xl font-bold text-blue-600">404</Text>

      <Text className="text-2xl font-bold mt-4">
        Page Not Found
      </Text>

      <Text className="text-gray-500 text-center mt-2">
        The page you are looking for doesn’t exist or has been moved.
      </Text>

      <TouchableOpacity
        onPress={() => router.replace("/(tabs)")}
        className="bg-blue-600 px-6 py-3 rounded-xl mt-6"
      >
        <Text className="text-white font-semibold">
          Go to Home
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
