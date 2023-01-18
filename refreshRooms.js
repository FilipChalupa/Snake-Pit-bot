import { getJoinedRoomIds, joinRoom } from './joinRoom.js'
import { snakePitServerUrl } from './snakePitServerUrl.js'

const escape = (htmlString) =>
	htmlString
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')

const roomsWrapper = document.querySelector('#rooms')
const roomsList = roomsWrapper.querySelector('ul')
const autoJoinCountInput = document.querySelector(
	'#autoJoinForm input[name="count"]',
)

const handleAutoJoin = async (playerId, playerToken, rooms) => {
	let joinedRoomsCount = getJoinedRoomIds().length
	const roomsToJoinCount = Number(autoJoinCountInput.value)
	if (joinedRoomsCount >= roomsToJoinCount) {
		return
	}
	const waitingRoomWithoutPlayer = rooms.find(
		(room) =>
			room.status === 'waiting' &&
			room.joinedPlayers.every((player) => player.id !== playerId),
	)
	if (waitingRoomWithoutPlayer) {
		setTimeout(async () => {
			await joinRoom(waitingRoomWithoutPlayer.id, playerToken)
			await refreshRooms(playerToken)
		}, 5)
	}
}

const update = async (playerId, playerToken) => {
	const listRoomsResponse = await fetch(`${snakePitServerUrl}/list-rooms`)
	const data = await listRoomsResponse.json()
	const rooms = data.rooms.sort((a, b) => a.id.localeCompare(b.id))

	handleAutoJoin(playerId, playerToken, data.rooms)

	roomsWrapper.removeAttribute('hidden')
	roomsList.innerHTML = ''
	rooms.forEach((room) => {
		const roomElement = document.createElement('li')
		const isAlreadyJoined = room.joinedPlayers.some(
			(otherPlayer) => otherPlayer.id === playerId,
		)
		const joinedRoomIds = getJoinedRoomIds()
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

const showFollowLink = (playerId) => {
	const wrapper = document.querySelector('#followLink')
	wrapper.removeAttribute('hidden')
	const link = wrapper.querySelector('a')
	const url = `${snakePitServerUrl}/player/?id=${playerId}`
	link.href = url
	link.textContent = url
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

			showFollowLink(player.id)

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
