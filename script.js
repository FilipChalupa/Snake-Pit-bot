import { refreshRooms } from './refreshRooms.js'
import { showCreateForm } from './showCreateForm.js'
import { snakePitServerUrl } from './snakePitServerUrl.js'

const isPlayerTokenValid = async () => {
	const response = await fetch(`${snakePitServerUrl}/me`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			playerToken,
		}),
	})
	const data = await response.json()
	const isValid = data?.player?.id !== undefined
	if (!isValid) {
		localStorage.removeItem(localStorageTokenKey)
		playerToken = null
	}
	return isValid
}

const showRooms = () => {
	showCreateForm(playerToken)
	refreshRooms(playerToken)
}

const localStorageTokenKey = 'playerToken'
let playerToken = localStorage.getItem(localStorageTokenKey)

const localStorageNameKey = 'playerName'
let playerName = localStorage.getItem(localStorageNameKey)

const nameForm = document.querySelector('#nameForm')
const nameInput = nameForm.querySelector('input')
if (playerName !== null) {
	nameInput.value = playerName
}
if (playerToken !== null && (await isPlayerTokenValid())) {
	showRooms()
} else {
	nameForm.removeAttribute('hidden')
}
nameForm.addEventListener('submit', async (event) => {
	event.preventDefault()
	playerName = nameInput.value
	localStorage.setItem(localStorageNameKey, playerName)

	const createPlayerResponse = await fetch(
		`${snakePitServerUrl}/create-player`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: playerName,
			}),
		},
	)
	const data = await createPlayerResponse.json()
	playerToken = data.playerToken
	localStorage.setItem(localStorageTokenKey, playerToken)
	showRooms()
})
