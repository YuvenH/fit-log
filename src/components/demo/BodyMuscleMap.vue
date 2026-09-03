<script setup>
/**
 * 人体肌群示意图。
 * 按「主要发力 / 协同发力 / 参与稳定」三级着色，主要发力肌群随动作节奏脉冲。
 */
import { computed } from 'vue'
import {
  BODY_BASE,
  FRONT_MUSCLES,
  BACK_MUSCLES,
} from '../../demo/muscles.js'

const props = defineProps({
  view: { type: String, default: 'front' },
  primary: { type: Array, default: () => [] },
  secondary: { type: Array, default: () => [] },
  stabilizer: { type: Array, default: () => [] },
  /** 动画周期，与轨迹动画保持一致才能同步 */
  duration: { type: Number, default: 3 },
})

const muscles = computed(() => (props.view === 'back' ? BACK_MUSCLES : FRONT_MUSCLES))
const baseShapes = computed(() => BODY_BASE[props.view] ?? BODY_BASE.front)

/** 肌群的发力等级，决定颜色与是否脉冲 */
function levelOf(id) {
  if (props.primary.includes(id)) return 'primary'
  if (props.secondary.includes(id)) return 'secondary'
  if (props.stabilizer.includes(id)) return 'stabilizer'
  return 'idle'
}
</script>

<template>
  <svg
    class="body"
    viewBox="0 0 120 212"
    :style="{ '--cycle': `${duration}s` }"
    role="img"
    :aria-label="view === 'back' ? '背面发力肌群示意' : '正面发力肌群示意'"
  >
    <!-- 人形骨架，不参与着色 -->
    <g class="base">
      <template v-for="(shape, i) in baseShapes" :key="`base-${i}`">
        <circle
          v-if="shape.tag === 'circle'"
          :cx="shape.cx"
          :cy="shape.cy"
          :r="shape.r"
        />
        <ellipse
          v-else-if="shape.tag === 'ellipse'"
          :cx="shape.cx"
          :cy="shape.cy"
          :rx="shape.rx"
          :ry="shape.ry"
        />
        <rect
          v-else-if="shape.tag === 'rect'"
          :x="shape.x"
          :y="shape.y"
          :width="shape.width"
          :height="shape.height"
          :rx="shape.rx"
        />
        <path v-else :d="shape.d" />
      </template>
    </g>

    <!-- 肌群区域 -->
    <g v-for="muscle in muscles" :key="muscle.id" :class="['muscle', `is-${levelOf(muscle.id)}`]">
      <template v-for="(shape, i) in muscle.shapes" :key="`${muscle.id}-${i}`">
        <circle
          v-if="shape.tag === 'circle'"
          :cx="shape.cx"
          :cy="shape.cy"
          :r="shape.r"
        />
        <ellipse
          v-else-if="shape.tag === 'ellipse'"
          :cx="shape.cx"
          :cy="shape.cy"
          :rx="shape.rx"
          :ry="shape.ry"
        />
        <rect
          v-else-if="shape.tag === 'rect'"
          :x="shape.x"
          :y="shape.y"
          :width="shape.width"
          :height="shape.height"
          :rx="shape.rx"
        />
        <path v-else :d="shape.d" />
      </template>
    </g>
  </svg>
</template>

<style scoped>
.body {
  width: 100%;
  height: auto;
  display: block;
}

.base {
  fill: #2a3040;
}

.muscle {
  fill: #2a3040;
  transition: fill 0.2s linear;
}

/* 参与稳定：比静息稍亮的中性色，不用暖色以免与发力状态混淆 */
.muscle.is-stabilizer {
  fill: #3d465c;
}

.muscle.is-secondary {
  animation: pulse-secondary var(--cycle) ease-in-out infinite;
}

.muscle.is-primary {
  animation: pulse-primary var(--cycle) ease-in-out infinite;
}

/* 0% = 动作发力顶点（最亮），50% = 离心到底（回落） */
@keyframes pulse-primary {
  0%,
  100% {
    fill: #ff6b35;
  }
  50% {
    fill: #6b3a2a;
  }
}

@keyframes pulse-secondary {
  0%,
  100% {
    fill: #ffa074;
  }
  50% {
    fill: #5a4038;
  }
}
</style>
