import type Graph from "graphology"
import { RecursorContext } from "./RecursorContext"
import { Queue } from "js-sdsl"

type ForEachNeighborMethods = Extract<keyof Graph, `forEach${string}Neighbor`>

/**
 * Options for traversing a graph using BFS.
 */
type TraversalOptions = {
	/**
	 * Specifies whether to ignore traversal to nodes that are not connected to the input nodes.
	 */
	ignoreTraversalToOtherInputNodes?: boolean;

	/**
	 * Specifies the strategy for iterating over the neighbors of a node during traversal.
	 */
	neighborStrategy?: ForEachNeighborMethods;
}


type GraphRecursorVisitor<TGraph extends Graph, R> = (
	ctx: RecursorContext<TGraph>
) => R

class GraphBFSIterator<TGraph extends Graph> {
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
			neighborStrategy: "forEachNeighbor" as const,
			ignoreTraversalToOtherInputNodes: true,
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

/**
 * Performs a breadth-first search traversal on a graph.
 *
 * @template TGraph - The type of the graph.
 * @template R - The return type of the visitor function.
 * @param {object} params - The parameters for the breadth-first search.
 * @param {TGraph} params.graph - The graph to traverse.
 * @param {Set<string> | string | string[]} params.nodes - The starting nodes for the traversal.
 * @param {GraphRecursorVisitor<TGraph, R>} params.fn - The visitor function to be called for each visited node.
 * @param {TraversalOptions} [params.opts] - The options for the traversal.
 * @returns {R | undefined} The result of the visitor function or undefined.
 */
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
	return new GraphBFSIterator(graph, nodes, opts).run(fn)
}
