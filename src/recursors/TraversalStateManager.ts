import { Queue } from "js-sdsl"

/**
 * Obscure bug found; debugging WIP.
 */
class TraversalStateManager<T = any> {
	private queue = new Queue<{
		path: T[]
		current: T
		previous: T | null
	}>()
	path: T[] = []
	private seen = new Set<T>()
	private previous: T | null = null

	constructor(node?: T extends undefined ? any : T) {
		if (node === undefined) {
			return
		}
		this.reset(node)
	}

	get length() {
		return this.queue.length
	}

	push(value: T) {
		if (this.seen.has(value)) {
			return this
		}
		const previous = this.previous
		this.previous = value
		this.seen.add(value)
		this.queue.push({
			current: value,
			path: this.path.concat(value),
			previous,
		})
		this.path.push(value)
		return this
	}

	has(value: T) {
		return this.seen.has(value)
	}

	pushOrThrow(value: T) {
		if (this.seen.has(value)) {
			throw new Error("cycle detected")
		}

		return this.push(value)
	}

	pop() {
		return this.queue.pop()
	}

	popOrThrow() {
		const res = this.queue.pop()
		if (res === undefined) {
			throw new Error("queue is empty")
		}
		return res
	}

	back() {
		return this.path.pop()
	}

	backOrThrow() {
		const res = this.path.pop()
		if (res === undefined) {
			throw new Error("path is empty")
		}
		return res
	}

	reset(node: T) {
		this.clear()
		this.push(node)
		this.seen.add(node)
		this.queue.push({
			current: node,
			path: [node],
			previous: null,
		})
	}

	clear() {
		this.queue.clear()
		this.path.length = 0
		this.seen.clear()
	}
}
