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

/** 月份键 YYYY-MM */
export function toMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

/** 当月键 */
export function currentMonthKey() {
  return toMonthKey()
}

/** 月份键偏移，delta 为月数（可负） */
export function addMonths(monthKey, delta) {
  const [year, month] = monthKey.split('-').map(Number)
  // month - 1 + delta 交给 Date 自行处理跨年
  const date = new Date(year, month - 1 + delta, 1)
  return toMonthKey(date)
}

/** 展示用月份标题：2026年9月 */
export function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  return `${year}年${month}月`
}

/** 该月首日与末日的日期键，用于按区间查库 */
export function monthRange(monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  const first = new Date(year, month - 1, 1)
  const last = new Date(year, month, 0) // 下个月的第 0 天 = 本月最后一天
  return { from: toDateKey(first), to: toDateKey(last) }
}

/** 周一为起始的星期标题 */
export const WEEKDAY_LABELS = ['一', '二', '三', '四', '五', '六', '日']

/**
 * 构建月历网格。
 *
 * 以周一为一周起始（中文习惯），前后用相邻月份的日期补满整周，
 * 保证网格始终是 7 的整数倍，渲染时不需要处理空洞。
 *
 * @param {string} monthKey YYYY-MM
 * @returns {Array<{dateKey: string, day: number, inMonth: boolean, isToday: boolean}>}
 */
export function buildMonthGrid(monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  const today = todayKey()

  const firstOfMonth = new Date(year, month - 1, 1)
  // getDay(): 0=周日。转成周一起始的 0..6
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7

  const gridStart = new Date(year, month - 1, 1 - leadingBlanks)

  const daysInMonth = new Date(year, month, 0).getDate()
  const totalCells = Math.ceil((leadingBlanks + daysInMonth) / 7) * 7

  const cells = []
  for (let i = 0; i < totalCells; i++) {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + i,
    )
    const dateKey = toDateKey(date)
    cells.push({
      dateKey,
      day: date.getDate(),
      inMonth: date.getMonth() === month - 1 && date.getFullYear() === year,
      isToday: dateKey === today,
    })
  }
  return cells
}
