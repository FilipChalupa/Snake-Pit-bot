import { snakePitServerUrl } from './snakePitServerUrl.js'

export const showCreateForm = (playerToken) => {
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

		if (join) {
			window.open(`${snakePitServerUrl}/room/?id=${room.id}`)
		}

		form.querySelector('button').removeAttribute('disabled')
	})
}
