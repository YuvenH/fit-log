<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

/** 详情页属于动作库分支，tab 仍高亮动作库 */
const activeTab = computed(() => route.meta?.tab ?? 'home')

const tabs = [
  { key: 'home', label: '今日训练', to: { name: 'home' } },
  { key: 'calendar', label: '日历', to: { name: 'calendar' } },
  { key: 'library', label: '动作库', to: { name: 'library' } },
]
</script>

<template>
  <nav class="tabbar" aria-label="主导航">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.key"
      :to="tab.to"
      class="tab"
      :class="{ 'tab--active': activeTab === tab.key }"
      :aria-current="activeTab === tab.key ? 'page' : undefined"
    >
      <span class="tab__icon" aria-hidden="true">
        <svg v-if="tab.key === 'home'" viewBox="0 0 24 24" width="22" height="22">
          <path
            d="M4 7h2.5v10H4zM17.5 7H20v10h-2.5zM7.5 10.5h9v3h-9z"
            fill="currentColor"
          />
          <path d="M2 9.5h1.5v5H2zM20.5 9.5H22v5h-1.5z" fill="currentColor" />
        </svg>
        <svg v-else-if="tab.key === 'calendar'" viewBox="0 0 24 24" width="22" height="22">
          <path
            d="M5 5h14a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 19 21H5a1.5 1.5 0 0 1-1.5-1.5v-13A1.5 1.5 0 0 1 5 5zm.5 4.5v9.5h13V9.5z"
            fill="currentColor"
          />
          <path
            d="M7.5 3h1.6v3.5H7.5zM14.9 3h1.6v3.5h-1.6z"
            fill="currentColor"
          />
          <path
            d="M7 11.5h2.2v2.2H7zM11 11.5h2.2v2.2H11zM15 11.5h2.2v2.2H15zM7 15.3h2.2v2.2H7zM11 15.3h2.2v2.2H11z"
            fill="currentColor"
          />
        </svg>
        <svg v-else viewBox="0 0 24 24" width="22" height="22">
          <path
            d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5zM6 6.5v11h12v-11z"
            fill="currentColor"
          />
          <path d="M8 9h8v1.6H8zM8 12.2h8v1.6H8zM8 15.4h5V17H8z" fill="currentColor" />
        </svg>
      </span>
      <span class="tab__label">{{ tab.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 40;
  display: flex;
  height: calc(var(--tabbar-height) + var(--safe-bottom));
  padding-bottom: var(--safe-bottom);
  background: rgba(15, 17, 21, 0.94);
  backdrop-filter: blur(12px);
  border-top: 1px solid var(--border);
}

.tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  text-decoration: none;
  color: var(--text-faint);
  transition: color 0.15s ease;
}

.tab--active {
  color: var(--accent);
}

.tab__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 22px;
}

.tab__label {
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
}
</style>
