import { Edge } from 'edge.js'
import { mkdir, cp } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { watch } from 'node:fs/promises'

export const edge = Edge.create()
export const keyStorage = useStorage('url')

// server/plugins/my-plugin.ts
export default defineNitroPlugin(async (nitroApp) => {
	const sourceViewsDir = join(process.cwd(), 'server', 'views')
	const targetViewsDir = join(process.cwd(), '.nitro', 'dev', 'views')

	// Create target directory if it doesn't exist
	if (!existsSync(targetViewsDir)) {
		await mkdir(targetViewsDir, { recursive: true })
	}

	// Start file watcher in development mode
	if (process.env.NODE_ENV !== 'production') {
		const ac = new AbortController()
		const { signal } = ac
		const watcher = watch(sourceViewsDir, { recursive: true, signal })

			// Handle file changes
			; (async () => {
				try {
					for await (const event of watcher) {
						// Sync the entire directory on any change
						await cp(sourceViewsDir, targetViewsDir, { recursive: true, force: true })
						console.log(`Views synced after change in ${event.filename}`)
					}
				} catch (err) {
					console.error('Error watching views directory:', err)
				}
			})()

		// Cleanup watcher on app close
		nitroApp.hooks.hook('close', () => {
			ac.abort()
			// to stop this watcher
			unwatch()
		})
	}

	const unwatch = await keyStorage.watch(async (event, key) => {
		console.log(event, key)
	})
	// Copy views directory
	await cp(sourceViewsDir, targetViewsDir, { recursive: true, force: true })

	edge.mount(sourceViewsDir)
})
