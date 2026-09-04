import type { Message } from '../core/types'

const ENDPOINT = 'https://openai.rc.asu.edu/v1/chat/completions'
const MODEL = 'glm-4-5v'

export async function ask(
  image: string,
  question: string,
  history: Message[]
): Promise<string> {
  const key = process.env.ASU_API_KEY
  if (!key) throw new Error('ASU_API_KEY is not set')

  const messages = [
    ...history.map(m => ({ role: m.role, content: m.content })),
    {
      role: 'user',
      content: [
        { type: 'text', text: question || 'What is this?' },
        { type: 'image_url', image_url: { url: image } }
      ]
    }
  ]

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({ model: MODEL, messages, max_tokens: 1500 })
  })

  if (!res.ok) {
    throw new Error(`ASU API ${res.status}: ${await res.text()}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('Model returned empty content')
  return content
}
