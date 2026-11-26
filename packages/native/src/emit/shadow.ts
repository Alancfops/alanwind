import type { ShadowLayer, StyleMap } from '@alanwind/core';
import type { BoxShadowValue, ViewStyle } from 'react-native';
import { emitColor } from './color';

function emitShadowLayer(layer: ShadowLayer): BoxShadowValue {
  return {
    offsetX: layer.offsetX,
    offsetY: layer.offsetY,
    blurRadius: layer.blur,
    spreadDistance: layer.spread,
    color: emitColor(layer.color),
  };
}

// R18, D108, D155: one `boxShadow` entry per IR layer, same order; never the
// legacy `shadow*` or `elevation` properties.
export function emitShadow(d: StyleMap): Pick<ViewStyle, 'boxShadow'> {
  return d.boxShadow === undefined
    ? {}
    : { boxShadow: d.boxShadow.map(emitShadowLayer) };
}
