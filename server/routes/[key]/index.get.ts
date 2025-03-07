import { edge, keyStorage } from '~/plugins/plugs'

export default eventHandler(async (event) => {
	const key = getRouterParam(event, 'key')

	const hasKey = keyStorage.has(key)

	if (hasKey) {
		const url = (await keyStorage.getItem(key)) as string
		return sendRedirect(event, url).then(() => keyStorage.remove(key))
	} else {
		const html = await edge.render('notfound')
		return html
	}
})
