import { joinRoom } from './joinRoom.js'
import { refreshRooms } from './refreshRooms.js'
import { snakePitServerUrl } from './snakePitServerUrl.js'

const showCreateForm = (playerToken) => {
	const form = document.querySelector('#createRoomForm')
	form.removeAttribute('hidden')

	form.addEventListener('submit', async (event) => {
		event.preventDefault()
		form.querySelector('button').setAttribute('disabled', '')

		const getInput = (name) => form.querySelector(`input[name="${name}"]`)
		const getNumbericValue = (name) => Number(getInput(name).value)

		const response = await fetch(`${snakePitServerUrl}/create-room`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				maximumFood: getNumbericValue('maximumFood'),
				maximumPlayers: getNumbericValue('maximumPlayers'),
				width: getNumbericValue('width'),
				height: getNumbericValue('height'),
			}),
		})
		const { room } = await response.json()

		const join = getInput('join').checked

		form.querySelector('#newRoomLink').innerHTML = /* html */ `
			Last created room: <a href="${snakePitServerUrl}/room/?id=${room.id}">${room.id}</a>
		`

		if (join) {
			joinRoom(room.id, playerToken)
			await refreshRooms(playerToken)
		}

		form.querySelector('button').removeAttribute('disabled')
	})
}

const showAutoJoinForm = () => {
	document.querySelector('#autoJoinForm').removeAttribute('hidden')
}

export const showRooms = (playerToken) => {
	showCreateForm(playerToken)
	showAutoJoinForm()
	refreshRooms(playerToken)
}
