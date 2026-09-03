<script setup>
/**
 * 日历页。
 * 月历标记有训练的日期，点击某天查看当天明细，明细复用首页的记录卡片与编辑弹层。
 */
import { onMounted, ref } from 'vue'
import RecordItem from '../components/RecordItem.vue'
import RecordFormSheet from '../components/RecordFormSheet.vue'
import { useCalendar } from '../composables/useCalendar.js'
import { WEEKDAY_LABELS, formatMonthLabel, formatDisplayDate } from '../utils/date.js'

const {
  state,
  grid,
  monthStats,
  selectedRecords,
  loadMonth,
  prevMonth,
  nextMonth,
  goToday,
  selectDate,
  editRecord,
  removeRecord,
} = useCalendar()

const formOpen = ref(false)
const editingRecord = ref(null)
const actionError = ref('')

onMounted(() => {
  // 每次进入都重新拉取，保证在首页新增的记录能立刻反映到日历
  loadMonth()
})

function onEdit(record) {
  actionError.value = ''
  editingRecord.value = record
  formOpen.value = true
}

function closeForm() {
  formOpen.value = false
  editingRecord.value = null
}

async function onSubmit(payload) {
  actionError.value = ''
  try {
    await editRecord(editingRecord.value.record_id, payload)
    closeForm()
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

/** 无障碍用的日期描述 */
function cellLabel(cell) {
  const base = `${cell.day} 日`
  if (!cell.summary) return `${base}，无训练记录`
  return `${base}，${cell.summary.count} 个动作，共 ${cell.summary.groups} 组`
}
</script>

<template>
  <main class="page">
    <div class="container">
      <header class="head">
        <button
          type="button"
          class="nav"
          aria-label="上一个月"
          @click="prevMonth"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M15 6l-6 6 6 6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <h1 class="head__title">{{ formatMonthLabel(state.monthKey) }}</h1>

        <button
          type="button"
          class="nav"
          aria-label="下一个月"
          @click="nextMonth"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M9 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </header>

      <section class="stats" aria-label="本月训练统计">
        <div class="stat">
          <span class="stat__value">{{ monthStats.trainedDays }}</span>
          <span class="stat__label">训练天数</span>
        </div>
        <div class="stat">
          <span class="stat__value">{{ monthStats.actionCount }}</span>
          <span class="stat__label">动作次数</span>
        </div>
        <div class="stat">
          <span class="stat__value">{{ monthStats.totalGroups }}</span>
          <span class="stat__label">总组数</span>
        </div>
      </section>

      <p v-if="state.error" class="banner" role="alert">{{ state.error }}</p>

      <div class="calendar card">
        <div class="weekdays" aria-hidden="true">
          <span v-for="label in WEEKDAY_LABELS" :key="label">{{ label }}</span>
        </div>

        <div class="grid">
          <button
            v-for="cell in grid"
            :key="cell.dateKey"
            type="button"
            class="cell"
            :class="{
              'cell--out': !cell.inMonth,
              'cell--today': cell.isToday,
              'cell--trained': Boolean(cell.summary),
              'cell--selected': cell.isSelected,
            }"
            :aria-label="cellLabel(cell)"
            :aria-pressed="cell.isSelected"
            @click="selectDate(cell.dateKey)"
          >
            <span class="cell__day">{{ cell.day }}</span>
            <span v-if="cell.summary" class="cell__dots" aria-hidden="true">
              <i
                v-for="n in Math.min(cell.summary.bodyParts.length, 3)"
                :key="n"
                class="cell__dot"
              />
            </span>
          </button>
        </div>
      </div>

      <button type="button" class="btn-ghost today-btn" @click="goToday">
        回到今天
      </button>

      <section class="detail">
        <h2 class="section-title">
          {{ state.selectedDate ? formatDisplayDate(state.selectedDate) : '选择日期查看明细' }}
        </h2>

        <p v-if="actionError" class="banner" role="alert">{{ actionError }}</p>

        <p v-if="!state.selectedDate" class="hint">
          点击日历中带标记的日期，查看当天训练了什么
        </p>

        <div v-else-if="selectedRecords.length === 0" class="empty">
          <p class="empty__title">这天没有训练记录</p>
        </div>

        <ul v-else class="record-list">
          <li v-for="record in selectedRecords" :key="record.record_id">
            <RecordItem :record="record" @edit="onEdit" />
          </li>
        </ul>
      </section>
    </div>

    <RecordFormSheet
      :open="formOpen"
      mode="edit"
      :record="editingRecord"
      @close="closeForm"
      @submit="onSubmit"
      @delete="onDelete"
    />
  </main>
</template>

<style scoped>
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
}

.head__title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 50%;
  color: var(--text-muted);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
}

.nav:active {
  background: var(--bg-input);
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 14px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 12px 6px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.stat__value {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.1;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.stat__label {
  font-size: 11px;
  color: var(--text-faint);
}

.calendar {
  padding: 12px 10px;
  margin-bottom: 12px;
}

.weekdays,
.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.weekdays {
  margin-bottom: 6px;
}

.weekdays span {
  text-align: center;
  font-size: 11px;
  color: var(--text-faint);
}

.cell {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  aspect-ratio: 1;
  border-radius: 10px;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.cell:active {
  background: var(--bg-input);
}

.cell--out .cell__day {
  color: var(--text-faint);
  opacity: 0.45;
}

.cell__day {
  font-size: 14px;
  line-height: 1;
}

/* 今天：描边标识，不抢占选中态的视觉 */
.cell--today {
  box-shadow: inset 0 0 0 1px var(--text-faint);
}

.cell--trained .cell__day {
  font-weight: 700;
  color: var(--accent);
}

.cell--selected {
  background: var(--accent);
}

.cell--selected .cell__day {
  color: #fff;
}

.cell__dots {
  display: flex;
  gap: 2px;
  height: 4px;
}

.cell__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent);
}

.cell--selected .cell__dot {
  background: #fff;
}

.today-btn {
  margin-bottom: 22px;
}

.detail {
  margin-bottom: 8px;
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
  margin: 10px 0;
  font-size: 13px;
  color: var(--text-faint);
}

.empty {
  padding: 24px 16px;
  text-align: center;
  border: 1px dashed var(--border);
  border-radius: var(--radius);
}

.empty__title {
  margin: 0;
  font-size: 14px;
  color: var(--text-muted);
}

.record-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
