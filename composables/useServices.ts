import type { CompletionMessage } from '@/entities/AI'

interface CorrectionsResponse {
  transcript: string
  correction: string
}

interface CompletionResponse {
  answer: string
}

export function useServices() {
  const config = useRuntimeConfig()

  const corrections = async (wav: Blob) => {
    const response = await $fetch<CorrectionsResponse>(`${config.public.workerUrl}/api/corrections`, {
      method: 'POST',
      body: wav,
    })

    return response
  }

  const completions = async (messages: CompletionMessage[]) => {
    const response = await $fetch<CompletionResponse>(`${config.public.workerUrl}/api/completions`, {
      method: 'POST',
      body: { messages },
    })

    return response
  }

  return {
    corrections,
    completions,
  }
}
