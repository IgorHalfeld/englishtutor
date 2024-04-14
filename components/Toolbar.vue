<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    speaking: boolean
  }>(),
  {
    speaking: false,
  },
)

const emit = defineEmits<{
  (e: 'start-speak'): void
  (e: 'stop-speak'): void
}>()

const handleInteraction = () => {
  if (props.speaking) {
    emit('stop-speak')
    return
  }

  emit('start-speak')
}

const label = computed(() => {
  return props.speaking ? '🔇 Stop' : '🎤 Speak'
})
</script>

<template>
  <div class="fixed flex justify-center items-center bottom-0 left-0 w-full p-5">
    <button
      @click="handleInteraction"
      :class="{
        'animate-pulse bg-red-100': props.speaking,
      }"
      class="rounded-full text-xl font-bold flex justify-center items-center bg-gray-100 p-5"
    >
      {{ label }}
    </button>
  </div>
</template>
