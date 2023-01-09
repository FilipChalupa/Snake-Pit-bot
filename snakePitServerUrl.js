export const snakePitServerUrl =
	location.hostname === 'localhost'
		? 'http://localhost:3000'
		: 'https://snake-pit.onrender.com'
