import { evaluateNextAction } from './evaluateNextAction.js'
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
		const nextAction = evaluateNextAction(width, height, player, players, food)

		setTimeout(() => {
			loop(nextAction)
		}, 1)
	}
	await loop('forward')
}
