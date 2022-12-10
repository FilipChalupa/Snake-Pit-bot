import { runBot } from './runBot.js'

let joinedRoomIds = []

export const joinRoom = async (roomId, playerToken) => {
	joinedRoomIds.push(roomId)

	await runBot(roomId, playerToken, () => {
		joinedRoomIds = joinedRoomIds.filter((id) => id !== roomId)
	})
}

export const getJoinedRoomIds = () => joinedRoomIds
