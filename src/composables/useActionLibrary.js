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

/** 加载动作库（含首次种子写入），重复调用只会真正执行一次 */
async function load({ force = false } = {}) {
  if (state.loaded && !force) return
  if (state.loading) return

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
  }
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
