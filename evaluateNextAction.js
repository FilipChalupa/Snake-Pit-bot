export const evaluateNextAction = (width, height, player, allPlayers, food) => {
	const isObstacle = (() => {
		const obstacles = {}
		for (let i = -1; i <= width; i++) {
			obstacles[i] = {}
			obstacles[i][-1] = true
			obstacles[i][height] = true
		}
		for (let i = 0; i < height; i++) {
			obstacles[-1][i] = true
			obstacles[width][i] = true
		}
		allPlayers.forEach((otherPlayer) => {
			otherPlayer.fromHeadPosition.forEach(({ x, y }) => {
				obstacles[x][y] = true
			})
		})
		return (x, y) => obstacles[x]?.[y] ?? false
	})()

	let action = 'forward'

	const headPosition = player.fromHeadPosition[0]
	const neckPosition = player.fromHeadPosition[1]
	const direction = {
		x: headPosition.x - neckPosition.x,
		y: headPosition.y - neckPosition.y,
	}
	const isForwardFree = !isObstacle(
		headPosition.x + direction.x,
		headPosition.y + direction.y,
	)
	const isLeftFree = !isObstacle(
		headPosition.x + direction.y,
		headPosition.y - direction.x,
	)
	const isRightFree = !isObstacle(
		headPosition.x - direction.y,
		headPosition.y + direction.x,
	)
	const options = []
	if (isForwardFree) {
		// Increase forward probability
		for (let i = 0; i < 8; i++) {
			options.push('forward')
		}
	}
	if (isLeftFree) {
		options.push('left')
	}
	if (isRightFree) {
		options.push('right')
	}
	if (options.length > 0) {
		action = options[Math.floor(Math.random() * options.length)]
	}

	return action
}
