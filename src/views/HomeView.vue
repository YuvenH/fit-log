<script setup>
/**
 * 首页 / 训练日志页。
 * 承载 PRD 主流程 1：新增记录 → 选动作 → 填数据 → 保存 → 汇总展示 → 编辑/删除。
 */
import { computed, ref } from 'vue'
import RecordItem from '../components/RecordItem.vue'
import ActionPickerSheet from '../components/ActionPickerSheet.vue'
import RecordFormSheet from '../components/RecordFormSheet.vue'
import { useTrainLog } from '../composables/useTrainLog.js'
import { formatDisplayDate, formatDuration } from '../utils/date.js'

const { state, recordsWithAction, summary, addRecord, editRecord, removeRecord } =
  useTrainLog()

const pickerOpen = ref(false)
const formOpen = ref(false)
const formMode = ref('create')
const pendingAction = ref(null)
const editingRecord = ref(null)
const actionError = ref('')

const displayDate = computed(() =>
  state.dateKey ? formatDisplayDate(state.dateKey) : '',
)

const durationText = computed(() =>
  summary.value.durationSeconds === null
    ? '—'
    : formatDuration(summary.value.durationSeconds),
)

function openPicker() {
  actionError.value = ''
  pickerOpen.value = true
}

function onPick(action) {
  pendingAction.value = action
  formMode.value = 'create'
  pickerOpen.value = false
  formOpen.value = true
}

function onEdit(record) {
  actionError.value = ''
  editingRecord.value = record
  formMode.value = 'edit'
  formOpen.value = true
}

function closeForm() {
  formOpen.value = false
  pendingAction.value = null
  editingRecord.value = null
}

async function onSubmit(payload, { continueAdding }) {
  actionError.value = ''
  try {
    if (formMode.value === 'edit') {
      await editRecord(editingRecord.value.record_id, payload)
      closeForm()
      return
    }

    await addRecord({ ...payload, action_id: pendingAction.value.action_id })
    formOpen.value = false
    pendingAction.value = null

    // 「保存并继续添加」直接回到动作选择，减少重复点击
    if (continueAdding) {
      pickerOpen.value = true
    }
  } catch (err) {
    actionError.value = err?.message || '保存失败，请重试'
  }
}

async function onDelete(recordId) {
  actionError.value = ''
  try {
    await removeRecord(recordId)
    closeForm()
  } catch (err) {
    actionError.value = err?.message || '删除失败，请重试'
  }
}
</script>

<template>
  <main class="page">
    <div class="container">
      <header class="head">
        <p class="head__label">今日训练</p>
        <h1 class="head__date">{{ displayDate }}</h1>
      </header>

      <section class="summary" aria-label="当日训练汇总">
        <div class="stat">
          <span class="stat__value">{{ summary.actionCount }}</span>
          <span class="stat__label">训练动作</span>
        </div>
        <div class="stat">
          <span class="stat__value">{{ summary.totalGroups }}</span>
          <span class="stat__label">总组数</span>
        </div>
        <div class="stat">
          <span class="stat__value stat__value--text">{{ durationText }}</span>
          <span class="stat__label">预计时长</span>
        </div>
      </section>

      <p v-if="summary.bodyParts.length > 0" class="parts-line">
        今日部位：{{ summary.bodyParts.join(' / ') }}
      </p>

      <p v-if="state.error" class="banner banner--error" role="alert">{{ state.error }}</p>
      <p v-if="actionError" class="banner banner--error" role="alert">{{ actionError }}</p>

      <button type="button" class="btn-primary add-btn" @click="openPicker">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
          />
        </svg>
        新增训练记录
      </button>

      <section class="records">
        <h2 class="section-title">
          训练明细<template v-if="recordsWithAction.length > 0">
            （{{ recordsWithAction.length }}）</template
          >
        </h2>

        <p v-if="state.loading && recordsWithAction.length === 0" class="hint">加载中…</p>

        <div v-else-if="recordsWithAction.length === 0" class="empty">
          <p class="empty__title">今天还没有训练记录</p>
          <p class="empty__desc">点上面的按钮选个动作，30 秒记完一组</p>
        </div>

        <ul v-else class="record-list">
          <li v-for="record in recordsWithAction" :key="record.record_id">
            <RecordItem :record="record" @edit="onEdit" />
          </li>
        </ul>
      </section>

      <p v-if="summary.actionCount > 0" class="duration-note">
        预计时长按「每组约 30 秒 + 组间休息」累加估算，未填休息时长的按 60 秒计
      </p>
    </div>

    <ActionPickerSheet :open="pickerOpen" @close="pickerOpen = false" @pick="onPick" />

    <RecordFormSheet
      :open="formOpen"
      :mode="formMode"
      :action="pendingAction"
      :record="editingRecord"
      @close="closeForm"
      @submit="onSubmit"
      @delete="onDelete"
    />
  </main>
</template>

<style scoped>
.head {
  margin-bottom: 16px;
}

.head__label {
  margin: 0;
  font-size: 13px;
  color: var(--text-faint);
}

.head__date {
  margin: 2px 0 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 12px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 14px 6px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.stat__value {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.1;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.stat__value--text {
  font-size: 18px;
  padding-block: 3px;
}

.stat__label {
  font-size: 11px;
  color: var(--text-faint);
}

.parts-line {
  margin: 0 0 14px;
  font-size: 13px;
  color: var(--text-muted);
}

.banner {
  margin: 0 0 12px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
}

.banner--error {
  color: var(--danger);
  background: rgba(244, 97, 78, 0.12);
  border: 1px solid rgba(244, 97, 78, 0.3);
}

.add-btn {
  margin-bottom: 24px;
}

.records {
  margin-bottom: 18px;
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
  margin: 0 0 4px;
  font-size: 15px;
  color: var(--text-muted);
}

.empty__desc {
  margin: 0;
  font-size: 13px;
  color: var(--text-faint);
}

.record-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.duration-note {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
  color: var(--text-faint);
}
</style>
