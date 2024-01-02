import type Graph from "graphology"
import { RecursorContext } from "./RecursorContext"
import { TraversalStateManager } from "./TraversalStateManager"

type ForEachNeighborMethods = Extract<keyof Graph, `forEach${string}Neighbor`>
type TraversalOptions = {
	ignoreTraversalToOtherInputNodes?: boolean
	neighborStrategy?: ForEachNeighborMethods
}

type GraphRecursorVisitor<TGraph extends Graph, R> = (
	ctx: RecursorContext<TGraph>
) => R

export function bfsGraph<TGraph extends Graph, R>({
	graph,
	nodes,
	fn,
	opts = {},
}: {
	graph: TGraph
	nodes: Set<string> | string | string[]
	fn: GraphRecursorVisitor<TGraph, R>
	opts?: TraversalOptions
}): R | undefined {
	const options: Required<TraversalOptions> = {
		neighborStrategy: "forEachNeighbor",
		ignoreTraversalToOtherInputNodes: true,
		...opts,
	}

	const inputNodes = (() => {
		if (typeof nodes === "string") {
			return new Set([nodes])
		}
		if (Array.isArray(nodes)) {
			return new Set(nodes)
		}
		return nodes
	})()

	const neighborIterator = graph[options.neighborStrategy].bind(graph)

	const traversalState = new TraversalStateManager<string>()

	const shouldSkip = options.ignoreTraversalToOtherInputNodes
		? (node: string) => traversalState.has(node) || inputNodes.has(node)
		: (node: string) => traversalState.has(node)

	for (const inputNode of inputNodes) {
		traversalState.reset(inputNode)
		while (traversalState.length) {
			const { current, path, previous } = traversalState.popOrThrow()
			if (previous !== null) {
				const result = fn(
					new RecursorContext(
						graph,
						inputNodes,
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

			neighborIterator(current, (neighbor) => {
				if (shouldSkip(neighbor)) {
					return
				}
				traversalState.push(neighbor)
			})
		}
	}
	return
}
