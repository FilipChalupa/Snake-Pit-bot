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

		if (status === 'ended') {
			onEnd()
			return
		}
		const nextAction = evaluateNextMove(
			width,
			height,
			players,
			food,
			yourPlayerId,
		)

		// @TODO: remove delay
		await new Promise((resolve) => setTimeout(resolve, 300))
		await loop(nextAction)
	}
	await loop('forward')
}
