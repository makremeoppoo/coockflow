import { COLORS } from "@/constants";
import { usePremium } from "@/context/PremiumContext";
import { getCustomerInfo, getOfferings, purchasePackage, restorePurchases } from "@/lib/revenuecat";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PRO_FEATURES = [
  "Unlimited recipe extractions from video links",
  "Unlimited saved recipes",
  "Export grocery list",
  "Support development",
];

type PaywallModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function PaywallModal({ visible, onClose }: PaywallModalProps) {
  const { refresh, isPro, isAvailable } = usePremium();
  const [packages, setPackages] = useState<Array<{ identifier: string; title: string; priceString: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const loadOfferings = useCallback(async () => {
    setLoading(true);
    const offerings = await getOfferings();
    setPackages(
      offerings?.packages?.map((p) => ({
        identifier: p.identifier,
        title: p.product.title,
        priceString: p.product.priceString,
      })) ?? []
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    if (visible && isAvailable) loadOfferings();
  }, [visible, isAvailable, loadOfferings]);

  useEffect(() => {
    if (isPro && visible) {
      onClose();
    }
  }, [isPro, visible, onClose]);

  const handlePurchase = async (identifier: string) => {
    setPurchasing(identifier);
    const timeout = setTimeout(() => setPurchasing(null), 15000);
    try {
      const { success, error } = await purchasePackage(identifier);
      clearTimeout(timeout);
      setPurchasing(null);
      await refresh();
      // Test Store often returns success: false even when purchase completed; re-fetch after a short delay.
      await new Promise((r) => setTimeout(r, 800));
      const { entitlementActive } = await getCustomerInfo();
      if (success || entitlementActive) {
        onClose();
      } else if (error && error !== "cancelled") {
        Alert.alert("Purchase failed", error);
      }
    } catch {
      clearTimeout(timeout);
      setPurchasing(null);
      await refresh();
      const { entitlementActive } = await getCustomerInfo();
      if (entitlementActive) onClose();
    }
  };

  const handleRestore = async () => {
    setPurchasing("restore");
    const { entitlementActive } = await restorePurchases();
    setPurchasing(null);
    await refresh();
    if (entitlementActive) {
      onClose();
      Alert.alert("Restored", "Your purchase has been restored.");
    } else {
      Alert.alert("No purchase found", "We couldn't find a previous purchase to restore.");
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }} onPress={onClose} />
        <View
          style={{
            backgroundColor: COLORS.card,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 24,
            paddingBottom: 40,
            paddingHorizontal: 24,
            maxHeight: "85%",
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Text style={{ fontSize: 22, fontWeight: "700", color: COLORS.text }}>Cookflow Pro</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={28} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 15, color: COLORS.textSub, marginBottom: 20 }}>
            Unlock unlimited recipe extractions and get the most out of Cookflow.
          </Text>
          <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
            {PRO_FEATURES.map((f, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.orange} style={{ marginRight: 10 }} />
                <Text style={{ fontSize: 14, color: COLORS.text, flex: 1 }}>{f}</Text>
              </View>
            ))}
          </ScrollView>
          {!isAvailable ? (
            <Text style={{ fontSize: 13, color: COLORS.textMuted, textAlign: "center", marginTop: 16 }}>
              In-app purchases require a development build. Run with expo run:ios or expo run:android.
            </Text>
          ) : loading ? (
            <ActivityIndicator size="small" color={COLORS.orange} style={{ marginTop: 24 }} />
          ) : (
            <>
              {packages.map((pkg) => (
                <TouchableOpacity
                  key={pkg.identifier}
                  onPress={() => handlePurchase(pkg.identifier)}
                  disabled={purchasing !== null}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: COLORS.orange,
                    paddingVertical: 16,
                    borderRadius: 14,
                    alignItems: "center",
                    marginTop: 12,
                  }}
                >
                  {purchasing === pkg.identifier ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={{ fontSize: 16, fontWeight: "600", color: "#fff" }}>
                      {pkg.title} — {pkg.priceString}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={handleRestore}
                disabled={purchasing !== null}
                style={{ alignItems: "center", marginTop: 16 }}
              >
                {purchasing === "restore" ? (
                  <ActivityIndicator size="small" color={COLORS.orange} />
                ) : (
                  <Text style={{ fontSize: 15, fontWeight: "600", color: COLORS.orange }}>Restore purchases</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
