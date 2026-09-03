<script setup>
import { onMounted } from 'vue'
import TabBar from './components/TabBar.vue'
import { useActionLibrary } from './composables/useActionLibrary.js'
import { useTrainLog } from './composables/useTrainLog.js'

const { load } = useActionLibrary()
const { refresh } = useTrainLog()

onMounted(async () => {
  // 启动即准备好动作库与当日记录，后续页面切换无需再等 IO
  await load()
  await refresh()
})
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
  <TabBar />
</template>
