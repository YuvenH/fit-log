/**
 * 日期工具。
 *
 * train_date 统一使用本地时区的 YYYY-MM-DD 字符串。
 * 刻意不用 toISOString()：那会转成 UTC，在东八区凌晨 8 点前会把日期算到前一天，
 * 导致「今天的训练」被记到昨天。
 */

/** 取本地日期的 YYYY-MM-DD */
export function toDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** 今天的日期键 */
export function todayKey() {
  return toDateKey()
}

/** 展示用格式：2026年9月3日 周四 */
export function formatDisplayDate(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${year}年${month}月${day}日 ${weekdays[date.getDay()]}`
}

/**
 * 把秒数格式化为易读时长。
 * @param {number} seconds
 * @returns {string} 例如 "1小时12分" / "48分" / "35秒"
 */
export function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0分'

  const totalMinutes = Math.floor(seconds / 60)
  if (totalMinutes < 1) return `${Math.round(seconds)}秒`

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes}分`
  return minutes === 0 ? `${hours}小时` : `${hours}小时${minutes}分`
}
