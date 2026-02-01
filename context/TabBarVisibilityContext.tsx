import { createContext, useCallback, useContext, useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

type TabBarVisibilityContextType = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const TabBarVisibilityContext = createContext<TabBarVisibilityContextType | null>(null);

const SCROLL_THRESHOLD = 8;
const MIN_SCROLL = 20;

export function TabBarVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true);
  return (
    <TabBarVisibilityContext.Provider value={{ visible, setVisible }}>
      {children}
    </TabBarVisibilityContext.Provider>
  );
}

export function useTabBarVisibility() {
  const ctx = useContext(TabBarVisibilityContext);
  if (!ctx) return { visible: true, setVisible: () => {} };
  return ctx;
}

export function useScrollToHideTabBar() {
  const { setVisible } = useTabBarVisibility();
  const lastY = useRef(0);
  const lastDirection = useRef<"up" | "down" | null>(null);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const dy = y - lastY.current;
      lastY.current = y;

      if (Math.abs(dy) < SCROLL_THRESHOLD) return;
      const direction = dy > 0 ? "down" : "up";
      if (direction !== lastDirection.current) {
        lastDirection.current = direction;
        if (Math.abs(dy) >= MIN_SCROLL) {
          setVisible(direction === "up");
        }
      }
    },
    [setVisible]
  );

  return { onScroll };
}
