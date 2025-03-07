import crypto from 'node:crypto'

export default function useHash() {
	return crypto.createHash('sha256')
}
