import pusher from '../../../lib/pusher'
import { getRoom } from '../../../lib/store'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { code, author } = req.body
  const roomCode = code?.toUpperCase()
  if (!roomCode || !author || !getRoom(roomCode)) return res.status(400).end()

  await pusher.trigger(`room-${roomCode}`, 'typing', { author })
  res.status(200).end()
}
