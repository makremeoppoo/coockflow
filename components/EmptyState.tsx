import styles from "@/app/styles";
import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface EmptyStateProps {
  onExplore: () => void;
}

export default function EmptyState({ onExplore }: EmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      <View style={{ marginBottom: 4 }}>
        <Ionicons name="restaurant-outline" size={56} color={COLORS.orangeLight} />
      </View>
      <Text style={styles.emptyText}>No recipes yet</Text>
      <TouchableOpacity onPress={onExplore} activeOpacity={0.7}>
        <Text style={styles.emptyLink}>Add your first one →</Text>
      </TouchableOpacity>
    </View>
  );
}
