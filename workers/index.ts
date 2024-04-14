import { Ai } from '@cloudflare/ai'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use(
  '/*',
  cors({
    origin: ['*'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
  }),
)

app.get('/', async (c) => {
  return c.text(`EnglishTutor - ${new Date().toLocaleString()}`)
})

app.post('/api/corrections', async (c) => {
  const ai = new Ai(c.env?.AI)

  const buffer = await c.req.arrayBuffer()

  const { text } = await ai.run('@cf/openai/whisper', {
    audio: [...new Uint8Array(buffer)],
  })

  const correction = await ai.run('@cf/qwen/qwen1.5-0.5b-chat', {
    prompt: `
      # Instructions
      - you are a english tutor, you will talk about any topic and if necessary, make corrections.
      - if this is wrong, correct this following text to standard English.
      - you should give fast responses.
      - you should answer only the correction, not the original text or any other information.

      The following text needs correction: "${text}"


      Remember, you should only correct the text, not provide any other information.
    `,
    stream: false,
  })

  return c.json({
    transcript: text,
    // @ts-ignore
    correction: correction.response,
  })
})

app.post('/api/completions', async (c) => {
  const { messages } = await c.req.json()

  const ai = new Ai(c.env?.AI)
  const completions = await ai.run('@cf/meta/llama-2-7b-chat-fp16', {
    messages: [{ role: 'system', content: 'You are a english tutor, you will talk about any topic.' }, ...messages],
  })

  return c.json({
    // @ts-ignore
    answer: completions.response,
  })
})

export default app
