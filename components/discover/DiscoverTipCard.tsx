import styles from "@/app/styles";
import { Text, View } from "react-native";

export type TipRow = {
  num: string;
  text: string;
};

type DiscoverTipCardProps = {
  title: string;
  items: TipRow[];
};

export default function DiscoverTipCard({ title, items }: DiscoverTipCardProps) {
  return (
    <View style={styles.tipCard}>
      <View style={styles.tipHeader}>
        <Text style={styles.tipTitle}>{title}</Text>
      </View>
      {items.map((row, index) => (
        <View key={index} style={styles.tipRow}>
          <Text style={styles.tipNum}>{row.num}</Text>
          <Text style={styles.tipText}>{row.text}</Text>
        </View>
      ))}
    </View>
  );
}
