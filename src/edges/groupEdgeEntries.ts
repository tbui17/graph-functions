import type Graph from "graphology"
import { type EdgeEntry } from "graphology-types"
import { mapCallbackParametersToEdgeEntry } from "."
import { type InferGraphEdgeEntry } from ".."

/**
 * Groups edge entries of a graph based on a provided function.
 *
 * @param {Object} params - The parameters for the function.
 * @param {TGraph} params.graph - The graph to group edge entries from.
 * @param {string | [string, string]} [params.node] - The node or pair of nodes to consider for grouping. If not provided, all edges in the graph are considered.
 * @param {(edge: InferGraphEdgeEntry<TGraph>) => string} params.fn - The function used to group the edge entries. It should return a string that will be used as the key for the group.
 * @param {Extract<keyof Graph, `reduce${string}Edges`>} [params.edgeReduceStrategy="reduceEdges"] - The strategy to use when reducing edges. This determines which types of edges will be iterated over based on their directionality, with reduceEdges iterating over edges of any direction. It should be a method name of the Graph class that starts with "reduce" and ends with "Edges". Default is "reduceEdges".
 * @param {boolean} [params.ignoreParallelEdges=false] - Whether to ignore parallel edges when grouping. If true, only the first edge between two nodes is considered. Default is false.
 *
 * @returns {Record<string, InferGraphEdgeEntry<TGraph>[]>} - An object where each key is a group key returned by the `fn` function, and each value is an array of edge entries belonging to that group.
 *
 * @example
 * const graph = new Graph();
 * // ...add some edges to the graph...
 * const groups = groupEdgeEntries({
 *   graph,
 *   node: 'node1',
 *   fn: (edge) => edge.attributes.type,
 *   edgeReduceStrategy: 'reduceDirectedEdges',
 *   ignoreParallelEdges: true,
 * });
 * // groups now contains edge entries of 'node1', grouped by their 'type' attribute, considering only directed edges and ignoring parallel edges.
 */
export function groupEdgeEntries<TGraph extends Graph>({
	graph,
	node,
	fn,
	edgeReduceStrategy = "reduceEdges",
	ignoreParallelEdges = false,
}: {
	graph: TGraph
	node?: string | [string, string]
	fn: (edge: InferGraphEdgeEntry<TGraph>) => string
	edgeReduceStrategy?: Extract<keyof Graph, `reduce${string}Edges`>
	ignoreParallelEdges?: boolean
}): Record<string, InferGraphEdgeEntry<TGraph>[]> {
	const [input, map] = resolveDeps(node, fn, ignoreParallelEdges)

	return graph[edgeReduceStrategy](
		...(input as [string]),
		(acc, ...args) => {
			const edge = mapCallbackParametersToEdgeEntry(
				args
			) as InferGraphEdgeEntry<TGraph>
			return acc.add(edge)
		},
		map
	).data
}

function resolveDeps<T extends EdgeEntry>(
	node: string | [string, string] | undefined,
	fn: (edge: T) => string,
	ignoreParallelEdges: boolean
) {
	const input = resolveInput(node)

	const map = ignoreParallelEdges
		? new GroupEdgeEntriesCollectionIgnoreParallel(fn)
		: new GroupEdgeEntriesCollection(fn)
	return [input, map] as const
}

function resolveInput(node: string | [string, string] | undefined) {
	if (node === undefined) {
		return []
	}
	if (Array.isArray(node)) {
		return [node[0], node[1]]
	}
	return [node]
}

class GroupEdgeEntriesCollection<T> {
	constructor(public keyGetter: (edge: T) => string) {}
	data: Record<string, T[]> = {}
	add(edge: T) {
		const key = this.keyGetter(edge)
		const arr = this.data[key] ?? []
		arr.push(edge)
		this.data[key] = arr
		return this
	}
}

class GroupEdgeEntriesCollectionIgnoreParallel<
	T extends EdgeEntry,
> extends GroupEdgeEntriesCollection<T> {
	pairMap: Record<string, Set<string>> = {}

	override add(edge: T) {
		const key = this.keyGetter(edge)
		const set = this.pairMap[key] ?? new Set()
		const pair = `${edge.source}${edge.target}`
		if (set.has(pair)) {
			return this
		}
		set.add(pair)
		this.pairMap[key] = set
		const arr = this.data[key] ?? []
		arr.push(edge)
		this.data[key] = arr
		return this
	}
}
