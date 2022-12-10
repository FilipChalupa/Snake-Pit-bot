export const evaluateNextMove = (width, height, players, food, playerId) => {
	return Math.random() > 0.3 ? 'forward' : 'right'
}
