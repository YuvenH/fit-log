/**
 * 动作演示配置：action_id → 动作模式 + 发力肌群 + 阶段文案。
 *
 * 刻意不存进 IndexedDB：这是随代码发布的展示数据，没有持久化需求，
 * 放在这里可以避免升级数据库版本，也让动作库表保持精简。
 *
 * 覆盖原则：只有当轨迹动画能**如实表达**该动作时才配置。
 * 例如俯卧撑虽然也是水平推，但用卧推的动画（带凳子和杠铃）会误导，
 * 因此宁可留空 —— 详情页对没有配置的动作不显示演示区块，不会报错。
 */

/** 肌群 id 见 ./muscles.js */
export const ACTION_DEMOS = {
  // ── 水平推 ────────────────────────────────────────
  chest_barbell_bench_press: {
    pattern: 'horizontalPush',
    patternLabel: '水平推',
    view: 'front',
    primary: ['chest'],
    secondary: ['delt', 'triceps'],
    stabilizer: ['abs'],
    concentric: '推起：胸大肌收缩把杠铃推离胸口，肩前束与肱三头协同',
    eccentric: '下放：控制离心，肩胛后缩下沉，胸部打开被拉长',
    cue: '手肘控制在 45-75 度，别完全外张',
  },
  chest_dumbbell_bench_press: {
    pattern: 'horizontalPush',
    patternLabel: '水平推',
    view: 'front',
    primary: ['chest'],
    secondary: ['delt', 'triceps'],
    stabilizer: ['abs'],
    concentric: '推起：沿弧线向内收，顶峰主动夹胸',
    eccentric: '下放：幅度比杠铃更大，感受胸肌被充分拉长',
    cue: '最低点前臂保持垂直地面，张力留在胸上',
  },
  chest_incline_dumbbell_press: {
    pattern: 'horizontalPush',
    patternLabel: '水平推（上斜）',
    view: 'front',
    primary: ['chest'],
    secondary: ['delt', 'triceps'],
    stabilizer: ['abs'],
    concentric: '推起：重点落在胸大肌上束',
    eccentric: '下放：回到上胸外侧，别耸肩',
    cue: '角度别超过 45 度，否则变成练肩',
  },
  arm_close_grip_bench_press: {
    pattern: 'horizontalPush',
    patternLabel: '水平推（窄距）',
    view: 'back',
    primary: ['triceps'],
    secondary: ['chest', 'delt'],
    stabilizer: ['abs'],
    concentric: '推起：肘部内收贴身，末端主动锁伸肘关节',
    eccentric: '下放：杠铃走向下胸，肘部不外张',
    cue: '握距与肩同宽或略窄，别窄到双手相碰',
  },

  // ── 垂直推 ────────────────────────────────────────
  shoulder_overhead_press: {
    pattern: 'verticalPush',
    patternLabel: '垂直推',
    view: 'front',
    primary: ['delt'],
    secondary: ['triceps', 'trapsUpper'],
    stabilizer: ['abs'],
    concentric: '推起：垂直向上，头略后收让出杠铃轨迹',
    eccentric: '下放：回到锁骨位置，核心持续绷紧',
    cue: '别用下肢屈伸借力，腰不要过度前凸',
  },
  shoulder_dumbbell_press: {
    pattern: 'verticalPush',
    patternLabel: '垂直推',
    view: 'front',
    primary: ['delt'],
    secondary: ['triceps'],
    stabilizer: ['abs'],
    concentric: '推起：沿略内收弧线上举至接近靠拢',
    eccentric: '下放：到耳侧即止，保持肩部张力',
    cue: '肩胛保持下沉，别靠耸肩带动',
  },

  // ── 垂直拉 ────────────────────────────────────────
  back_pull_up: {
    pattern: 'verticalPull',
    patternLabel: '垂直拉',
    view: 'back',
    primary: ['lats'],
    secondary: ['biceps', 'deltRear'],
    stabilizer: ['abs'],
    concentric: '上拉：肩胛先下沉启动，用肘部拉向腰侧',
    eccentric: '下放：控制离心 2-3 秒回到完全悬垂',
    cue: '别靠腰腹摆动的惯性上拉',
  },
  back_lat_pulldown: {
    pattern: 'verticalPull',
    patternLabel: '垂直拉',
    view: 'back',
    primary: ['lats'],
    secondary: ['biceps'],
    stabilizer: ['abs'],
    concentric: '下拉：肘部沿身体两侧向下向后，挺胸收肩胛',
    eccentric: '还原：控制回到手臂完全伸直',
    cue: '别把杠拉到颈后，那会伤肩',
  },

  // ── 水平拉 ────────────────────────────────────────
  back_barbell_row: {
    pattern: 'row',
    patternLabel: '水平拉',
    view: 'back',
    primary: ['lats'],
    secondary: ['trapsUpper', 'biceps', 'deltRear'],
    stabilizer: ['lowerBack', 'abs'],
    concentric: '拉起：把杠铃拉进腹部下沿，肘部贴近躯干',
    eccentric: '下放：控制还原，躯干角度保持不变',
    cue: '弓背最危险，宁可减重量也要保持脊柱中立',
  },
  back_one_arm_dumbbell_row: {
    pattern: 'row',
    patternLabel: '水平拉',
    view: 'back',
    primary: ['lats'],
    secondary: ['biceps', 'deltRear'],
    stabilizer: ['abs'],
    concentric: '拉起：轨迹略向后，像把哑铃放进后裤兜',
    eccentric: '下放：让同侧肩胛充分前伸，把背拉长',
    cue: '别用躯干旋转带动重量',
  },
  back_seated_cable_row: {
    pattern: 'row',
    patternLabel: '水平拉',
    view: 'back',
    primary: ['lats'],
    secondary: ['trapsUpper', 'biceps'],
    stabilizer: ['lowerBack'],
    concentric: '拉起：把手拉向腹部，肩胛向中间收紧',
    eccentric: '还原：肩胛充分前伸，感受背部被拉开',
    cue: '避免用腰部前后大幅摆动借力',
  },

  // ── 深蹲 ──────────────────────────────────────────
  leg_barbell_squat: {
    pattern: 'squat',
    patternLabel: '屈膝主导',
    view: 'front',
    primary: ['quads'],
    secondary: ['glutes', 'hamstrings'],
    stabilizer: ['abs', 'lowerBack'],
    concentric: '起身：蹬地站起，想象用背把杠铃顶起来',
    eccentric: '下降：髋膝同步，膝盖沿脚尖方向推出',
    cue: '避免膝内扣，重心落在全脚掌',
  },
  leg_bulgarian_split_squat: {
    pattern: 'squat',
    patternLabel: '屈膝主导（单腿）',
    view: 'front',
    primary: ['quads', 'glutes'],
    secondary: ['hamstrings'],
    stabilizer: ['abs'],
    concentric: '起身：用前腿蹬起还原',
    eccentric: '下降：屈前腿至后膝接近地面',
    cue: '上身略前倾能增加臀部参与',
  },

  // ── 髋铰链 ────────────────────────────────────────
  back_deadlift: {
    pattern: 'hinge',
    patternLabel: '髋铰链',
    view: 'back',
    primary: ['glutes', 'hamstrings'],
    secondary: ['lats', 'lowerBack', 'quads'],
    stabilizer: ['abs'],
    concentric: '站起：像把地面推开，髋与膝同步伸展',
    eccentric: '下放：沿原轨迹放回，杠铃贴腿',
    cue: '全程杠铃贴近身体，背部保持中立',
  },
  leg_romanian_deadlift: {
    pattern: 'hinge',
    patternLabel: '髋铰链',
    view: 'back',
    primary: ['hamstrings'],
    secondary: ['glutes', 'lowerBack'],
    stabilizer: ['abs'],
    concentric: '起身：送髋向前回到直立',
    eccentric: '下放：以髋为轴向后送髋，膝微屈固定',
    cue: '核心是髋铰链而非屈膝，股后拉紧即到位',
  },

  // ── 屈肘 ──────────────────────────────────────────
  arm_barbell_curl: {
    pattern: 'elbowFlexion',
    patternLabel: '屈肘',
    view: 'front',
    primary: ['biceps'],
    secondary: ['forearm'],
    stabilizer: ['abs'],
    concentric: '卷起：上臂固定于体侧，只有肘关节屈曲',
    eccentric: '下放：离心 2-3 秒，别完全松掉张力',
    cue: '身体前后摆动借力是最常见问题',
  },
  arm_alternating_dumbbell_curl: {
    pattern: 'elbowFlexion',
    patternLabel: '屈肘',
    view: 'front',
    primary: ['biceps'],
    secondary: ['forearm'],
    stabilizer: ['abs'],
    concentric: '卷起：过程中前臂外旋，让二头充分缩短',
    eccentric: '下放：控制节奏，两侧保持一致',
    cue: '别靠肩部前摆把哑铃甩上去',
  },
  arm_hammer_curl: {
    pattern: 'elbowFlexion',
    patternLabel: '屈肘（中立握）',
    view: 'front',
    primary: ['biceps', 'forearm'],
    secondary: [],
    stabilizer: ['abs'],
    concentric: '卷起：保持中立握，刺激肱桡肌与肱肌',
    eccentric: '下放：上臂贴紧体侧不要前后移动',
    cue: '手腕保持中立，别向内塌陷',
  },

  // ── 伸肘 ──────────────────────────────────────────
  arm_triceps_pushdown: {
    pattern: 'elbowExtension',
    patternLabel: '伸肘',
    view: 'back',
    primary: ['triceps'],
    secondary: ['forearm'],
    stabilizer: ['abs'],
    concentric: '下压：上臂锁定不动，伸肘至手臂完全伸直',
    eccentric: '还原：回到前臂接近水平即可',
    cue: '别靠上身前倾用体重下压',
  },

  // ── 肩外展 ────────────────────────────────────────
  shoulder_lateral_raise: {
    pattern: 'lateralRaise',
    patternLabel: '肩外展',
    view: 'front',
    primary: ['delt'],
    secondary: ['trapsUpper'],
    stabilizer: ['abs'],
    concentric: '抬起：用肘部领先带动，抬到与地面平行即止',
    eccentric: '下放：缓慢控制，别放松砸回体侧',
    cue: '这个动作宁轻勿重，重了必然耸肩',
  },
  shoulder_bent_over_lateral_raise: {
    pattern: 'lateralRaise',
    patternLabel: '肩外展（俯身）',
    view: 'back',
    primary: ['deltRear'],
    secondary: ['trapsUpper'],
    stabilizer: ['lowerBack'],
    concentric: '抬起：肩关节水平外展，孤立后束',
    eccentric: '下放：保持背部挺直，颈部中立',
    cue: '别靠上身起伏甩起哑铃',
  },

  // ── 静态支撑 ──────────────────────────────────────
  core_plank: {
    pattern: 'staticHold',
    patternLabel: '抗伸展静态支撑',
    view: 'front',
    primary: ['abs'],
    secondary: ['obliques'],
    stabilizer: ['quads', 'delt'],
    concentric: '维持：腹臀同时收紧，骨盆略后倾消除腰部塌陷',
    eccentric: '维持：呼吸平稳，不要憋气',
    cue: '姿态一变形就结束这组，质量优先于时长',
  },
}

/**
 * 取某个动作的演示配置。
 * @param {string} actionId
 * @returns {object | null} 无配置返回 null，调用方据此决定是否渲染演示区块
 */
export function getActionDemo(actionId) {
  return ACTION_DEMOS[actionId] ?? null
}

/** 已配置演示的动作数量，用于自查覆盖率 */
export const DEMO_COVERAGE = Object.keys(ACTION_DEMOS).length
