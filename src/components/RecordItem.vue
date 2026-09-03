<script setup>
import { computed } from 'vue'

const props = defineProps({
  record: { type: Object, required: true },
})

defineEmits(['edit'])

/** 主信息行：3 组 × 12 次 · 60kg */
const mainLine = computed(() => {
  const parts = [`${props.record.group_num} 组 × ${props.record.repeat_num} 次`]
  if (props.record.weight !== null && props.record.weight !== undefined) {
    parts.push(`${props.record.weight} kg`)
  }
  return parts.join(' · ')
})

const restText = computed(() => {
  const rest = props.record.rest_time
  if (rest === null || rest === undefined) return ''
  return `休息 ${rest}s`
})
</script>

<template>
  <button
    type="button"
    class="item"
    :aria-label="`编辑 ${record.action_name} 的训练记录`"
    @click="$emit('edit', record)"
  >
    <div class="item__head">
      <span class="item__name">{{ record.action_name }}</span>
      <span class="item__part">{{ record.body_part }}</span>
    </div>

    <div class="item__meta">
      <span class="item__main">{{ mainLine }}</span>
      <span v-if="restText" class="item__rest">{{ restText }}</span>
    </div>

    <p v-if="record.remark" class="item__remark">{{ record.remark }}</p>

    <svg class="item__chevron" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M9 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  </button>
</template>

<style scoped>
.item {
  position: relative;
  display: block;
  width: 100%;
  padding: 14px 34px 14px 14px;
  text-align: left;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.item:active {
  background: var(--bg-input);
}

.item__head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.item__name {
  font-size: 16px;
  font-weight: 600;
}

.item__part {
  flex-shrink: 0;
  font-size: 11px;
  color: var(--text-faint);
  padding: 1px 7px;
  border-radius: 999px;
  background: var(--bg-input);
}

.item__meta {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}

.item__main {
  font-size: 14px;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.item__rest {
  font-size: 12px;
  color: var(--text-faint);
}

.item__remark {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--text-muted);
  white-space: pre-wrap;
  word-break: break-word;
}

.item__chevron {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: var(--text-faint);
}
</style>
