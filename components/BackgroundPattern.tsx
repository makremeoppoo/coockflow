import { bp } from '@/app/styles';
import React from 'react';
import {
  Dimensions,
  View
} from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
// A single tiny spoon+fork unit drawn with Views, repeated in a grid
const TILE_W = 90;
const TILE_H = 110;
const COLS = Math.ceil(SCREEN_W / TILE_W) + 1;
const ROWS = Math.ceil(SCREEN_H / TILE_H) + 1;

const ForkIcon = () => (
  <View style={bp.forkWrap}>
    <View style={bp.forkTines}>
      <View style={bp.forkTine} />
      <View style={bp.forkTine} />
      <View style={bp.forkTine} />
      <View style={bp.forkTine} />
    </View>
    <View style={bp.forkBase} />
    <View style={bp.forkHandle} />
  </View>
);

const SpoonIcon = () => (
  <View style={bp.spoonWrap}>
    <View style={bp.spoonBowl}>
      <View style={bp.spoonBowlInner} />
    </View>
    <View style={bp.spoonNeck} />
    <View style={bp.spoonHandle} />
  </View>
);

const BackgroundPattern = () => {
  const tiles = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      // Alternate orientation every other tile for rhythm
      const flipped = (r + c) % 2 === 1;
      tiles.push(
        <View
          key={`${r}-${c}`}
          style={[
            bp.tile,
            { top: r * TILE_H, left: c * TILE_W },
            flipped && { transform: [{ rotate: '180deg' }] },
          ]}
        >
          <ForkIcon />
          <SpoonIcon />
        </View>
      );
    }
  }
  return <View style={bp.patternRoot}>{tiles}</View>;
};

export default BackgroundPattern;