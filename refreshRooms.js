import { runBot } from './runBot.js'
import { snakePitServerUrl } from './snakePitServerUrl.js'

const escape = (htmlString) =>
	htmlString
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')

const roomsList = document.querySelector('#rooms')

const update = async (playerId, playerToken) => {
	const listRoomsResponse = await fetch(`${snakePitServerUrl}/list-rooms`)
	const data = await listRoomsResponse.json()
	const rooms = data.rooms.sort((a, b) => a.id.localeCompare(b.id))

	roomsList.innerHTML = ''
	rooms.forEach((room) => {
		const roomElement = document.createElement('li')
		const isAlreadyJoined = room.joinedPlayers.some(
			(otherPlayer) => otherPlayer.id === playerId,
		)
		const isUnderControl = joinedRoomIds.includes(room.id)
		const isNotWaiting = room.status !== 'waiting'
		roomElement.innerHTML = /* html */ `
			<li>
				<h3>${room.id}</h3>
				<a href="${snakePitServerUrl}/room/?id=${room.id}" target="_blank">Show</a>
				<button type="button">Join</button>
				<dl>
					<dt>Status</dt>
					<dd>${room.status}</dd>
					<dt>Joined players</dt>
					<dd>${
						room.joinedPlayers.length === 0
							? '0'
							: room.joinedPlayers
									.map((player) => escape(player.name || player.id))
									.join(', ')
					}</dd>
					<dt>Maximum players</dt>
					<dd>${room.maximumPlayers}</dd>
					<dt>Room size</dt>
					<dd>${room.width}×${room.height}</dd>
				</dl>
			</li>
		`
		const joinButton = roomElement.querySelector('button')
		if (isNotWaiting || isAlreadyJoined || isUnderControl) {
			joinButton.setAttribute('disabled', '')

			if (isUnderControl) {
				joinButton.textContent = 'Under control'
			} else if (room.status === 'ended') {
				joinButton.textContent = 'Ended'
			} else if (isAlreadyJoined) {
				joinButton.textContent = 'Already joined before'
			} else if (room.status === 'playing') {
				joinButton.textContent = 'In progress'
			}
		}
		joinButton.addEventListener('click', async () => {
			joinButton.setAttribute('disabled', '')
			await joinRoom(room.id, playerToken)
			await refreshRooms(playerToken)
		})
		roomsList.appendChild(roomElement)
	})
}

export const refreshRooms = (() => {
	let timer
	let playerId = null

	return async (playerToken) => {
		clearTimeout(timer)

		if (playerId === null) {
			const response = await fetch(`${snakePitServerUrl}/me`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					playerToken,
				}),
			})
			const { player } = await response.json()
			playerId = player.id

			document.querySelector(
				'#botName',
			).textContent = `Bot name: ${player.name}`
		}

		await update(playerId, playerToken)

		timer = setTimeout(() => {
			refreshRooms(playerToken)
		}, 2000)
	}
})()

let joinedRoomIds = []

const joinRoom = async (roomId, playerToken) => {
	joinedRoomIds.push(roomId)

	await runBot(roomId, playerToken, () => {
		joinedRoomIds = joinedRoomIds.filter((id) => id !== roomId)
	})
}
