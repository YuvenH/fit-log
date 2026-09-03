<script setup>
/**
 * 动作轨迹动画。
 *
 * 按「动作模式」而非按单个动作实现：卧推 / 哑铃卧推 / 窄距卧推 的轨迹本质相同，
 * 都是水平推，共用一套动画即可，新增动作只要归类到已有模式就能复用。
 *
 * 所有模式共用 3 秒周期，且 0% 对应发力顶点、50% 对应离心到底，
 * 与 BodyMuscleMap 的脉冲关键帧保持一致，两边才会同步。
 */
const props = defineProps({
  pattern: { type: String, required: true },
  duration: { type: Number, default: 3 },
})
</script>

<template>
  <svg
    class="motion"
    viewBox="0 0 200 200"
    :style="{ '--cycle': `${duration}s` }"
    role="img"
    aria-label="动作轨迹演示"
  >
    <!-- ── 水平推：卧推类 ───────────────────────────── -->
    <g v-if="pattern === 'horizontalPush'">
      <rect class="gear" x="42" y="150" width="118" height="9" rx="3" />
      <rect class="gear" x="54" y="159" width="8" height="26" />
      <rect class="gear" x="140" y="159" width="8" height="26" />
      <ellipse class="body" cx="100" cy="142" rx="45" ry="11" />
      <circle class="body" cx="54" cy="140" r="10" />
      <line class="guide" x1="118" y1="42" x2="118" y2="130" />
      <line class="limb anim-upperarm" x1="118" y1="140" x2="118" y2="98" />
      <line class="limb anim-forearm" x1="118" y1="98" x2="118" y2="62" />
      <g class="anim-bar">
        <line class="bar" x1="72" y1="62" x2="164" y2="62" />
        <rect class="plate" x="66" y="50" width="9" height="24" rx="2" />
        <rect class="plate" x="161" y="50" width="9" height="24" rx="2" />
      </g>
    </g>

    <!-- ── 垂直推：站姿/坐姿推举 ─────────────────────── -->
    <g v-else-if="pattern === 'verticalPush'">
      <circle class="body" cx="100" cy="52" r="12" />
      <line class="body-line" x1="100" y1="64" x2="100" y2="120" />
      <line class="limb" x1="100" y1="120" x2="86" y2="172" />
      <line class="limb" x1="100" y1="120" x2="114" y2="172" />
      <rect class="gear" x="70" y="172" width="60" height="6" rx="3" />
      <line class="guide" x1="100" y1="24" x2="100" y2="76" />
      <line class="limb anim-vpush-arm" x1="100" y1="74" x2="76" y2="40" />
      <line class="limb anim-vpush-arm2" x1="100" y1="74" x2="124" y2="40" />
      <g class="anim-vpush-bar">
        <line class="bar" x1="58" y1="34" x2="142" y2="34" />
        <rect class="plate" x="52" y="22" width="9" height="24" rx="2" />
        <rect class="plate" x="139" y="22" width="9" height="24" rx="2" />
      </g>
    </g>

    <!-- ── 垂直拉：引体向上 / 高位下拉 ───────────────── -->
    <g v-else-if="pattern === 'verticalPull'">
      <rect class="gear" x="40" y="26" width="120" height="7" rx="3" />
      <line class="guide" x1="100" y1="36" x2="100" y2="120" />
      <g class="anim-pull-body">
        <circle class="body" cx="100" cy="76" r="12" />
        <line class="body-line" x1="100" y1="88" x2="100" y2="140" />
        <line class="limb" x1="100" y1="140" x2="88" y2="180" />
        <line class="limb" x1="100" y1="140" x2="112" y2="180" />
        <line class="limb" x1="100" y1="90" x2="74" y2="40" />
        <line class="limb" x1="100" y1="90" x2="126" y2="40" />
      </g>
    </g>

    <!-- ── 水平拉：划船类 ───────────────────────────── -->
    <g v-else-if="pattern === 'row'">
      <line class="body-line" x1="58" y1="70" x2="140" y2="96" />
      <circle class="body" cx="50" cy="66" r="11" />
      <line class="limb" x1="140" y1="96" x2="140" y2="164" />
      <rect class="gear" x="112" y="164" width="58" height="6" rx="3" />
      <line class="guide" x1="112" y1="96" x2="112" y2="150" />
      <line class="limb anim-row-arm" x1="112" y1="88" x2="112" y2="142" />
      <g class="anim-row-bar">
        <line class="bar" x1="70" y1="142" x2="156" y2="142" />
        <rect class="plate" x="64" y="130" width="9" height="24" rx="2" />
        <rect class="plate" x="153" y="130" width="9" height="24" rx="2" />
      </g>
    </g>

    <!-- ── 深蹲：屈膝主导 ───────────────────────────── -->
    <g v-else-if="pattern === 'squat'">
      <rect class="gear" x="34" y="184" width="132" height="6" rx="3" />
      <g class="anim-squat-body">
        <circle class="body" cx="100" cy="52" r="12" />
        <line class="body-line" x1="100" y1="64" x2="100" y2="112" />
        <g>
          <line class="bar" x1="62" y1="70" x2="138" y2="70" />
          <rect class="plate" x="56" y="58" width="9" height="24" rx="2" />
          <rect class="plate" x="135" y="58" width="9" height="24" rx="2" />
        </g>
      </g>
      <!-- 大腿与小腿：随下蹲改变角度 -->
      <line class="limb anim-squat-thigh" x1="100" y1="112" x2="100" y2="148" />
      <line class="limb anim-squat-shin" x1="100" y1="148" x2="100" y2="184" />
      <line class="guide" x1="100" y1="40" x2="100" y2="120" />
    </g>

    <!-- ── 髋铰链：硬拉 / 罗马尼亚硬拉 ───────────────── -->
    <g v-else-if="pattern === 'hinge'">
      <rect class="gear" x="34" y="184" width="132" height="6" rx="3" />
      <line class="limb" x1="100" y1="122" x2="100" y2="184" />
      <g class="anim-hinge-torso">
        <line class="body-line" x1="100" y1="122" x2="100" y2="66" />
        <circle class="body" cx="100" cy="56" r="11" />
      </g>
      <g class="anim-hinge-bar">
        <line class="limb" x1="100" y1="122" x2="112" y2="150" />
        <line class="bar" x1="66" y1="152" x2="152" y2="152" />
        <rect class="plate" x="60" y="138" width="9" height="28" rx="2" />
        <rect class="plate" x="149" y="138" width="9" height="28" rx="2" />
      </g>
    </g>

    <!-- ── 屈肘：弯举类 ─────────────────────────────── -->
    <g v-else-if="pattern === 'elbowFlexion'">
      <circle class="body" cx="100" cy="46" r="12" />
      <line class="body-line" x1="100" y1="58" x2="100" y2="126" />
      <line class="limb" x1="100" y1="126" x2="88" y2="180" />
      <line class="limb" x1="100" y1="126" x2="112" y2="180" />
      <rect class="gear" x="66" y="180" width="68" height="6" rx="3" />
      <!-- 上臂固定，前臂绕肘旋转 -->
      <line class="limb" x1="100" y1="70" x2="100" y2="112" />
      <g class="anim-curl">
        <line class="limb" x1="100" y1="112" x2="132" y2="120" />
        <rect class="plate" x="128" y="110" width="10" height="22" rx="3" />
      </g>
      <path class="guide-arc" d="M132 120 Q140 96 118 80" />
    </g>

    <!-- ── 伸肘：绳索下压 / 过顶臂屈伸 ───────────────── -->
    <g v-else-if="pattern === 'elbowExtension'">
      <circle class="body" cx="100" cy="46" r="12" />
      <line class="body-line" x1="100" y1="58" x2="100" y2="126" />
      <line class="limb" x1="100" y1="126" x2="88" y2="180" />
      <line class="limb" x1="100" y1="126" x2="112" y2="180" />
      <rect class="gear" x="66" y="180" width="68" height="6" rx="3" />
      <line class="limb" x1="100" y1="70" x2="100" y2="110" />
      <g class="anim-extend">
        <line class="limb" x1="100" y1="110" x2="100" y2="146" />
        <rect class="plate" x="94" y="142" width="13" height="9" rx="3" />
      </g>
      <path class="guide-arc" d="M100 146 Q84 128 100 110" />
    </g>

    <!-- ── 侧向抬举：侧平举 / 前平举 ─────────────────── -->
    <g v-else-if="pattern === 'lateralRaise'">
      <circle class="body" cx="100" cy="46" r="12" />
      <line class="body-line" x1="100" y1="58" x2="100" y2="126" />
      <line class="limb" x1="100" y1="126" x2="88" y2="180" />
      <line class="limb" x1="100" y1="126" x2="112" y2="180" />
      <rect class="gear" x="66" y="180" width="68" height="6" rx="3" />
      <g class="anim-raise-left">
        <line class="limb" x1="92" y1="70" x2="52" y2="70" />
        <rect class="plate" x="44" y="60" width="10" height="20" rx="3" />
      </g>
      <g class="anim-raise-right">
        <line class="limb" x1="108" y1="70" x2="148" y2="70" />
        <rect class="plate" x="146" y="60" width="10" height="20" rx="3" />
      </g>
      <path class="guide-arc" d="M52 118 Q40 92 52 70" />
      <path class="guide-arc" d="M148 118 Q160 92 148 70" />
    </g>

    <!-- ── 静态支撑：平板支撑 ───────────────────────── -->
    <g v-else-if="pattern === 'staticHold'">
      <rect class="gear" x="30" y="160" width="140" height="6" rx="3" />
      <g class="anim-hold">
        <circle class="body" cx="54" cy="112" r="11" />
        <line class="body-line" x1="64" y1="116" x2="150" y2="130" />
        <line class="limb" x1="70" y1="117" x2="70" y2="158" />
        <line class="limb" x1="150" y1="130" x2="158" y2="158" />
      </g>
      <text class="hold-hint" x="100" y="184" text-anchor="middle">保持一条直线</text>
    </g>

    <!-- 未知模式：什么都不画（由外层决定是否展示） -->
  </svg>
</template>

<style scoped>
.motion {
  width: 100%;
  height: auto;
  display: block;
}

.gear {
  fill: #2a3040;
}

.body {
  fill: #3a4356;
}

.body-line {
  stroke: #3a4356;
  stroke-width: 9;
  stroke-linecap: round;
}

.limb {
  stroke: #4a5468;
  stroke-width: 6;
  stroke-linecap: round;
  fill: none;
}

.bar {
  stroke: #8a94a8;
  stroke-width: 4;
  stroke-linecap: round;
}

.plate {
  fill: var(--accent);
}

.guide {
  stroke: #fff;
  stroke-width: 1;
  stroke-dasharray: 3 4;
  opacity: 0.16;
}

.guide-arc {
  stroke: #fff;
  stroke-width: 1;
  stroke-dasharray: 3 4;
  opacity: 0.16;
  fill: none;
}

.hold-hint {
  fill: #6b7688;
  font-size: 11px;
}

/* ══ 各模式动画 ══════════════════════════════════
   统一约定：0%/100% = 发力顶点，50% = 离心到底 */

/* 水平推 */
.anim-bar {
  animation: hpush-bar var(--cycle) ease-in-out infinite;
}
@keyframes hpush-bar {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(68px);
  }
}
.anim-upperarm {
  transform-origin: 118px 140px;
  animation: hpush-upper var(--cycle) ease-in-out infinite;
}
@keyframes hpush-upper {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.45);
  }
}
.anim-forearm {
  animation: hpush-fore var(--cycle) ease-in-out infinite;
}
@keyframes hpush-fore {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(34px);
  }
}

/* 垂直推 */
.anim-vpush-bar {
  animation: vpush-bar var(--cycle) ease-in-out infinite;
}
@keyframes vpush-bar {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(42px);
  }
}
.anim-vpush-arm {
  transform-origin: 100px 74px;
  animation: vpush-arm var(--cycle) ease-in-out infinite;
}
.anim-vpush-arm2 {
  transform-origin: 100px 74px;
  animation: vpush-arm2 var(--cycle) ease-in-out infinite;
}
@keyframes vpush-arm {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-32deg);
  }
}
@keyframes vpush-arm2 {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(32deg);
  }
}

/* 垂直拉：身体上下 */
.anim-pull-body {
  animation: vpull var(--cycle) ease-in-out infinite;
}
@keyframes vpull {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(34px);
  }
}

/* 划船：杠铃拉向腹部 */
.anim-row-bar {
  animation: row-bar var(--cycle) ease-in-out infinite;
}
@keyframes row-bar {
  0%,
  100% {
    transform: translateY(-44px);
  }
  50% {
    transform: translateY(0);
  }
}
.anim-row-arm {
  transform-origin: 112px 88px;
  animation: row-arm var(--cycle) ease-in-out infinite;
}
@keyframes row-arm {
  0%,
  100% {
    transform: scaleY(0.2);
  }
  50% {
    transform: scaleY(1);
  }
}

/* 深蹲：躯干下沉 + 腿部压缩 */
.anim-squat-body {
  animation: squat-body var(--cycle) ease-in-out infinite;
}
@keyframes squat-body {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(40px);
  }
}
.anim-squat-thigh {
  transform-origin: 100px 148px;
  animation: squat-thigh var(--cycle) ease-in-out infinite;
}
@keyframes squat-thigh {
  0%,
  100% {
    transform: scaleY(1) translateX(0);
  }
  50% {
    transform: scaleY(0.15) translateX(-11px);
  }
}
.anim-squat-shin {
  transform-origin: 100px 184px;
  animation: squat-shin var(--cycle) ease-in-out infinite;
}
@keyframes squat-shin {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-11deg);
  }
}

/* 髋铰链：躯干前倾，杠铃沿腿下滑 */
.anim-hinge-torso {
  transform-origin: 100px 122px;
  animation: hinge-torso var(--cycle) ease-in-out infinite;
}
@keyframes hinge-torso {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(62deg);
  }
}
.anim-hinge-bar {
  animation: hinge-bar var(--cycle) ease-in-out infinite;
}
@keyframes hinge-bar {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(24px);
  }
}

/* 屈肘：前臂绕肘上举 */
.anim-curl {
  transform-origin: 100px 112px;
  animation: curl var(--cycle) ease-in-out infinite;
}
@keyframes curl {
  0%,
  100% {
    transform: rotate(-108deg);
  }
  50% {
    transform: rotate(0deg);
  }
}

/* 伸肘：前臂下压 */
.anim-extend {
  transform-origin: 100px 110px;
  animation: extend var(--cycle) ease-in-out infinite;
}
@keyframes extend {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-74deg);
  }
}

/* 侧向抬举：双臂张开 */
.anim-raise-left {
  transform-origin: 92px 70px;
  animation: raise-left var(--cycle) ease-in-out infinite;
}
.anim-raise-right {
  transform-origin: 108px 70px;
  animation: raise-right var(--cycle) ease-in-out infinite;
}
@keyframes raise-left {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-72deg);
  }
}
@keyframes raise-right {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(72deg);
  }
}

/* 静态支撑：轻微起伏表示在维持张力 */
.anim-hold {
  animation: hold var(--cycle) ease-in-out infinite;
}
@keyframes hold {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(2px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .motion * {
    animation: none !important;
  }
}
</style>
