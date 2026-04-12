import { customAlphabet } from 'nanoid'
import { createRoom, getRoom } from '../../../lib/store'

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const nanoid = customAlphabet(alphabet, 6)

const WORDS = ['QWER', 'TYUI', 'ASDF', 'GHJK', 'ZXCV', 'UIOP', 'HJLK', 'VBNM', 'GOAT', 'NEOR', 'SAMZ', 'KAMI', 'VROM']

function genCode() {
  return WORDS[Math.floor(Math.random() * WORDS.length)] + '-' + nanoid().slice(0, 2)
}

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, topic, visibility, createdBy } = req.body
  if (!name || !createdBy) return res.status(400).json({ error: 'name and createdBy required' })

  let code
  let attempts = 0
  do { code = genCode(); attempts++ } while (getRoom(code) && attempts < 20)

  const room = createRoom({ code, name, topic: topic || '', visibility: visibility || 'public', createdBy })
  res.status(201).json(room)
}
