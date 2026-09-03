/**
 * 人体肌群区域定义。
 *
 * 说明：这是**示意图**而非解剖插画。目标是让人一眼看出「哪块肌肉在发力」，
 * 位置按主要肌群的大致解剖位置摆放，不追求肌纤维走向与轮廓的精确还原。
 *
 * 形状用简单图元描述（rect / ellipse / path），由 BodyMuscleMap 渲染。
 * 每个肌群可包含左右两个对称图元。
 */

/** 人体轮廓（不参与发力着色，仅提供人形骨架） */
export const BODY_BASE = {
  front: [
    { tag: 'circle', cx: 60, cy: 19, r: 13 }, // 头
    { tag: 'rect', x: 54, y: 31, width: 12, height: 8, rx: 3 }, // 颈
    { tag: 'rect', x: 46, y: 110, width: 28, height: 18, rx: 6 }, // 髋
    { tag: 'rect', x: 46, y: 172, width: 12, height: 32, rx: 5 }, // 左小腿
    { tag: 'rect', x: 62, y: 172, width: 12, height: 32, rx: 5 }, // 右小腿
    { tag: 'rect', x: 43, y: 202, width: 16, height: 6, rx: 3 }, // 左脚
    { tag: 'rect', x: 61, y: 202, width: 16, height: 6, rx: 3 }, // 右脚
  ],
  back: [
    { tag: 'circle', cx: 60, cy: 19, r: 13 },
    { tag: 'rect', x: 54, y: 31, width: 12, height: 8, rx: 3 },
    { tag: 'rect', x: 43, y: 202, width: 16, height: 6, rx: 3 },
    { tag: 'rect', x: 61, y: 202, width: 16, height: 6, rx: 3 },
  ],
}

/**
 * 正面可见肌群。
 * @type {Array<{id: string, label: string, shapes: Array<object>}>}
 */
export const FRONT_MUSCLES = [
  {
    id: 'trapsUpper',
    label: '上斜方肌',
    shapes: [
      { tag: 'path', d: 'M47 39 L59 36 L59 44 L45 47 Z' },
      { tag: 'path', d: 'M73 39 L61 36 L61 44 L75 47 Z' },
    ],
  },
  {
    // 简化取舍：前束与中束在示意图尺寸下画成两块会重叠成一团，
    // 合并为一个肩部区域，推举与侧平举都用它。
    id: 'delt',
    label: '三角肌（前/中束）',
    shapes: [
      { tag: 'ellipse', cx: 33, cy: 53, rx: 11, ry: 12 },
      { tag: 'ellipse', cx: 87, cy: 53, rx: 11, ry: 12 },
    ],
  },
  {
    id: 'chest',
    label: '胸大肌',
    shapes: [
      { tag: 'path', d: 'M42 46 Q59 42 59 42 L59 73 Q46 77 40 65 Q39 53 42 46 Z' },
      { tag: 'path', d: 'M78 46 Q61 42 61 42 L61 73 Q74 77 80 65 Q81 53 78 46 Z' },
    ],
  },
  {
    id: 'biceps',
    label: '肱二头肌',
    shapes: [
      { tag: 'rect', x: 24, y: 63, width: 12, height: 30, rx: 6 },
      { tag: 'rect', x: 84, y: 63, width: 12, height: 30, rx: 6 },
    ],
  },
  {
    id: 'forearm',
    label: '前臂',
    shapes: [
      { tag: 'rect', x: 23, y: 94, width: 11, height: 26, rx: 5 },
      { tag: 'rect', x: 86, y: 94, width: 11, height: 26, rx: 5 },
    ],
  },
  {
    id: 'abs',
    label: '腹直肌',
    shapes: [{ tag: 'rect', x: 49, y: 75, width: 22, height: 34, rx: 6 }],
  },
  {
    id: 'obliques',
    label: '腹斜肌',
    shapes: [
      { tag: 'path', d: 'M41 76 L48 76 L48 106 L43 102 Z' },
      { tag: 'path', d: 'M79 76 L72 76 L72 106 L77 102 Z' },
    ],
  },
  {
    id: 'quads',
    label: '股四头肌',
    shapes: [
      { tag: 'rect', x: 45, y: 128, width: 13, height: 44, rx: 6 },
      { tag: 'rect', x: 62, y: 128, width: 13, height: 44, rx: 6 },
    ],
  },
]

/**
 * 背面可见肌群。
 * @type {Array<{id: string, label: string, shapes: Array<object>}>}
 */
export const BACK_MUSCLES = [
  {
    id: 'trapsUpper',
    label: '斜方肌',
    shapes: [{ tag: 'path', d: 'M46 39 L60 36 L74 39 L70 64 L60 68 L50 64 Z' }],
  },
  {
    id: 'deltRear',
    label: '三角肌后束',
    shapes: [
      { tag: 'ellipse', cx: 33, cy: 53, rx: 11, ry: 12 },
      { tag: 'ellipse', cx: 87, cy: 53, rx: 11, ry: 12 },
    ],
  },
  {
    id: 'lats',
    label: '背阔肌',
    shapes: [
      { tag: 'path', d: 'M42 58 L57 64 L57 96 L47 92 Q40 78 42 58 Z' },
      { tag: 'path', d: 'M78 58 L63 64 L63 96 L73 92 Q80 78 78 58 Z' },
    ],
  },
  {
    id: 'triceps',
    label: '肱三头肌',
    shapes: [
      { tag: 'rect', x: 24, y: 63, width: 12, height: 30, rx: 6 },
      { tag: 'rect', x: 84, y: 63, width: 12, height: 30, rx: 6 },
    ],
  },
  {
    id: 'forearm',
    label: '前臂',
    shapes: [
      { tag: 'rect', x: 23, y: 94, width: 11, height: 26, rx: 5 },
      { tag: 'rect', x: 86, y: 94, width: 11, height: 26, rx: 5 },
    ],
  },
  {
    id: 'lowerBack',
    label: '下背竖脊肌',
    shapes: [{ tag: 'rect', x: 51, y: 92, width: 18, height: 22, rx: 5 }],
  },
  {
    id: 'glutes',
    label: '臀大肌',
    shapes: [
      { tag: 'ellipse', cx: 52, cy: 124, rx: 10, ry: 11 },
      { tag: 'ellipse', cx: 68, cy: 124, rx: 10, ry: 11 },
    ],
  },
  {
    id: 'hamstrings',
    label: '股二头肌',
    shapes: [
      { tag: 'rect', x: 45, y: 136, width: 13, height: 38, rx: 6 },
      { tag: 'rect', x: 62, y: 136, width: 13, height: 38, rx: 6 },
    ],
  },
  {
    id: 'calves',
    label: '小腿三头肌',
    shapes: [
      { tag: 'rect', x: 46, y: 176, width: 12, height: 26, rx: 5 },
      { tag: 'rect', x: 62, y: 176, width: 12, height: 26, rx: 5 },
    ],
  },
]

/** id → 中文名，用于图例与「在另一面」提示 */
export const MUSCLE_LABELS = Object.fromEntries(
  [...FRONT_MUSCLES, ...BACK_MUSCLES].map((m) => [m.id, m.label]),
)

/** 每个肌群出现在哪些面，用于判断需不需要提示用户翻面 */
export const MUSCLE_VIEWS = (() => {
  const map = {}
  for (const m of FRONT_MUSCLES) (map[m.id] ??= []).push('front')
  for (const m of BACK_MUSCLES) (map[m.id] ??= []).push('back')
  return map
})()
