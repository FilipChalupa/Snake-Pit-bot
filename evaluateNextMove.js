export const evaluateNextMove = (width, height, player, allPlayers, food) => {
	return Math.random() > 0.3 ? 'forward' : 'right'
}
