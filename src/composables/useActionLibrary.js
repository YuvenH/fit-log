/**
 * 动作库状态。
 *
 * 用模块级单例而不是 Pinia：动作库是静态只读数据，一次加载全局复用即可，
 * 引入状态管理库对这个体量属于冗余依赖。
 *
 * 筛选条件（部位 / 关键词）也放在单例里，从详情页返回动作库时能保留上次筛选。
 */

import { computed, reactive, readonly } from 'vue'
import { listActions, ensureSeeded, getAction } from '../db/actions.js'
import { BODY_PARTS } from '../db/schema.js'

const state = reactive({
  actions: [],
  loading: false,
  loaded: false,
  error: '',
  /** null 表示「全部」 */
  activeBodyPart: null,
  keyword: '',
})

/**
 * 进行中的加载 Promise。
 *
 * 必须缓存它：否则并发调用者只能拿到「正在加载」这个状态而无法等待完成。
 * 冷启动直接打开动作详情页时，App 与详情页会几乎同时调 load()，
 * 详情页需要在加载真正结束后才能判断动作存在与否，
 * 早期实现里第二个调用直接 return 导致详情页误判「找不到动作」。
 */
let inflight = null

/** 加载动作库（含首次种子写入）。并发调用共享同一次加载，重复调用不会重复执行 */
function load({ force = false } = {}) {
  if (state.loaded && !force) return Promise.resolve()
  if (inflight) return inflight

  inflight = (async () => {
    state.loading = true
    state.error = ''
    try {
      await ensureSeeded()
      state.actions = await listActions()
      state.loaded = true
    } catch (err) {
      state.error = err?.message || '动作库加载失败'
    } finally {
      state.loading = false
      inflight = null
    }
  })()

  return inflight
}

/** 按部位 + 关键词筛选后的动作列表 */
const filteredActions = computed(() => {
  const keyword = state.keyword.trim().toLowerCase()

  return state.actions.filter((action) => {
    if (state.activeBodyPart && action.body_part !== state.activeBodyPart) {
      return false
    }
    if (!keyword) return true

    // 名称匹配为主，同时允许用部位名搜索
    return (
      action.action_name.toLowerCase().includes(keyword) ||
      action.body_part.toLowerCase().includes(keyword)
    )
  })
})

/** 各部位动作数量，用于筛选栏角标 */
const countByBodyPart = computed(() => {
  const result = {}
  for (const part of BODY_PARTS) {
    result[part] = state.actions.filter((action) => action.body_part === part).length
  }
  return result
})

function setBodyPart(part) {
  state.activeBodyPart = state.activeBodyPart === part ? null : part
}

function setKeyword(value) {
  state.keyword = value
}

function resetFilter() {
  state.activeBodyPart = null
  state.keyword = ''
}

/** 优先从已加载列表命中，未命中再查库（例如直接访问详情页 URL 的场景） */
async function findAction(actionId) {
  const cached = state.actions.find((action) => action.action_id === actionId)
  if (cached) return cached
  return getAction(actionId)
}

export function useActionLibrary() {
  return {
    state: readonly(state),
    bodyParts: BODY_PARTS,
    filteredActions,
    countByBodyPart,
    load,
    setBodyPart,
    setKeyword,
    resetFilter,
    findAction,
  }
}
