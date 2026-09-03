/**
 * 当日训练日志状态（模块级单例）。
 *
 * 做成单例的关键原因：在动作详情页添加记录后返回首页，首页需要立刻反映新数据。
 * 共享同一份 state 就不需要在路由间传参或手动触发刷新。
 */

import { computed, reactive, readonly } from 'vue'
import {
  createRecord,
  updateRecord,
  deleteRecord,
  listRecordsByDate,
} from '../db/records.js'
import { todayKey } from '../utils/date.js'
import { useActionLibrary } from './useActionLibrary.js'

const state = reactive({
  dateKey: todayKey(),
  records: [],
  loading: false,
  error: '',
})

const { state: libraryState, load: loadLibrary } = useActionLibrary()

/** 重新读取当日记录 */
async function refresh() {
  state.loading = true
  state.error = ''
  try {
    // 记录展示需要动作名称与部位，确保动作库已就绪
    await loadLibrary()
    state.dateKey = todayKey()
    state.records = await listRecordsByDate(state.dateKey)
  } catch (err) {
    state.error = err?.message || '训练记录加载失败'
  } finally {
    state.loading = false
  }
}

/** 记录 + 动作信息的连接视图，供列表直接渲染 */
const recordsWithAction = computed(() => {
  const actionMap = new Map(
    libraryState.actions.map((action) => [action.action_id, action]),
  )

  return state.records.map((record) => {
    const action = actionMap.get(record.action_id)
    return {
      ...record,
      action_name: action?.action_name ?? '未知动作',
      body_part: action?.body_part ?? '未分类',
    }
  })
})

/** 未填写组间休息时的默认估值（秒） */
const DEFAULT_REST_SECONDS = 60
/** 单组动作执行耗时估值（秒） */
const SET_EXECUTION_SECONDS = 30

/**
 * 当日简易统计。
 *
 * 时长口径：P0 没有独立的计时器，按「每组执行耗时 + 组间休息」累加估算，
 *   单个动作 = 组数 × 30s + (组数 - 1) × 组间休息
 * 未填休息时长的按 60s 计。
 *
 * 曾考虑用「首末记录的创建时间差」，但那要求用户必须在训练过程中实时打卡，
 * 训练结束后一次性补录会得出接近 0 的荒谬值，因此改用与录入时机无关的估算。
 */
const summary = computed(() => {
  const records = state.records

  const totalGroups = records.reduce((sum, record) => sum + (record.group_num || 0), 0)
  const bodyParts = new Set(recordsWithAction.value.map((item) => item.body_part))

  const durationSeconds =
    records.length === 0
      ? null
      : records.reduce((sum, record) => {
          const groups = record.group_num || 0
          const rest = record.rest_time ?? DEFAULT_REST_SECONDS
          return sum + groups * SET_EXECUTION_SECONDS + Math.max(0, groups - 1) * rest
        }, 0)

  return {
    actionCount: records.length,
    totalGroups,
    durationSeconds,
    bodyParts: [...bodyParts],
  }
})

async function addRecord(input) {
  const record = await createRecord({ ...input, train_date: input.train_date || state.dateKey })
  if (record.train_date === state.dateKey) {
    await refresh()
  }
  return record
}

async function editRecord(recordId, patch) {
  const record = await updateRecord(recordId, patch)
  await refresh()
  return record
}

async function removeRecord(recordId) {
  await deleteRecord(recordId)
  await refresh()
}

export function useTrainLog() {
  return {
    state: readonly(state),
    recordsWithAction,
    summary,
    refresh,
    addRecord,
    editRecord,
    removeRecord,
  }
}
