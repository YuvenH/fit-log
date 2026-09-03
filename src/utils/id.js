/**
 * 生成记录主键。
 * 优先用 crypto.randomUUID（现代 iOS Safari / 安卓浏览器均支持），
 * 不可用时退回时间戳 + 随机串，保证在任何环境下都不阻塞记录保存。
 */
export function createId(prefix = 'rec') {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`
  }
  const random = Math.random().toString(36).slice(2, 10)
  return `${prefix}_${Date.now().toString(36)}_${random}`
}
