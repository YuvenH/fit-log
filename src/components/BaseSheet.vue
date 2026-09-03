<script setup>
/**
 * 底部弹出面板。
 * 集中处理无障碍与移动端细节：role=dialog、ESC 关闭、遮罩点击关闭、
 * 打开时锁定页面滚动、关闭后把焦点还给触发元素。
 */
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  /** 面板最大高度占视口比例，列表类内容可以给大一些 */
  maxHeightRatio: { type: Number, default: 0.86 },
})

const emit = defineEmits(['close'])

const titleId = useId()
const panelRef = ref(null)
/** 记录打开前的焦点元素，关闭后还原，避免焦点跳到页面顶部 */
let lastActiveElement = null

function close() {
  emit('close')
}

function onKeydown(event) {
  if (event.key === 'Escape') {
    event.stopPropagation()
    close()
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      lastActiveElement = document.activeElement
      document.body.style.overflow = 'hidden'
      await nextTick()
      // 聚焦面板本身而不是首个输入框，避免移动端键盘立刻弹起遮挡内容
      panelRef.value?.focus()
    } else {
      document.body.style.overflow = ''
      if (lastActiveElement instanceof HTMLElement) {
        lastActiveElement.focus()
        lastActiveElement = null
      }
    }
  },
)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="sheet-root" @keydown="onKeydown">
        <div class="sheet-overlay" @click="close" />

        <div
          ref="panelRef"
          class="sheet-panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
          :style="{ maxHeight: `${maxHeightRatio * 100}vh` }"
        >
          <header class="sheet-header">
            <h2 :id="titleId" class="sheet-title">{{ title }}</h2>
            <button type="button" class="sheet-close" aria-label="关闭" @click="close">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </header>

          <div class="sheet-body">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="sheet-footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sheet-root {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.sheet-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
}

.sheet-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 640px;
  background: var(--bg-elevated);
  border-top-left-radius: var(--radius-lg);
  border-top-right-radius: var(--radius-lg);
  border-top: 1px solid var(--border);
  outline: none;
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 16px 12px;
  flex-shrink: 0;
}

.sheet-title {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
}

.sheet-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: var(--text-muted);
  background: var(--bg-input);
  flex-shrink: 0;
}

.sheet-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0 16px;
}

.sheet-footer {
  flex-shrink: 0;
  padding: 14px 16px calc(14px + var(--safe-bottom));
  border-top: 1px solid var(--border);
}

/* 面板上滑 + 遮罩淡入 */
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.2s ease;
}
.sheet-enter-active .sheet-panel,
.sheet-leave-active .sheet-panel {
  transition: transform 0.22s cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-from .sheet-panel,
.sheet-leave-to .sheet-panel {
  transform: translateY(100%);
}
</style>
