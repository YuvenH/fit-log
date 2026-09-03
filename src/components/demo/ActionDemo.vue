<script setup>
/**
 * 动作演示区块：左侧轨迹动画 + 右侧发力肌群，配暂停/倍速与阶段文案。
 *
 * 轨迹与肌群共用同一个周期变量，并约定 0% = 发力顶点、50% = 离心到底，
 * 因此两边的动画天然同步，不需要 JS 驱动。
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import MotionFigure from './MotionFigure.vue'
import BodyMuscleMap from './BodyMuscleMap.vue'
import { MUSCLE_LABELS, MUSCLE_VIEWS } from '../../demo/muscles.js'

const props = defineProps({
  demo: { type: Object, required: true },
})

const BASE_CYCLE = 3
const SPEEDS = [1, 0.5, 1.5]

const playing = ref(true)
const speedIndex = ref(0)
const view = ref(props.demo.view ?? 'front')
/** 阶段文案：true 为向心（发力），false 为离心 */
const inConcentric = ref(true)

const speed = computed(() => SPEEDS[speedIndex.value])
const duration = computed(() => BASE_CYCLE / speed.value)

// 切换动作时重置到该动作的默认视角
watch(
  () => props.demo,
  (demo) => {
    view.value = demo.view ?? 'front'
    inConcentric.value = true
  },
)

/**
 * 文案在向心/离心之间切换。
 * 用定时器而非 animation 事件：CSS 动画的 iteration 事件只在整轮结束时触发，
 * 拿不到「半程」这个时刻，而文案需要在半程切换。
 */
let timer = null
function restartTimer() {
  if (timer) clearInterval(timer)
  if (!playing.value) return
  // 半个周期切一次
  timer = setInterval(() => {
    inConcentric.value = !inConcentric.value
  }, (duration.value / 2) * 1000)
}

watch([playing, duration], restartTimer, { immediate: true })
onBeforeUnmount(() => timer && clearInterval(timer))

function togglePlay() {
  playing.value = !playing.value
}

function cycleSpeed() {
  speedIndex.value = (speedIndex.value + 1) % SPEEDS.length
}

function toggleView() {
  view.value = view.value === 'front' ? 'back' : 'front'
}

const phaseText = computed(() =>
  inConcentric.value ? props.demo.concentric : props.demo.eccentric,
)

/** 当前视角看不到的发力肌群，提示用户翻面 */
const hiddenMuscles = computed(() => {
  const involved = [...(props.demo.primary ?? []), ...(props.demo.secondary ?? [])]
  return involved
    .filter((id) => !(MUSCLE_VIEWS[id] ?? []).includes(view.value))
    .map((id) => MUSCLE_LABELS[id] ?? id)
})

/** 主要发力肌群名称，展示在图例上方 */
const primaryLabels = computed(() =>
  (props.demo.primary ?? []).map((id) => MUSCLE_LABELS[id] ?? id).join('、'),
)
</script>

<template>
  <section class="demo card" :class="{ 'is-paused': !playing }" aria-label="动作演示">
    <header class="demo__head">
      <span class="demo__pattern">{{ demo.patternLabel }}</span>
      <span class="demo__primary">主要发力：{{ primaryLabels }}</span>
    </header>

    <div class="demo__stage">
      <div class="demo__col">
        <MotionFigure :pattern="demo.pattern" :duration="duration" />
        <p class="demo__colLabel">动作轨迹</p>
      </div>

      <div class="demo__col">
        <BodyMuscleMap
          :view="view"
          :primary="demo.primary"
          :secondary="demo.secondary"
          :stabilizer="demo.stabilizer"
          :duration="duration"
        />
        <button type="button" class="demo__flip" @click="toggleView">
          {{ view === 'front' ? '正面' : '背面' }} · 点击翻转
        </button>
      </div>
    </div>

    <p v-if="hiddenMuscles.length > 0" class="demo__hidden">
      {{ hiddenMuscles.join('、') }}在{{ view === 'front' ? '背' : '正' }}面，点上方按钮翻转查看
    </p>

    <div class="demo__controls">
      <button type="button" class="demo__btn" @click="togglePlay">
        {{ playing ? '暂停' : '播放' }}
      </button>
      <button type="button" class="demo__btn demo__btn--ghost" @click="cycleSpeed">
        {{ speed.toFixed(1) }}×
      </button>
    </div>

    <ul class="demo__legend">
      <li><i class="dot dot--primary" />主要发力</li>
      <li><i class="dot dot--secondary" />协同发力</li>
      <li><i class="dot dot--stabilizer" />参与稳定</li>
    </ul>

    <p class="demo__phase" aria-live="polite">{{ phaseText }}</p>
    <p class="demo__cue">技巧：{{ demo.cue }}</p>
  </section>
</template>

<style scoped>
.demo {
  padding: 14px;
  margin-bottom: 12px;
}

/* 暂停时冻结所有子动画，包括两个 SVG 内部的 */
.demo.is-paused :deep(*) {
  animation-play-state: paused !important;
}

.demo__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.demo__pattern {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
  background: var(--accent-soft);
  padding: 2px 9px;
  border-radius: 999px;
}

.demo__primary {
  font-size: 12px;
  color: var(--text-muted);
}

.demo__stage {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.demo__col {
  flex: 1;
  min-width: 0;
}

/* 轨迹图是方的、人体图是竖的，给人体列限高避免它把卡片撑得过长 */
.demo__col:last-child :deep(svg) {
  max-height: 190px;
  margin-inline: auto;
}

.demo__colLabel {
  margin: 4px 0 0;
  text-align: center;
  font-size: 11px;
  color: var(--text-faint);
}

.demo__flip {
  display: block;
  width: 100%;
  margin-top: 4px;
  font-size: 11px;
  color: var(--text-faint);
  text-align: center;
}

.demo__flip:active {
  color: var(--accent);
}

.demo__hidden {
  margin: 8px 0 0;
  font-size: 11px;
  line-height: 1.5;
  color: var(--text-faint);
}

.demo__controls {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.demo__btn {
  flex: 1;
  min-height: 40px;
  border-radius: var(--radius-sm);
  background: var(--accent);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}

.demo__btn:active {
  opacity: 0.75;
}

.demo__btn--ghost {
  flex: 0 0 auto;
  padding-inline: 18px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.demo__legend {
  list-style: none;
  display: flex;
  gap: 14px;
  margin: 12px 0 0;
  padding: 0;
  font-size: 11px;
  color: var(--text-muted);
}

.demo__legend li {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  flex-shrink: 0;
}

.dot--primary {
  background: #ff6b35;
}

.dot--secondary {
  background: #ffa074;
}

.dot--stabilizer {
  background: #3d465c;
}

.demo__phase {
  margin: 12px 0 0;
  padding: 9px 11px;
  border-radius: var(--radius-sm);
  background: var(--bg);
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-muted);
  /* 两种阶段文案长度不同，固定最小高度避免卡片跳动 */
  min-height: 54px;
}

.demo__cue {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--accent);
}
</style>
