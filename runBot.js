import { evaluateNextMove } from './evaluateNextMove.js'
import { snakePitServerUrl } from './snakePitServerUrl.js'

export const runBot = async (roomId, playerToken, onEnd) => {
	const loop = async (action) => {
		const payload = {
			playerToken,
			action,
		}
		const response = await fetch(`${snakePitServerUrl}/room/${roomId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		})
		const {
			room: { width, height, players, food, status },
			yourPlayerId,
		} = await response.json()
		const player = players.find(
			(otherPlayer) => otherPlayer.id === yourPlayerId,
		)
		if (status === 'ended' || !player.isAlive) {
			onEnd()
			return
		}
		const nextAction = evaluateNextMove(width, height, player, players, food)

		// @TODO: remove delay
		await new Promise((resolve) => setTimeout(resolve, 300))
		await loop(nextAction)
	}
	await loop('forward')
}
