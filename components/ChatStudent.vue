<script setup lang="ts">
import dayjs from 'dayjs'

const props = defineProps<{
  time: Date
  message: string
  loading: boolean
  correction?: string
}>()

const hasCorrection = computed(() => props.correction && props.correction !== '')
</script>

<template>
  <div class="chat chat-end">
    <div class="chat-image avatar">
      <div class="w-10 rounded-full text-4xl">🤓</div>
    </div>
    <div class="chat-header">
      You
      <time class="text-xs opacity-50">{{ dayjs(props.time).format('hh:mm a') }}</time>
    </div>
    <div class="chat-bubble" v-if="!loading">{{ props.message }}</div>
    <div class="chat-bubble" v-else>
      <span class="animate-pulse">Thinking...</span>
    </div>
    <div class="chat-footer opacity-50 text-right max-w-lg" v-if="hasCorrection">
      Correction: {{ props.correction }}
    </div>
  </div>
</template>
