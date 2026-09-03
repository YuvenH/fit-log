/**
 * 生成 PWA 图标（无第三方依赖）。
 *
 * 用 node:zlib 手写最小 PNG 编码器，配合 4x 超采样做抗锯齿。
 * 这样图标可以随时用 `npm run icons` 重新生成，克隆仓库的人
 * 不需要额外安装 ImageMagick / Python 之类的图形工具链。
 *
 * 输出：
 *   public/icon-192.png           普通图标
 *   public/icon-512.png           普通图标（大尺寸）
 *   public/icon-maskable-512.png  Android 自适应图标，内容收在安全区内
 *   public/apple-touch-icon.png   iOS 添加到主屏幕用（180x180）
 */

import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../public')

const BG = [0x0f, 0x11, 0x15]
const ACCENT = [0xff, 0x6b, 0x35]

/** 超采样倍数，4 表示每个输出像素采 16 个子样本 */
const SS = 4

// ── PNG 编码 ─────────────────────────────────────────

const crcTable = (() => {
  const table = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c
  }
  return table
})()

function crc32(buf) {
  let c = -1
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  }
  return (c ^ -1) >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length, 0)

  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data])

  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(typeAndData), 0)

  return Buffer.concat([length, typeAndData, crc])
}

/**
 * 把 RGB 像素数据编码为 PNG。
 * @param {number} width
 * @param {number} height
 * @param {Buffer} rgb 长度为 width*height*3
 */
function encodePNG(width, height, rgb) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // color type: truecolor RGB
  ihdr[10] = 0 // compression: deflate
  ihdr[11] = 0 // filter: adaptive
  ihdr[12] = 0 // interlace: none

  // 每行前面加一个 filter type 字节（0 = None）
  const stride = width * 3
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0
    rgb.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ── 图形绘制 ─────────────────────────────────────────

/**
 * 圆角矩形的有符号距离函数，<= 0 表示点在形状内。
 */
function sdRoundRect(px, py, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2)
  const qx = Math.abs(px - (x + w / 2)) - (w / 2 - radius)
  const qy = Math.abs(py - (y + h / 2)) - (h / 2 - radius)
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0))
  const inside = Math.min(Math.max(qx, qy), 0)
  return outside + inside - radius
}

/**
 * 构建哑铃图形。坐标使用 0..1 归一化空间，便于按尺寸缩放。
 * @param {number} scale 内容缩放，maskable 图标用较小值以留出安全区
 */
function buildDumbbell(scale) {
  const shapes = []
  const cx = 0.5
  const cy = 0.5

  /** 以中心为基准放置一个矩形 */
  const rect = (offsetX, width, height, radius) => {
    shapes.push({
      x: cx + (offsetX - width / 2) * scale,
      y: cy - (height / 2) * scale,
      w: width * scale,
      h: height * scale,
      r: radius * scale,
    })
  }

  // 横杠
  rect(0, 0.52, 0.085, 0.042)
  // 内侧配重片（左右）
  rect(-0.225, 0.1, 0.32, 0.045)
  rect(0.225, 0.1, 0.32, 0.045)
  // 外侧配重片（左右）
  rect(-0.32, 0.075, 0.2, 0.036)
  rect(0.32, 0.075, 0.2, 0.036)

  return shapes
}

/**
 * 渲染一张图标。
 * @param {number} size 输出边长
 * @param {object} options
 * @param {number} options.contentScale 哑铃占比
 * @param {number} options.cornerRadius 背景圆角（0..0.5，相对边长），0 为直角
 */
function renderIcon(size, { contentScale = 1, cornerRadius = 0 } = {}) {
  const shapes = buildDumbbell(contentScale)
  const rgb = Buffer.alloc(size * size * 3)
  const subStep = 1 / SS
  const subSamples = SS * SS

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let bgHits = 0
      let accentHits = 0

      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          // 归一化坐标，取子像素中心
          const px = (x + (sx + 0.5) * subStep) / size
          const py = (y + (sy + 0.5) * subStep) / size

          const inBackground =
            cornerRadius > 0
              ? sdRoundRect(px, py, 0, 0, 1, 1, cornerRadius) <= 0
              : true
          if (!inBackground) continue
          bgHits++

          for (const shape of shapes) {
            if (sdRoundRect(px, py, shape.x, shape.y, shape.w, shape.h, shape.r) <= 0) {
              accentHits++
              break
            }
          }
        }
      }

      const idx = (y * size + x) * 3
      if (bgHits === 0) {
        // 圆角外：PNG 无 alpha 通道，填背景色即可（iOS/Android 会自行裁切）
        rgb[idx] = BG[0]
        rgb[idx + 1] = BG[1]
        rgb[idx + 2] = BG[2]
        continue
      }

      const accentRatio = accentHits / subSamples
      for (let c = 0; c < 3; c++) {
        rgb[idx + c] = Math.round(BG[c] * (1 - accentRatio) + ACCENT[c] * accentRatio)
      }
    }
  }

  return encodePNG(size, size, rgb)
}

// ── 输出 ─────────────────────────────────────────────

mkdirSync(OUT_DIR, { recursive: true })

const targets = [
  { file: 'icon-192.png', size: 192, options: { contentScale: 1 } },
  { file: 'icon-512.png', size: 512, options: { contentScale: 1 } },
  // maskable：Android 会按圆形裁切，内容收到 60% 保证不被切掉
  { file: 'icon-maskable-512.png', size: 512, options: { contentScale: 0.6 } },
  // iOS 主屏幕图标，系统自动加圆角，这里用满幅背景
  { file: 'apple-touch-icon.png', size: 180, options: { contentScale: 1 } },
]

for (const target of targets) {
  const png = renderIcon(target.size, target.options)
  writeFileSync(resolve(OUT_DIR, target.file), png)
  console.log(`生成 ${target.file}  ${target.size}x${target.size}  ${png.length} 字节`)
}

// favicon 用 SVG，浏览器标签页矢量显示更清晰
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="22" fill="#0f1115"/>
  <g fill="#ff6b35">
    <rect x="24" y="45.75" width="52" height="8.5" rx="4.2"/>
    <rect x="22.5" y="34" width="10" height="32" rx="4.5"/>
    <rect x="67.5" y="34" width="10" height="32" rx="4.5"/>
    <rect x="14.25" y="40" width="7.5" height="20" rx="3.6"/>
    <rect x="78.25" y="40" width="7.5" height="20" rx="3.6"/>
  </g>
</svg>
`
writeFileSync(resolve(OUT_DIR, 'favicon.svg'), favicon)
console.log('生成 favicon.svg')
