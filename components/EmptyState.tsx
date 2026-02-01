import styles from "@/app/styles";
import { Ionicons } from "@expo/vector-icons";
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface EmptyStateProps {
  onExplore: () => void;
}

const EmptyState = ({ onExplore }: EmptyStateProps) => (
  <View style={styles.emptyState}>
    <Ionicons name="camera-outline" size={64} color="#fed7aa" />
    <Text style={styles.emptyText}>No recipes yet</Text>
    <TouchableOpacity onPress={onExplore}>
      <Text style={styles.emptyLink}>Add your first one →</Text>
    </TouchableOpacity>
  </View>
);

export default EmptyState;
