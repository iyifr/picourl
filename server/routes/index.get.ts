import useHash from '~/plugins/hash'
import { edge, keyStorage } from '~/plugins/plugs'

export default eventHandler(async (event) => {
	let url = getQuery(event).url as string | null
	if (url) {
		// Generate hash for the URL
		const hashkey = useHash().update(url).digest()
		await keyStorage.setItem(hashkey, url)
		const requestUrl = getRequestURL(event)
		url = `${requestUrl.origin}/${hashkey}`
	}

	const data = { username: 'virk', url }
	const html = await edge.render('home', data)
	return html
})
