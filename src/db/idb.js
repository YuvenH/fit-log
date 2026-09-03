/**
 * 极简 IndexedDB 封装。
 *
 * 刻意不引入 idb / dexie 等库：本应用只有两张表、读写路径固定，
 * 手写约 100 行即可覆盖，符合「杜绝冗余依赖」的技术约束。
 */

import { DB_NAME, DB_VERSION, migrate } from './schema.js'

/** @type {Promise<IDBDatabase> | null} 单例连接，避免重复 open */
let dbPromise = null

/**
 * 把 IDBRequest 转成 Promise。
 * @template T
 * @param {IDBRequest<T>} request
 * @returns {Promise<T>}
 */
function toPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/**
 * 等待事务真正落盘。写操作必须等这个，否则可能读到旧数据。
 * @param {IDBTransaction} tx
 * @returns {Promise<void>}
 */
function txComplete(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error ?? new Error('事务被中止'))
  })
}

/**
 * 打开数据库（单例）。
 * @returns {Promise<IDBDatabase>}
 */
export function openDB() {
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('当前浏览器不支持 IndexedDB，无法保存训练记录'))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => migrate(request.result)

    request.onsuccess = () => {
      const db = request.result
      // 其它标签页触发升级时主动让路，避免连接被阻塞
      db.onversionchange = () => {
        db.close()
        dbPromise = null
      }
      resolve(db)
    }

    request.onerror = () => reject(request.error)
    request.onblocked = () => reject(new Error('数据库被其它标签页占用，请关闭后重试'))
  })

  // open 失败时清掉缓存的 promise，下次调用可重试
  dbPromise.catch(() => {
    dbPromise = null
  })

  return dbPromise
}

/**
 * 在指定 store 上执行一次操作。
 * @template T
 * @param {string} storeName
 * @param {IDBTransactionMode} mode
 * @param {(store: IDBObjectStore) => Promise<T> | T} handler
 * @returns {Promise<T>}
 */
async function withStore(storeName, mode, handler) {
  const db = await openDB()
  const tx = db.transaction(storeName, mode)
  const store = tx.objectStore(storeName)

  const result = await handler(store)
  // 读事务也等一下，保证拿到的结果对应一个已结束的一致性快照
  await txComplete(tx)
  return result
}

/** 读取 store 全部记录 */
export function getAll(storeName) {
  return withStore(storeName, 'readonly', (store) => toPromise(store.getAll()))
}

/** 按主键读取单条，不存在返回 undefined */
export function getByKey(storeName, key) {
  return withStore(storeName, 'readonly', (store) => toPromise(store.get(key)))
}

/** 按索引精确匹配读取多条 */
export function getAllByIndex(storeName, indexName, value) {
  return withStore(storeName, 'readonly', (store) =>
    toPromise(store.index(indexName).getAll(value)),
  )
}

/** 写入单条（存在则覆盖） */
export function put(storeName, value) {
  return withStore(storeName, 'readwrite', (store) => toPromise(store.put(value)))
}

/** 批量写入，同一事务内完成 */
export function putAll(storeName, values) {
  return withStore(storeName, 'readwrite', (store) =>
    Promise.all(values.map((value) => toPromise(store.put(value)))),
  )
}

/** 按主键删除 */
export function remove(storeName, key) {
  return withStore(storeName, 'readwrite', (store) => toPromise(store.delete(key)))
}

/** 统计条数 */
export function count(storeName) {
  return withStore(storeName, 'readonly', (store) => toPromise(store.count()))
}
