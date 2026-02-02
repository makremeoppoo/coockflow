import { Dimensions, Platform, StyleSheet } from "react-native";
import { COLORS } from "../constants";
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
// A single tiny spoon+fork unit drawn with Views, repeated in a grid
const TILE_W = 90;
const TILE_H = 110;


// ─── BACKGROUND PATTERN STYLES ───────────────────────────────────────────────
export const bp = StyleSheet.create({
  patternRoot: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_W,
    height: SCREEN_H,
    zIndex: 0,
    overflow: 'hidden',
  },
  tile: {
    position: 'absolute',
    width: TILE_W,
    height: TILE_H,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    opacity: 0.055,
  },
  // Mini fork
  forkWrap: { alignItems: 'center' },
  forkTines: { flexDirection: 'row', gap: 2.5 },
  forkTine: { width: 2.5, height: 22, borderRadius: 1.5, backgroundColor: COLORS.blue },
  forkBase: { width: 14, height: 7, borderRadius: 4, backgroundColor: COLORS.blue, marginTop: -1 },
  forkHandle: { width: 3.5, height: 34, borderRadius: 2, backgroundColor: COLORS.blue },
  // Mini spoon
  spoonWrap: { alignItems: 'center' },
  spoonBowl: { width: 16, height: 22, borderRadius: 8, backgroundColor: COLORS.orange, alignItems: 'center', justifyContent: 'center' },
  spoonBowlInner: { width: 10, height: 15, borderRadius: 5, backgroundColor: COLORS.bg },
  spoonNeck: { width: 4, height: 7, backgroundColor: COLORS.orangeDark, borderRadius: 2, marginTop: -1 },
  spoonHandle: { width: 3.5, height: 34, borderRadius: 2, backgroundColor: COLORS.orangeDark },
});

const styles = StyleSheet.create({
  
    // New Style
    root: {
      flex: 1,
      backgroundColor: COLORS.bg,
    },
    content: {
      flex: 1,
      overflow: 'hidden',
    },
    scrollArea: {
      flex: 1,
      paddingHorizontal: 20,
      backgroundColor: COLORS.orangeMid,
    },

    // Page Header
    pageHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingTop: 20,
      paddingBottom: 20,
    },
    pageTitle: {
      fontSize: 26,
      fontWeight: '700',
      color: COLORS.text,
      letterSpacing: -0.5,
    },
    pageSubtitle: {
      fontSize: 13,
      color: COLORS.orange,
      marginTop: 2,
    },
    headerActionBtn: {
      marginTop: 2,
    },
  
    // ── RECIPE CARD ──
    card: {
      backgroundColor: COLORS.card,
      borderRadius: 18,
      padding: 18,
      marginBottom: 14,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    cardTopRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    cardEmojiWrap: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: COLORS.orange,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    cardEmoji: {
      fontSize: 35,
    },
    cardTitleBlock: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.text,
      lineHeight: 22,
      letterSpacing: -0.2,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 6,
      flexWrap: 'wrap',
      gap: 4,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      fontSize: 12,
      color: COLORS.textMuted,
    },
    metaDot: {
      width: 3,
      height: 3,
      borderRadius: 2,
      backgroundColor: COLORS.border,
    },
    deleteBtn: {
      padding: 4,
      flexShrink: 0,
    },
  
    // Tags
    tagRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 14,
    },
    tag: {
      backgroundColor: COLORS.orangeLight,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    tagText: {
      fontSize: 11,
      fontWeight: '500',
      color: COLORS.orange,
    },
  
    // Expand Toggle
    expandToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 14,
      paddingVertical: 8,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
    },
    expandText: {
      fontSize: 13,
      fontWeight: '600',
      color: COLORS.orange,
    },
  
    // Ingredients
    ingredientsList: {
      marginTop: 4,
      paddingBottom: 4,
    },
    ingredientRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 5,
      gap: 10,
    },
    ingredientDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: COLORS.orangeLight,
      borderWidth: 1.5,
      borderColor: COLORS.orange,
    },
    ingredientText: {
      fontSize: 13,
      color: COLORS.textSub,
    },
  
    // Card Actions
    cardActions: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 14,
    },
    actionBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: COLORS.orangeLight,
    },
    actionBtnText: {
      fontSize: 13,
      fontWeight: '600',
      color: COLORS.orange,
    },
    actionBtnSecondary: {
      backgroundColor: '#F4F4F5',
    },

    // Empty State
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 48,
      paddingHorizontal: 24,
    },
    emptyIconWrap: {
      marginBottom: 4,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.textSub,
      marginBottom: 8,
    },
    emptyLink: {
      fontSize: 15,
      fontWeight: '600',
      color: COLORS.orange,
    },

    // Explore unlock CTA (pill)
    exploreUnlockCta: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: COLORS.orangeLight,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 20,
      marginBottom: 14,
      gap: 8,
    },
    exploreUnlockCtaText: {
      fontSize: 14,
      fontWeight: '600',
      color: COLORS.orange,
    },
  
    // ── GROCERY ──
    clearChecked: {
      fontSize: 13,
      fontWeight: '600',
      color: COLORS.red,
    },
    progressWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 22,
    },
    progressBg: {
      flex: 1,
      height: 6,
      borderRadius: 3,
      backgroundColor: COLORS.border,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 3,
      backgroundColor: COLORS.green,
    },
    progressText: {
      fontSize: 12,
      fontWeight: '600',
      color: COLORS.textMuted,
      minWidth: 48,
      textAlign: 'right',
    },
    groceryGroupTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: COLORS.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 8,
      marginTop: 18,
    },
    groceryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.card,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 6,
      gap: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 2,
    },
    groceryItemChecked: {
      opacity: 0.5,
    },
    groceryCheckbox: {
      width: 22,
      height: 22,
      borderRadius: 7,
      borderWidth: 2,
      borderColor: COLORS.border,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    groceryCheckboxChecked: {
      backgroundColor: COLORS.green,
      borderColor: COLORS.green,
    },
    groceryContent: {
      flex: 1,
    },
    groceryText: {
      fontSize: 14,
      fontWeight: '500',
      color: COLORS.text,
    },
    groceryTextChecked: {
      textDecorationLine: 'line-through',
      color: COLORS.textMuted,
    },
    groceryFrom: {
      fontSize: 11,
      color: COLORS.textMuted,
      marginTop: 1,
    },
  
    // ── DISCOVER ──
    discoverCard: {
      backgroundColor: COLORS.card,
      borderRadius: 18,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    discoverIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: COLORS.orangeLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },
    discoverLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.text,
      marginBottom: 12,
    },
    discoverInputRow: {
      flexDirection: 'row',
      gap: 10,
    },
    discoverInput: {
      flex: 1,
      borderWidth: 1.5,
      borderColor: COLORS.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 11,
      justifyContent: 'center',
    },
    discoverInputPlaceholder: {
      fontSize: 13,
      color: COLORS.textMuted,
    },
    discoverExtractBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: COLORS.orange,
      paddingHorizontal: 18,
      borderRadius: 12,
    },
    discoverExtractText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#fff',
    },
    platformRow: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 14,
      flexWrap: 'wrap',
    },
    platformChip: {
      backgroundColor: COLORS.border,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 20,
    },
    platformChipText: {
      fontSize: 12,
      color: COLORS.textSub,
      fontWeight: '500',
    },
    tipCard: {
      backgroundColor: COLORS.card,
      borderRadius: 18,
      padding: 18,
      marginTop: 18,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    tipHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 14,
    },
    tipTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: COLORS.text,
    },
    tipRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 10,
    },
    tipNum: {
      fontSize: 12,
      fontWeight: '700',
      color: COLORS.orange,
      width: 18,
      flexShrink: 0,
    },
    tipText: {
      fontSize: 13,
      color: COLORS.textSub,
      lineHeight: 19,
    },
  
    // ── BOTTOM NAV ──
    bottomNav: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
      paddingVertical: 8,
      paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    },
    navItem: {
      flex: 1,
      alignItems: 'center',
      gap: 4,
    },
    navIconWrap: {
      position: 'relative',
      width: 80,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14,
    },
    navIconWrapActive: {
      backgroundColor: COLORS.orangeLight,
    },
    navBadge: {
      position: 'absolute',
      top: -2,
      right: -2,
      backgroundColor: COLORS.orange,
      borderRadius: 8,
      minWidth: 16,
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 3,
    },
    navBadgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: '#fff',
    },
    navLabel: {
      width: 80,
      textAlign: 'center',
      fontSize: 10,
      color: COLORS.textMuted,
      fontWeight: '500',
    },
    navLabelActive: {
      color: COLORS.orange,
      fontWeight: '600',
    },
  });
  export default styles;