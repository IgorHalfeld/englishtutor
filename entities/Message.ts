export enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
}

export interface Message {
  id: string
  role: MessageRole
  text: string
  loading: boolean
  correction?: string
  createdAt: Date
}
