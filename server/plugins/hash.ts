import crypto from 'node:crypto'

export default function useHash() {
	return {
		update(data: string) {
			// Use xxhash64 for significantly faster hashing
			const hash = crypto.createHash('xxhash64')
			hash.update(data)

			// Get base64url-encoded hash and take first 5 characters
			const base64 = hash.digest('base64')
				.replace(/\+/g, '-')
				.replace(/\//g, '_')
				.replace(/=/g, '')

			return {
				digest() {
					return base64.slice(0, 5)
				}
			}
		}
	}
}
