<script setup lang="ts">
import dayjs from 'dayjs'

const props = defineProps<{
  time: Date
  message: string
  loading: boolean
}>()
</script>

<template>
  <div class="chat chat-start">
    <div class="chat-image avatar">
      <div class="w-10 rounded-full text-4xl">🧠</div>
    </div>
    <div class="chat-header">
      English Tutor
      <time class="text-xs opacity-50">{{ dayjs(props.time).format('hh:mm a') }}</time>
    </div>
    <div class="chat-bubble" v-if="!loading">{{ props.message }}</div>
    <div class="chat-bubble" v-else>
      <span class="animate-pulse">Thinking...</span>
    </div>
  </div>
</template>
