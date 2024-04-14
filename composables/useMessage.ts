import { MessageRole, type Message } from '@/entities/Message'

interface ReplaceMessageTextAndLoadingOptions {
  id: string
  text: string
  correction?: string
}

const randomId = () => {
  return Math.random().toString(36).slice(2, 9)
}

export function useMessage() {
  const messages = ref<Message[]>([
    {
      id: randomId(),
      role: MessageRole.Assistant,
      text: "Tell me something in English, and I'll help with your vocabulary",
      createdAt: new Date(),
      loading: false,
    },
  ])

  const transformToAiMessages = () => {
    const messagesWithoutGreetings = messages.value.slice(1)
    const messagesCompleted = messagesWithoutGreetings.filter((message) => !message.loading)

    const aiMessages = messagesCompleted.map((message) => {
      return {
        role: message.role,
        content: message.text,
      }
    })

    return aiMessages
  }

  const createNewUserMessage = () => {
    const id = randomId()

    messages.value.push({
      id,
      role: MessageRole.User,
      text: '',
      createdAt: new Date(),
      loading: true,
    })

    return id
  }

  const createNewAssistantMessage = () => {
    const id = randomId()

    messages.value.push({
      id,
      role: MessageRole.Assistant,
      text: '',
      createdAt: new Date(),
      loading: true,
    })

    return id
  }

  const replaceMessageTextAndLoading = ({ id, text, correction }: ReplaceMessageTextAndLoadingOptions) => {
    messages.value = messages.value.map((message) => {
      if (message.id === id) {
        const withText = { ...message, loading: false, text, correction }
        return withText
      }

      return message
    })
  }

  return {
    messages,
    transformToAiMessages,
    createNewUserMessage,
    createNewAssistantMessage,
    replaceMessageTextAndLoading,
  }
}
