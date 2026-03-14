import Groq from 'groq-sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { db } from './db'

let groqClient: Groq | null = null
let geminiClient: GoogleGenerativeAI | null = null

function getGroq(): Groq {
  if (!groqClient) groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY! })
  return groqClient
}

function getGemini(): GoogleGenerativeAI {
  if (!geminiClient) geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  return geminiClient
}

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!process.env.GEMINI_API_KEY) return []
  const model = getGemini().getGenerativeModel({ model: 'gemini-embedding-001' })
  const result = await model.embedContent(text.slice(0, 8000))
  return result.embedding.values
}

export async function upsertEmbedding(contentId: string, text: string): Promise<void> {
  if (!process.env.GEMINI_API_KEY) return
  try {
    const embedding = await generateEmbedding(text)
    if (!embedding.length) return
    const vector = `[${embedding.join(',')}]`
    await db.$executeRaw`
      UPDATE contents SET embedding = ${vector}::vector WHERE id = ${contentId}
    `
    console.log('[Embedding] saved for:', contentId)
  } catch (err) {
    console.error('[Embedding]', err)
  }
}

export async function semanticSearch(userId: string, query: string, topK = 6): Promise<string[]> {
  if (!process.env.GEMINI_API_KEY) return []
  try {
    const embedding = await generateEmbedding(query)
    if (!embedding.length) return []
    const vector = `[${embedding.join(',')}]`
    const results = await db.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM contents
      WHERE "userId" = ${userId}
        AND "isArchived" = false
        AND embedding IS NOT NULL
      ORDER BY embedding <=> ${vector}::vector
      LIMIT ${topK}
    `
    return results.map((r) => r.id)
  } catch (err) {
    console.error('[SemanticSearch]', err)
    return []
  }
}

export async function ragChat(
  userId: string,
  question: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY not configured')

  const contextIds = await semanticSearch(userId, question, 6)
  let contextBlock = ''

  if (contextIds.length > 0) {
    const items = await db.content.findMany({
      where: { id: { in: contextIds }, userId },
      select: { title: true, type: true, url: true, content: true, previewDescription: true, tags: true },
    })
    contextBlock = items.map((item) => {
      const parts = [`[${item.type.toUpperCase()}] ${item.title}`]
      if (item.url) parts.push(`URL: ${item.url}`)
      if (item.content) parts.push(`Content: ${item.content.slice(0, 600)}`)
      if (item.previewDescription) parts.push(`Description: ${item.previewDescription}`)
      if (item.tags.length) parts.push(`Tags: ${item.tags.join(', ')}`)
      return parts.join('\n')
    }).join('\n\n---\n\n')
  }

  const systemPrompt = contextBlock
    ? `You are a knowledgeable assistant with access to the user's personal knowledge vault. Answer concisely and accurately using their saved content.\n\nRelevant saved content:\n\n${contextBlock}`
    : `You are a helpful assistant for a knowledge vault app. The user has no closely matching saved content for this query, but answer helpfully anyway.`

  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    ...history.slice(-8).map((h) => ({ role: h.role, content: h.content }) as Groq.Chat.ChatCompletionMessageParam),
    { role: 'user', content: question },
  ]

  const completion = await getGroq().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
    max_tokens: 1000,
    temperature: 0.7,
  })

  return completion.choices[0]?.message?.content || 'No response generated'
}
