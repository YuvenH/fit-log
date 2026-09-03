<script setup>
/**
 * 动作详情页。
 * 承载 PRD 主流程 2 后两步：查看完整教程 → 直接添加至当日训练记录并返回首页。
 */
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RecordFormSheet from '../components/RecordFormSheet.vue'
import ActionDemo from '../components/demo/ActionDemo.vue'
import { useActionLibrary } from '../composables/useActionLibrary.js'
import { useTrainLog } from '../composables/useTrainLog.js'
import { getActionDemo } from '../demo/actionDemos.js'

const route = useRoute()
const router = useRouter()

const { load, findAction } = useActionLibrary()
const { addRecord } = useTrainLog()

const action = ref(null)
const loading = ref(true)
const notFound = ref(false)
const formOpen = ref(false)
const submitError = ref('')

async function resolveAction(actionId) {
  loading.value = true
  notFound.value = false
  try {
    await load()
    const found = await findAction(actionId)
    if (found) {
      action.value = found
    } else {
      action.value = null
      notFound.value = true
    }
  } finally {
    loading.value = false
  }
}

watch(
  () => route.params.actionId,
  (actionId) => {
    if (typeof actionId === 'string') resolveAction(actionId)
  },
  { immediate: true },
)

/** 演示配置，未配置的动作返回 null，模板据此跳过演示区块 */
const demo = computed(() => (action.value ? getActionDemo(action.value.action_id) : null))

const sections = computed(() => {
  if (!action.value) return []
  return [
    { key: 'desc', label: '标准做法', text: action.value.action_desc },
    { key: 'force', label: '发力要点', text: action.value.force_point },
    { key: 'warn', label: '注意事项', text: action.value.warning_point },
  ].filter((section) => Boolean(section.text))
})

function goBack() {
  // 有历史则返回，直接打开详情 URL 的场景回动作库
  if (window.history.state?.back) {
    router.back()
  } else {
    router.push({ name: 'library' })
  }
}

async function onSubmit(payload) {
  submitError.value = ''
  try {
    await addRecord({ ...payload, action_id: action.value.action_id })
    formOpen.value = false
    // PRD 流程 3：保存后自动返回首页，数据已在共享状态中刷新
    router.push({ name: 'home' })
  } catch (err) {
    submitError.value = err?.message || '添加失败，请重试'
  }
}
</script>

<template>
  <main class="page">
    <div class="container">
      <button type="button" class="back" @click="goBack">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            d="M15 6l-6 6 6 6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        返回动作库
      </button>

      <p v-if="loading" class="hint">加载中…</p>

      <div v-else-if="notFound" class="empty">
        <p class="empty__title">找不到这个动作</p>
        <RouterLink class="empty__link" :to="{ name: 'library' }">回动作库看看</RouterLink>
      </div>

      <template v-else-if="action">
        <header class="head">
          <span class="head__part">{{ action.body_part }}</span>
          <h1 class="head__title">{{ action.action_name }}</h1>
        </header>

        <ActionDemo v-if="demo" :demo="demo" />

        <section v-for="section in sections" :key="section.key" class="card block">
          <h2 class="block__label">{{ section.label }}</h2>
          <p class="block__text">{{ section.text }}</p>
        </section>

        <p v-if="submitError" class="banner" role="alert">{{ submitError }}</p>

        <button type="button" class="btn-primary" @click="formOpen = true">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
            />
          </svg>
          添加到今日训练
        </button>
      </template>
    </div>

    <RecordFormSheet
      :open="formOpen"
      mode="create"
      :action="action"
      @close="formOpen = false"
      @submit="onSubmit"
    />
  </main>
</template>

<style scoped>
.back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 14px;
  padding: 6px 2px;
  font-size: 14px;
  color: var(--text-muted);
}

.head {
  margin-bottom: 18px;
}

.head__part {
  display: inline-block;
  margin-bottom: 6px;
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--accent);
  background: var(--accent-soft);
}

.head__title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.block {
  padding: 14px;
  margin-bottom: 12px;
}

.block__label {
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--accent);
}

.block__text {
  margin: 0;
  font-size: 14px;
  line-height: 1.75;
  color: var(--text);
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

.empty__link {
  font-size: 14px;
  color: var(--accent);
}
</style>
