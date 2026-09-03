/**
 * 日历状态（模块级单例）。
 *
 * 自己维护「当前月份 + 该月记录」，与 useTrainLog 的「当日记录」相互独立，
 * 但在日历里编辑/删除记录时会同时刷新 useTrainLog，
 * 否则改完切回首页会看到过期数据。
 */

import { computed, reactive, readonly } from 'vue'
import { listRecordsBetween, updateRecord, deleteRecord } from '../db/records.js'
import {
  currentMonthKey,
  addMonths,
  monthRange,
  buildMonthGrid,
  todayKey,
} from '../utils/date.js'
import { useActionLibrary } from './useActionLibrary.js'
import { useTrainLog } from './useTrainLog.js'

const state = reactive({
  monthKey: currentMonthKey(),
  /** 当月全部记录 */
  records: [],
  /** 当前选中的日期键，null 表示未选 */
  selectedDate: null,
  loading: false,
  error: '',
})

const { state: libraryState, load: loadLibrary } = useActionLibrary()
const { refresh: refreshTrainLog } = useTrainLog()

/** 拉取当前月份的记录 */
async function loadMonth() {
  state.loading = true
  state.error = ''
  try {
    await loadLibrary()
    const { from, to } = monthRange(state.monthKey)
    state.records = await listRecordsBetween(from, to)
  } catch (err) {
    state.error = err?.message || '日历数据加载失败'
  } finally {
    state.loading = false
  }
}

/** action_id → 动作信息 */
const actionMap = computed(
  () => new Map(libraryState.actions.map((action) => [action.action_id, action])),
)

/**
 * 每个日期的训练概要，供网格打标记。
 * @returns {Map<string, {count: number, groups: number, bodyParts: string[]}>}
 */
const summaryByDate = computed(() => {
  const map = new Map()

  for (const record of state.records) {
    let entry = map.get(record.train_date)
    if (!entry) {
      entry = { count: 0, groups: 0, bodyPartSet: new Set() }
      map.set(record.train_date, entry)
    }
    entry.count += 1
    entry.groups += record.group_num || 0

    const action = actionMap.value.get(record.action_id)
    if (action) entry.bodyPartSet.add(action.body_part)
  }

  // 把 Set 转成数组，避免模板里处理 Set
  const result = new Map()
  for (const [dateKey, entry] of map) {
    result.set(dateKey, {
      count: entry.count,
      groups: entry.groups,
      bodyParts: [...entry.bodyPartSet],
    })
  }
  return result
})

/** 月历网格，每格附带当天概要 */
const grid = computed(() =>
  buildMonthGrid(state.monthKey).map((cell) => ({
    ...cell,
    summary: summaryByDate.value.get(cell.dateKey) ?? null,
    isSelected: cell.dateKey === state.selectedDate,
  })),
)

/** 当月统计：训练天数、总动作数、总组数 */
const monthStats = computed(() => {
  const trainedDays = summaryByDate.value.size
  const totalGroups = state.records.reduce((sum, r) => sum + (r.group_num || 0), 0)
  return {
    trainedDays,
    actionCount: state.records.length,
    totalGroups,
  }
})

/** 选中日期的记录（已连接动作信息） */
const selectedRecords = computed(() => {
  if (!state.selectedDate) return []
  return state.records
    .filter((record) => record.train_date === state.selectedDate)
    .map((record) => {
      const action = actionMap.value.get(record.action_id)
      return {
        ...record,
        action_name: action?.action_name ?? '未知动作',
        body_part: action?.body_part ?? '未分类',
      }
    })
})

async function setMonth(monthKey) {
  state.monthKey = monthKey
  // 切月后原选中日期已不在视图内，清掉避免显示不属于当月的明细
  state.selectedDate = null
  await loadMonth()
}

function prevMonth() {
  return setMonth(addMonths(state.monthKey, -1))
}

function nextMonth() {
  return setMonth(addMonths(state.monthKey, 1))
}

/** 回到本月并选中今天 */
async function goToday() {
  const today = todayKey()
  state.monthKey = currentMonthKey()
  await loadMonth()
  state.selectedDate = today
}

function selectDate(dateKey) {
  // 再次点击已选中的日期则取消选择
  state.selectedDate = state.selectedDate === dateKey ? null : dateKey
}

/** 在日历里编辑记录，同时同步首页当日视图 */
async function editRecord(recordId, patch) {
  const record = await updateRecord(recordId, patch)
  await loadMonth()
  await refreshTrainLog()
  return record
}

/** 在日历里删除记录，同时同步首页当日视图 */
async function removeRecord(recordId) {
  await deleteRecord(recordId)
  await loadMonth()
  await refreshTrainLog()
}

export function useCalendar() {
  return {
    state: readonly(state),
    grid,
    monthStats,
    selectedRecords,
    summaryByDate,
    loadMonth,
    setMonth,
    prevMonth,
    nextMonth,
    goToday,
    selectDate,
    editRecord,
    removeRecord,
  }
}
