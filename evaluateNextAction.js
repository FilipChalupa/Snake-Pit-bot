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

	let actionName = 'forward'

	const headPosition = player.fromHeadPosition[0]
	const neckPosition = player.fromHeadPosition[1]
	const forwardDirection = {
		x: headPosition.x - neckPosition.x,
		y: headPosition.y - neckPosition.y,
	}
	const directions = [
		{
			actionName: 'forward',
			direction: forwardDirection,
		},
		{
			actionName: 'left',
			direction: {
				x: forwardDirection.y,
				y: -forwardDirection.x,
			},
		},
		{
			actionName: 'right',
			direction: {
				x: -forwardDirection.y,
				y: forwardDirection.x,
			},
		},
	]
	const options = directions.filter(
		({ direction }) =>
			!isObstacle(headPosition.x + direction.x, headPosition.y + direction.y),
	)
	if (options.length > 0) {
		actionName = options[Math.floor(Math.random() * options.length)].actionName
	}

	return actionName
}
