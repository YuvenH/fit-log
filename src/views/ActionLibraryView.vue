<script setup>
/**
 * 动作库页。
 * 承载 PRD 主流程 2 的前两步：部位分类筛选 / 关键词搜索 → 进入动作详情。
 *
 * 筛选状态存在 useActionLibrary 单例里，从详情页返回时条件保留。
 */
import { computed } from 'vue'
import { useActionLibrary } from '../composables/useActionLibrary.js'

const { state, bodyParts, filteredActions, countByBodyPart, setBodyPart, setKeyword, resetFilter } =
  useActionLibrary()

// state 是 readonly 的，输入框走显式 setter 而不是 v-model
const keyword = computed({
  get: () => state.keyword,
  set: (value) => setKeyword(value),
})

const hasFilter = computed(() => Boolean(state.activeBodyPart) || state.keyword.trim() !== '')
</script>

<template>
  <main class="page">
    <div class="container">
      <header class="head">
        <h1 class="head__title">动作库</h1>
        <p class="head__desc">{{ state.actions.length }} 个标准化动作，点击查看做法与要点</p>
      </header>

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
          placeholder="搜索动作名称，如 卧推"
          enterkeyhint="search"
        />
      </label>

      <div class="parts" role="group" aria-label="按训练部位筛选">
        <button
          type="button"
          class="chip"
          :class="{ 'chip--active': state.activeBodyPart === null }"
          :aria-pressed="state.activeBodyPart === null"
          @click="resetFilter"
        >
          全部
        </button>
        <button
          v-for="part in bodyParts"
          :key="part"
          type="button"
          class="chip"
          :class="{ 'chip--active': state.activeBodyPart === part }"
          :aria-pressed="state.activeBodyPart === part"
          @click="setBodyPart(part)"
        >
          {{ part }}
          <span class="chip__count">{{ countByBodyPart[part] }}</span>
        </button>
      </div>

      <p v-if="state.error" class="banner" role="alert">{{ state.error }}</p>

      <p v-if="state.loading && state.actions.length === 0" class="hint">动作库加载中…</p>

      <div v-else-if="filteredActions.length === 0" class="empty">
        <p class="empty__title">没有匹配的动作</p>
        <button v-if="hasFilter" type="button" class="empty__reset" @click="resetFilter">
          清除筛选条件
        </button>
      </div>

      <ul v-else class="list">
        <li v-for="action in filteredActions" :key="action.action_id">
          <RouterLink
            class="row"
            :to="{ name: 'action-detail', params: { actionId: action.action_id } }"
          >
            <span class="row__main">
              <span class="row__name">{{ action.action_name }}</span>
              <span class="row__desc">{{ action.force_point }}</span>
            </span>
            <span class="row__part">{{ action.body_part }}</span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </main>
</template>

<style scoped>
.head {
  margin-bottom: 14px;
}

.head__title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.head__desc {
  margin: 3px 0 0;
  font-size: 13px;
  color: var(--text-faint);
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
  min-height: 46px;
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
  margin-bottom: 18px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-height: 34px;
  padding-inline: 13px;
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 14px;
  color: var(--text-muted);
  background: var(--bg-elevated);
}

.chip--active {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--accent-soft);
}

.chip__count {
  font-size: 11px;
  color: var(--text-faint);
  font-variant-numeric: tabular-nums;
}

.chip--active .chip__count {
  color: var(--accent);
}

.banner {
  margin: 0 0 12px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--danger);
  background: rgba(244, 97, 78, 0.12);
  border: 1px solid rgba(244, 97, 78, 0.3);
}

.hint {
  margin: 16px 0;
  font-size: 14px;
  color: var(--text-faint);
}

.empty {
  padding: 30px 16px;
  text-align: center;
  border: 1px dashed var(--border);
  border-radius: var(--radius);
}

.empty__title {
  margin: 0 0 10px;
  font-size: 15px;
  color: var(--text-muted);
}

.empty__reset {
  font-size: 14px;
  color: var(--accent);
  text-decoration: underline;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 14px;
  text-decoration: none;
  color: inherit;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.row:active {
  background: var(--bg-input);
}

.row__main {
  min-width: 0;
}

.row__name {
  display: block;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 2px;
}

.row__desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-faint);
}

.row__part {
  flex-shrink: 0;
  font-size: 11px;
  color: var(--text-faint);
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--bg-input);
}
</style>
