import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_MONTH = "extractionsMonth";
const KEY_COUNT = "extractionsCount";
const FREE_LIMIT = 3;

function getCurrentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function getFreeExtractionsUsed(): Promise<number> {
  try {
    const [storedMonth, countStr] = await Promise.all([
      AsyncStorage.getItem(KEY_MONTH),
      AsyncStorage.getItem(KEY_COUNT),
    ]);
    const currentMonth = getCurrentMonth();
    if (storedMonth !== currentMonth) return 0;
    const count = parseInt(countStr ?? "0", 10);
    return isNaN(count) ? 0 : count;
  } catch {
    return 0;
  }
}

export async function incrementFreeExtractions(): Promise<number> {
  const currentMonth = getCurrentMonth();
  const used = await getFreeExtractionsUsed();
  const newCount = used + 1;
  await AsyncStorage.multiSet([
    [KEY_MONTH, currentMonth],
    [KEY_COUNT, String(newCount)],
  ]);
  return newCount;
}

export const FREE_EXTRACTION_LIMIT = FREE_LIMIT;

export async function canExtractFree(isPro: boolean): Promise<{ allowed: boolean; used: number; limit: number }> {
  if (isPro) return { allowed: true, used: 0, limit: FREE_LIMIT };
  const used = await getFreeExtractionsUsed();
  return { allowed: used < FREE_LIMIT, used, limit: FREE_LIMIT };
}
