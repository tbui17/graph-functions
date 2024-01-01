import type Graph from "graphology"
import { Queue } from "js-sdsl"

import { RecursorContext } from "./RecursorContext"
import { TraversalStateManager } from "./TraversalStateManager"

type ForEachNeighborMethods = Extract<keyof Graph, `forEach${string}Neighbor`>
type TraversalOptions = {
	ignoreTraversalToOtherInputNodes?: boolean
	neighborStrategy?: ForEachNeighborMethods
}

export type GraphRecursorVisitor<TGraph extends Graph, R> = (
	ctx: RecursorContext<TGraph>
) => R

export class GraphBFSIterator<TGraph extends Graph> {
	protected graph: TGraph
	protected inputNodes: Set<string>
	protected seen = new Set<string>()
	protected queue = new Queue<{
		path: string[]
		current: string
		previous: string | null
	}>()
	protected opts: Required<TraversalOptions>

	public constructor(
		graph: TGraph,
		inputNodes: Set<string> | string | string[],
		opts: TraversalOptions = {}
	) {
		this.graph = graph

		this.opts = {
			...{
				neighborStrategy: "forEachNeighbor" as const,
				ignoreTraversalToOtherInputNodes: true,
			},
			...opts,
		}

		if (typeof inputNodes === "string") {
			inputNodes = new Set([inputNodes])
		} else if (Array.isArray(inputNodes)) {
			inputNodes = new Set(inputNodes)
		}
		this.inputNodes = inputNodes
	}

	/**
	 * Return any value other than undefined to break. Also returns the value.
	 */
	public run<R>(visitor: GraphRecursorVisitor<TGraph, R>): R | undefined {
		for (const inputNode of this.inputNodes) {
			this.reset(inputNode)
			while (this.queue.length) {
				const { current, path, previous } = this.queue.pop()!

				if (previous !== null) {
					const result = visitor(
						new RecursorContext(
							this.graph,
							this.inputNodes,
							inputNode,
							previous,
							current,
							path
						)
					)
					if (result !== undefined) {
						return result
					}
				}

				this.graph[this.opts.neighborStrategy](current, (neighbor) => {
					if (this.shouldSkip(neighbor)) {
						return
					}
					this.seen.add(neighbor)
					this.queue.push({
						current: neighbor,
						path: path.concat(neighbor),
						previous: current,
					})
				})
			}
		}
	}

	protected shouldSkip(neighbor: string) {
		return this.seen.has(neighbor) || this.inputNodes.has(neighbor)
	}

	protected reset(sourceNode: string) {
		this.queue.clear()
		this.queue.push({
			current: sourceNode,
			path: [sourceNode],
			previous: null,
		})
		this.seen.clear()
	}
}

class GraphBFSIterator2<TGraph extends Graph> {
	protected graph: TGraph
	protected inputNodes: Set<string>
	protected traversalState = new TraversalStateManager<string>()
	protected opts: Required<TraversalOptions>

	public constructor(
		graph: TGraph,
		inputNodes: Set<string> | string | string[],
		opts: TraversalOptions = {}
	) {
		this.graph = graph
		this.opts = {
			...{
				neighborStrategy: "forEachNeighbor" as const,
				ignoreTraversalToOtherInputNodes: true,
			},
			...opts,
		}
		if (typeof inputNodes === "string") {
			inputNodes = new Set([inputNodes])
		} else if (Array.isArray(inputNodes)) {
			inputNodes = new Set(inputNodes)
		}
		this.inputNodes = inputNodes
	}

	public *[Symbol.iterator]() {
		for (const inputNode of this.inputNodes) {
			this.traversalState.reset(inputNode)
			while (this.traversalState.length) {
				const { current, path, previous } =
					this.traversalState.popOrThrow()
				if (previous !== null) {
					yield new RecursorContext(
						this.graph,
						this.inputNodes,
						inputNode,
						previous,
						current,
						path
					)
				}

				this.graph[this.opts.neighborStrategy](current, (neighbor) => {
					if (this.shouldSkip(neighbor)) {
						return
					}
					this.traversalState.pushOrThrow(neighbor)
				})
			}
		}
		return
	}

	/**
	 * Return any value other than undefined to break. Also returns the value.
	 */
	public run<R>(visitor: GraphRecursorVisitor<TGraph, R>): R | undefined {
		for (const inputNode of this.inputNodes) {
			this.traversalState.reset(inputNode)
			while (this.traversalState.length) {
				const { current, path, previous } =
					this.traversalState.popOrThrow()
				if (previous !== null) {
					const result = visitor(
						new RecursorContext(
							this.graph,
							this.inputNodes,
							inputNode,
							previous,
							current,
							path
						)
					)
					if (result !== undefined) {
						return result
					}
				}

				this.graph[this.opts.neighborStrategy](current, (neighbor) => {
					if (this.shouldSkip(neighbor)) {
						return
					}
					this.traversalState.pushOrThrow(neighbor)
				})
			}
		}
		return
	}

	protected shouldSkip(neighbor: string) {
		return (
			this.traversalState.has(neighbor) || this.inputNodes.has(neighbor)
		)
	}
}
