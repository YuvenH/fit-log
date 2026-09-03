/**
 * 健身动作表（fit_action）数据访问。
 * P0 版本动作库为系统内置只读数据，自定义动作属于 P1。
 */

import { getAll, getByKey, putAll, count } from './idb.js'
import { STORE_ACTION, BODY_PARTS } from './schema.js'
import { SEED_ACTIONS } from './seedActions.js'

/**
 * 确保内置动作已写入本地库。
 *
 * 按 action_id 幂等 upsert：首次启动全量写入，后续版本增补动作时
 * 只补差集，既不需要升级 DB 版本，也不会覆盖用户数据。
 * @returns {Promise<number>} 本次新增的动作数量
 */
export async function ensureSeeded() {
  const existingCount = await count(STORE_ACTION)

  if (existingCount === 0) {
    await putAll(STORE_ACTION, SEED_ACTIONS)
    return SEED_ACTIONS.length
  }

  const existing = await getAll(STORE_ACTION)
  const existingIds = new Set(existing.map((item) => item.action_id))
  const missing = SEED_ACTIONS.filter((item) => !existingIds.has(item.action_id))

  if (missing.length > 0) {
    await putAll(STORE_ACTION, missing)
  }
  return missing.length
}

/** 部位在界面中的固定顺序，用于排序 */
const bodyPartOrder = new Map(BODY_PARTS.map((part, index) => [part, index]))

/**
 * 读取全部动作，按「部位顺序 → sort 权重 → 名称」排序。
 * @returns {Promise<Array>}
 */
export async function listActions() {
  const actions = await getAll(STORE_ACTION)
  return actions.sort((a, b) => {
    const partDiff =
      (bodyPartOrder.get(a.body_part) ?? 99) - (bodyPartOrder.get(b.body_part) ?? 99)
    if (partDiff !== 0) return partDiff

    const sortDiff = (a.sort ?? 99) - (b.sort ?? 99)
    if (sortDiff !== 0) return sortDiff

    return a.action_name.localeCompare(b.action_name, 'zh-CN')
  })
}

/**
 * 按主键读取单个动作。
 * @param {string} actionId
 * @returns {Promise<object | undefined>}
 */
export function getAction(actionId) {
  return getByKey(STORE_ACTION, actionId)
}
