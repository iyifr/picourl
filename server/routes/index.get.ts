import useHash from '~/plugins/hash'
import { edge, keyStorage } from '~/plugins/plugs'

export default eventHandler(async (event) => {
	let url = getQuery(event).url as string

	if (url) {
		const hashkey = useHash().update(url).digest('hex').slice(0, 6)
		await keyStorage.setItem(hashkey, url)
		url = `localhost:3000/${hashkey}`
	} else {
		url = undefined
	}

	const data = { username: 'virk', url }
	const html = await edge.render('home', data)
	return html
})
