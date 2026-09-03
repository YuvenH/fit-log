<script setup>
/**
 * 训练记录表单，新增与编辑共用。
 *
 * 组数/次数配了步进按钮：打卡场景下用拇指点两下比调起数字键盘更快，
 * 契合「极简操作、快速打卡」的产品定位。
 */
import { computed, ref, watch } from 'vue'
import BaseSheet from './BaseSheet.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  /** create | edit */
  mode: { type: String, default: 'create' },
  /** 新增时传入选中的动作 */
  action: { type: Object, default: null },
  /** 编辑时传入已有记录（含 action_name / body_part） */
  record: { type: Object, default: null },
})

const emit = defineEmits(['close', 'submit', 'delete'])

const form = ref(createEmptyForm())
const errors = ref({})
const submitting = ref(false)
const confirmingDelete = ref(false)

function createEmptyForm() {
  return {
    group_num: 3,
    repeat_num: 12,
    weight: '',
    rest_time: '',
    remark: '',
  }
}

const isEdit = computed(() => props.mode === 'edit')

const actionName = computed(() =>
  isEdit.value ? props.record?.action_name : props.action?.action_name,
)
const bodyPart = computed(() =>
  isEdit.value ? props.record?.body_part : props.action?.body_part,
)

const title = computed(() => (isEdit.value ? '编辑训练记录' : '记录训练数据'))

// 打开时初始化表单：编辑回填已有值，新增回到默认值
watch(
  () => [props.open, props.record, props.action],
  () => {
    if (!props.open) return
    errors.value = {}
    confirmingDelete.value = false
    submitting.value = false

    if (isEdit.value && props.record) {
      form.value = {
        group_num: props.record.group_num ?? 3,
        repeat_num: props.record.repeat_num ?? 12,
        weight: props.record.weight ?? '',
        rest_time: props.record.rest_time ?? '',
        remark: props.record.remark ?? '',
      }
    } else {
      form.value = createEmptyForm()
    }
  },
  { immediate: true },
)

function step(field, delta) {
  const current = Number(form.value[field])
  const base = Number.isFinite(current) ? current : 0
  form.value[field] = Math.max(1, base + delta)
}

function validate() {
  const next = {}

  const groups = Number(form.value.group_num)
  if (!Number.isFinite(groups) || groups < 1) {
    next.group_num = '组数至少为 1'
  }

  const reps = Number(form.value.repeat_num)
  if (!Number.isFinite(reps) || reps < 1) {
    next.repeat_num = '每组次数至少为 1'
  }

  if (form.value.weight !== '' && Number(form.value.weight) < 0) {
    next.weight = '重量不能为负数'
  }

  if (form.value.rest_time !== '' && Number(form.value.rest_time) < 0) {
    next.rest_time = '休息时长不能为负数'
  }

  errors.value = next
  return Object.keys(next).length === 0
}

async function submit({ continueAdding = false } = {}) {
  if (submitting.value) return
  if (!validate()) return

  submitting.value = true
  try {
    emit('submit', { ...form.value }, { continueAdding })
  } finally {
    submitting.value = false
  }
}

function onDeleteClick() {
  if (!confirmingDelete.value) {
    confirmingDelete.value = true
    return
  }
  emit('delete', props.record?.record_id)
}
</script>

<template>
  <BaseSheet :open="open" :title="title" @close="emit('close')">
    <div v-if="actionName" class="target">
      <span class="target__name">{{ actionName }}</span>
      <span v-if="bodyPart" class="target__part">{{ bodyPart }}</span>
    </div>

    <form class="form" @submit.prevent="submit()">
      <div class="grid">
        <div class="field">
          <label class="field__label" for="field-groups">组数</label>
          <div class="stepper">
            <button
              type="button"
              class="stepper__btn"
              aria-label="减少组数"
              @click="step('group_num', -1)"
            >
              −
            </button>
            <input
              id="field-groups"
              v-model="form.group_num"
              class="stepper__input"
              type="number"
              inputmode="numeric"
              min="1"
              step="1"
              :aria-invalid="Boolean(errors.group_num)"
            />
            <button
              type="button"
              class="stepper__btn"
              aria-label="增加组数"
              @click="step('group_num', 1)"
            >
              +
            </button>
          </div>
          <p v-if="errors.group_num" class="field__error">{{ errors.group_num }}</p>
        </div>

        <div class="field">
          <label class="field__label" for="field-reps">每组次数</label>
          <div class="stepper">
            <button
              type="button"
              class="stepper__btn"
              aria-label="减少次数"
              @click="step('repeat_num', -1)"
            >
              −
            </button>
            <input
              id="field-reps"
              v-model="form.repeat_num"
              class="stepper__input"
              type="number"
              inputmode="numeric"
              min="1"
              step="1"
              :aria-invalid="Boolean(errors.repeat_num)"
            />
            <button
              type="button"
              class="stepper__btn"
              aria-label="增加次数"
              @click="step('repeat_num', 1)"
            >
              +
            </button>
          </div>
          <p v-if="errors.repeat_num" class="field__error">{{ errors.repeat_num }}</p>
        </div>

        <div class="field">
          <label class="field__label" for="field-weight">重量（kg，可留空）</label>
          <input
            id="field-weight"
            v-model="form.weight"
            class="input"
            type="number"
            inputmode="decimal"
            min="0"
            step="0.5"
            placeholder="自重可留空"
            :aria-invalid="Boolean(errors.weight)"
          />
          <p v-if="errors.weight" class="field__error">{{ errors.weight }}</p>
        </div>

        <div class="field">
          <label class="field__label" for="field-rest">组间休息（秒，可留空）</label>
          <input
            id="field-rest"
            v-model="form.rest_time"
            class="input"
            type="number"
            inputmode="numeric"
            min="0"
            step="10"
            placeholder="如 90"
            :aria-invalid="Boolean(errors.rest_time)"
          />
          <p v-if="errors.rest_time" class="field__error">{{ errors.rest_time }}</p>
        </div>
      </div>

      <div class="field">
        <label class="field__label" for="field-remark">备注（可留空）</label>
        <textarea
          id="field-remark"
          v-model="form.remark"
          class="input textarea"
          rows="2"
          placeholder="今天状态、递减组安排等"
        />
      </div>
    </form>

    <template #footer>
      <div v-if="isEdit" class="actions">
        <button type="button" class="btn-primary" @click="submit()">保存修改</button>
        <button
          type="button"
          class="btn-danger"
          :class="{ 'btn-danger--confirm': confirmingDelete }"
          @click="onDeleteClick"
        >
          {{ confirmingDelete ? '再点一次确认删除' : '删除这条记录' }}
        </button>
      </div>

      <div v-else class="actions">
        <button type="button" class="btn-primary" @click="submit()">保存</button>
        <button type="button" class="btn-ghost" @click="submit({ continueAdding: true })">
          保存并继续添加
        </button>
      </div>
    </template>
  </BaseSheet>
</template>

<style scoped>
.target {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  margin-bottom: 16px;
  border-radius: var(--radius-sm);
  background: var(--accent-soft);
}

.target__name {
  font-size: 15px;
  font-weight: 600;
  color: var(--accent);
}

.target__part {
  font-size: 12px;
  color: var(--text-muted);
}

.form {
  padding-bottom: 8px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 14px;
}

.field {
  min-width: 0;
}

.field__label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  color: var(--text-muted);
}

.field__error {
  margin: 5px 0 0;
  font-size: 12px;
  color: var(--danger);
}

.input {
  width: 100%;
  min-height: 46px;
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-input);
}

.input::placeholder {
  color: var(--text-faint);
}

.textarea {
  min-height: 62px;
  padding: 10px 12px;
  line-height: 1.5;
  resize: none;
}

.stepper {
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-input);
  overflow: hidden;
}

.stepper__btn {
  flex-shrink: 0;
  width: 40px;
  height: 46px;
  font-size: 20px;
  color: var(--text-muted);
}

.stepper__btn:active {
  background: var(--border);
}

.stepper__input {
  flex: 1;
  min-width: 0;
  width: 100%;
  height: 46px;
  border: none;
  background: none;
  text-align: center;
  font-weight: 600;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-danger {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  color: var(--danger);
  background: var(--bg-elevated);
  font-size: 15px;
}

.btn-danger--confirm {
  color: #fff;
  background: var(--danger);
  border-color: var(--danger);
}
</style>
