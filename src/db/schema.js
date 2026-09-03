/**
 * IndexedDB 结构定义。
 * 表名与字段严格对应 PRD 第 8 节的实体表设计。
 */

export const DB_NAME = 'fit_log_db'
export const DB_VERSION = 1

/** 健身动作表：存储系统内置标准化动作 */
export const STORE_ACTION = 'fit_action'
/** 训练记录表：存储用户每日训练的单条动作记录 */
export const STORE_RECORD = 'fit_train_record'

/** 六大训练部位，顺序即界面展示顺序 */
export const BODY_PARTS = ['胸', '背', '肩', '腿', '核心', '手臂']

export const IDX_ACTION_BODY_PART = 'idx_body_part'
export const IDX_RECORD_TRAIN_DATE = 'idx_train_date'
export const IDX_RECORD_ACTION_ID = 'idx_action_id'

/**
 * 创建 / 升级表结构。仅在 onupgradeneeded 中调用。
 * @param {IDBDatabase} db
 * @param {IDBTransaction} tx 升级事务，用于在建表后立即写入种子数据
 */
export function migrate(db) {
  if (!db.objectStoreNames.contains(STORE_ACTION)) {
    const actionStore = db.createObjectStore(STORE_ACTION, { keyPath: 'action_id' })
    actionStore.createIndex(IDX_ACTION_BODY_PART, 'body_part', { unique: false })
  }

  if (!db.objectStoreNames.contains(STORE_RECORD)) {
    const recordStore = db.createObjectStore(STORE_RECORD, { keyPath: 'record_id' })
    // 首页按日期查当日记录，是最高频的读路径
    recordStore.createIndex(IDX_RECORD_TRAIN_DATE, 'train_date', { unique: false })
    recordStore.createIndex(IDX_RECORD_ACTION_ID, 'action_id', { unique: false })
  }
}
