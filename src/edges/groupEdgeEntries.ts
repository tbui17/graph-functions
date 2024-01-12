import type Graph from "graphology"
import { type EdgeEntry } from "graphology-types"
import { mapCallbackParametersToEdgeEntry } from "."
import { type InferGraphEdgeEntry } from ".."

/**
 * Groups the edge entries of a graph based on a specified function.
 *
 * @template TGraph - The type of the graph.
 * @param {Object} options - The options for grouping the edge entries.
 * @param {TGraph} options.graph - The graph to operate on.
 * @param {string | [string, string]} [options.node] - The node or node + neighbor to group edges for. If not specified, all nodes will be considered.
 * @param {(edge: InferGraphEdgeEntry<TGraph>) => string} options.fn - The function to determine the group key for each edge entry.
 * @param {Extract<keyof Graph, `reduce${string}Edges`>} [options.edgeReduceStrategy="reduceEdges"] - The edge reduce strategy to use.
 * @param {boolean} [options.ignoreParallelEdges=false] - Whether to ignore parallel edges when grouping.
 * @returns {Record<string, InferGraphEdgeEntry<TGraph>[]>} - The grouped edge entries.
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
