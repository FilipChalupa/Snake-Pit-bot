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
	const forwardDirection = {
		x: headPosition.x - neckPosition.x,
		y: headPosition.y - neckPosition.y,
	}
	const leftDirection = {
		x: forwardDirection.y,
		y: -forwardDirection.x,
	}
	const rightDirection = {
		x: -forwardDirection.y,
		y: forwardDirection.x,
	}
	const isForwardFree = !isObstacle(
		headPosition.x + forwardDirection.x,
		headPosition.y + forwardDirection.y,
	)
	const isLeftFree = !isObstacle(
		headPosition.x + leftDirection.y,
		headPosition.y + leftDirection.x,
	)
	const isRightFree = !isObstacle(
		headPosition.x + rightDirection.y,
		headPosition.y + rightDirection.x,
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
