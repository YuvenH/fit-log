<script setup>
/**
 * 新增记录第一步：挑选动作。
 * 支持按部位快筛与关键词搜索，对应 PRD 主流程 1 的「选择训练部位 / 直接自选动作」。
 *
 * 这里使用组件内的独立筛选状态，不复用动作库页的单例筛选，
 * 避免在弹窗里的临时操作把用户在动作库页的筛选条件改掉。
 */
import { computed, ref, watch } from 'vue'
import BaseSheet from './BaseSheet.vue'
import { useActionLibrary } from '../composables/useActionLibrary.js'

const props = defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'pick'])

const { state, bodyParts } = useActionLibrary()

const activePart = ref(null)
const keyword = ref('')

// 每次打开重置为初始状态，避免上次的筛选残留造成困惑
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      activePart.value = null
      keyword.value = ''
    }
  },
)

const results = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return state.actions.filter((action) => {
    if (activePart.value && action.body_part !== activePart.value) return false
    if (!kw) return true
    return (
      action.action_name.toLowerCase().includes(kw) ||
      action.body_part.toLowerCase().includes(kw)
    )
  })
})

function togglePart(part) {
  activePart.value = activePart.value === part ? null : part
}
</script>

<template>
  <BaseSheet :open="open" title="选择训练动作" @close="emit('close')">
    <div class="picker">
      <label class="search">
        <span class="visually-hidden">搜索动作名称</span>
        <svg class="search__icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2" />
          <path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <input
          v-model="keyword"
          type="search"
          class="search__input"
          placeholder="搜索动作名称"
          enterkeyhint="search"
        />
      </label>

      <div class="parts" role="group" aria-label="按部位筛选">
        <button
          type="button"
          class="chip"
          :class="{ 'chip--active': activePart === null }"
          :aria-pressed="activePart === null"
          @click="activePart = null"
        >
          全部
        </button>
        <button
          v-for="part in bodyParts"
          :key="part"
          type="button"
          class="chip"
          :class="{ 'chip--active': activePart === part }"
          :aria-pressed="activePart === part"
          @click="togglePart(part)"
        >
          {{ part }}
        </button>
      </div>

      <p v-if="results.length === 0" class="picker__empty">
        没有匹配的动作，换个关键词或部位试试
      </p>

      <ul v-else class="list">
        <li v-for="action in results" :key="action.action_id">
          <button type="button" class="row" @click="emit('pick', action)">
            <span class="row__name">{{ action.action_name }}</span>
            <span class="row__part">{{ action.body_part }}</span>
          </button>
        </li>
      </ul>
    </div>
  </BaseSheet>
</template>

<style scoped>
.picker {
  padding-bottom: calc(16px + var(--safe-bottom));
}

.search {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.search__icon {
  position: absolute;
  left: 12px;
  color: var(--text-faint);
  pointer-events: none;
}

.search__input {
  width: 100%;
  min-height: 44px;
  padding: 0 12px 0 38px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-input);
}

.search__input::placeholder {
  color: var(--text-faint);
}

.parts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.chip {
  min-height: 34px;
  padding-inline: 14px;
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 14px;
  color: var(--text-muted);
  background: var(--bg-input);
}

.chip--active {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--accent-soft);
}

.picker__empty {
  margin: 24px 0;
  text-align: center;
  color: var(--text-faint);
  font-size: 14px;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-height: 50px;
  padding: 8px 4px;
  border-bottom: 1px solid var(--border);
  text-align: left;
}

.row:active {
  background: var(--bg-input);
}

.row__name {
  font-size: 15px;
}

.row__part {
  flex-shrink: 0;
  font-size: 12px;
  color: var(--text-faint);
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--bg-input);
}
</style>
