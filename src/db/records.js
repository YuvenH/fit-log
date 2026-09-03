/**
 * 训练记录表（fit_train_record）数据访问。
 * 字段与 PRD 第 8 节表 2 一一对应。
 */

import { getAllByIndex, getAllByIndexRange, getByKey, put, remove } from './idb.js'
import { STORE_RECORD, IDX_RECORD_TRAIN_DATE } from './schema.js'
import { createId } from '../utils/id.js'
import { todayKey } from '../utils/date.js'

/**
 * 把表单里的字符串输入规整成数字，空值统一存 null。
 * @param {unknown} value
 * @returns {number | null}
 */
function toNullableNumber(value) {
  if (value === '' || value === null || value === undefined) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

/**
 * 必填的正整数字段，非法输入回退到 1，避免出现 0 组或负数组。
 * @param {unknown} value
 * @returns {number}
 */
function toPositiveInt(value) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 1) return 1
  return Math.floor(parsed)
}

/**
 * 新增一条训练记录。
 * @param {object} input
 * @returns {Promise<object>} 落库后的完整记录
 */
export async function createRecord(input) {
  const now = Date.now()
  const record = {
    record_id: createId(),
    action_id: input.action_id,
    train_date: input.train_date || todayKey(),
    group_num: toPositiveInt(input.group_num),
    repeat_num: toPositiveInt(input.repeat_num),
    weight: toNullableNumber(input.weight),
    rest_time: toNullableNumber(input.rest_time),
    remark: (input.remark ?? '').trim(),
    create_time: now,
    update_time: now,
  }

  await put(STORE_RECORD, record)
  return record
}

/**
 * 更新一条已有记录。create_time 保持不变，只刷新 update_time。
 * @param {string} recordId
 * @param {object} patch
 * @returns {Promise<object>} 更新后的记录
 */
export async function updateRecord(recordId, patch) {
  const existing = await getByKey(STORE_RECORD, recordId)
  if (!existing) {
    throw new Error('记录不存在，可能已被删除')
  }

  // 只覆盖 patch 里显式出现的字段。
  // 不能用 ?? 判断：可空字段被用户主动清空时传的就是 ''，那是有效的「置空」意图，
  // 而字段缺失才表示「不修改」，两者必须区分开。
  const take = (key, transform) =>
    key in patch ? transform(patch[key]) : existing[key]

  const updated = {
    ...existing,
    action_id: patch.action_id ?? existing.action_id,
    train_date: patch.train_date ?? existing.train_date,
    group_num: take('group_num', toPositiveInt),
    repeat_num: take('repeat_num', toPositiveInt),
    weight: take('weight', toNullableNumber),
    rest_time: take('rest_time', toNullableNumber),
    remark: take('remark', (value) => (value ?? '').trim()),
    update_time: Date.now(),
  }

  await put(STORE_RECORD, updated)
  return updated
}

/**
 * 删除一条记录。
 * @param {string} recordId
 */
export function deleteRecord(recordId) {
  return remove(STORE_RECORD, recordId)
}

/**
 * 读取某一天的全部记录，按创建时间正序（即录入顺序）。
 * @param {string} dateKey YYYY-MM-DD
 * @returns {Promise<Array>}
 */
export async function listRecordsByDate(dateKey) {
  const records = await getAllByIndex(STORE_RECORD, IDX_RECORD_TRAIN_DATE, dateKey)
  return records.sort((a, b) => a.create_time - b.create_time)
}

/**
 * 读取单条记录。
 * @param {string} recordId
 */
export function getRecord(recordId) {
  return getByKey(STORE_RECORD, recordId)
}

/**
 * 读取某个日期区间内的全部记录，按日期与创建顺序正序。
 * 日历按月拉取时用这个，一次 IO 拿到整月数据，避免逐日查询。
 * @param {string} fromDate YYYY-MM-DD（含）
 * @param {string} toDate YYYY-MM-DD（含）
 * @returns {Promise<Array>}
 */
export async function listRecordsBetween(fromDate, toDate) {
  const records = await getAllByIndexRange(
    STORE_RECORD,
    IDX_RECORD_TRAIN_DATE,
    fromDate,
    toDate,
  )
  return records.sort(
    (a, b) => a.train_date.localeCompare(b.train_date) || a.create_time - b.create_time,
  )
}
