import styles from "@/app/styles";
import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PLATFORMS = ["YouTube", "TikTok", "Instagram", "Web"];

type DiscoverInputCardProps = {
  videoUrl: string;
  onVideoUrlChange: (value: string) => void;
  isExtracting: boolean;
  onExtract: () => void;
  disabled?: boolean;
};

export default function DiscoverInputCard({
  videoUrl,
  onVideoUrlChange,
  isExtracting,
  onExtract,
  disabled,
}: DiscoverInputCardProps) {
  return (
    <View style={styles.discoverCard}>
      <View style={styles.discoverIconWrap}>
        <Ionicons name="link" size={22} color={COLORS.orange} />
      </View>
      <Text style={styles.discoverLabel}>Recipe Video URL</Text>
      <View style={styles.discoverInputRow}>
        <TextInput
          style={styles.discoverInput}
          value={videoUrl}
          onChangeText={onVideoUrlChange}
          placeholder="https://youtube.com/watch?v=..."
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={[
            styles.discoverExtractBtn,
            { paddingVertical: 14 },
            disabled && { opacity: 0.5 },
          ]}
          onPress={onExtract}
          disabled={disabled}
          activeOpacity={0.8}
        >
          {isExtracting ? (
            <>
              <ActivityIndicator color="#fff" size="small" style={{ marginRight: 8 }} />
              <Text style={styles.discoverExtractText}>Extracting...</Text>
            </>
          ) : (
            <>
              <Ionicons name="sparkles" size={18} color="#fff" />
              <Text style={styles.discoverExtractText}>Extract</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.platformRow}>
        {PLATFORMS.map((name) => (
          <View key={name} style={styles.platformChip}>
            <Text style={styles.platformChipText}>{name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
