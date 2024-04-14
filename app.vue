<script setup lang="ts">
import { MessageRole } from '@/entities/Message'
const { corrections, completions } = useServices()
const {
  messages,
  transformToAiMessages,
  createNewUserMessage,
  createNewAssistantMessage,
  replaceMessageTextAndLoading,
} = useMessage()
const { audioWav, speaking, record, stop, transformToWav } = useAudioRecorder()

const handleStartSpeak = () => {
  record()
}

const handleStopSpeak = async () => {
  stop()
  transformToWav()

  const userMessageId = createNewUserMessage()
  const { transcript, correction } = await corrections(audioWav.value!)

  replaceMessageTextAndLoading({
    id: userMessageId,
    text: transcript,
    correction: correction,
  })

  const assistnatMessageId = createNewAssistantMessage()
  const currentMessages = transformToAiMessages()
  const response = await completions(currentMessages)

  replaceMessageTextAndLoading({
    id: assistnatMessageId,
    text: response.answer,
  })
}

useHead({
  title: 'English tutor 🍕',
})

useSeoMeta({
  title: 'English tutor 🍕',
  ogTitle: 'English tutor 🍕',

  description: 'Speak and receive instant feedback about your vocabulary',
  ogDescription: 'Speak and receive instant feedback about your vocabulary',
})

defineOgImageComponent('Pergel', {
  headline: true,
  title: 'English tutor 🍕',
  description: 'Speak and receive instant feedback about your vocabulary',
})
</script>

<template>
  <MainContent>
    <template #header>
      <Header />
    </template>
    <template #content>
      <ChatGroup class="pb-20">
        <template v-for="message in messages">
          <ChatAssistant
            v-if="message.role === MessageRole.Assistant"
            :key="message.id"
            :message="message.text"
            :time="message.createdAt"
            :loading="message.loading"
          />
          <ChatStudent
            v-if="message.role === MessageRole.User"
            :key="message.id"
            :message="message.text"
            :correction="message.correction"
            :time="message.createdAt"
            :loading="message.loading"
          />
        </template>
      </ChatGroup>
      <Toolbar :speaking="speaking" @start-speak="handleStartSpeak" @stop-speak="handleStopSpeak" />
    </template>
  </MainContent>
</template>
