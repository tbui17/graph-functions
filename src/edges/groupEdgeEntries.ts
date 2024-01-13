import type Graph from "graphology"
import { type EdgeEntry } from "graphology-types"
import { mapCallbackParametersToEdgeEntry } from "."
import { type InferGraphEdgeEntry } from ".."


/**
 * Groups edge entries of a graph based on a specified grouping function.
 * This function allows for the aggregation of edges, optionally considering
 * the directionality or bidirectionality of the edges, as well as applying
 * a custom reduction strategy for edge processing.
 * 
 * @param {Object} params - The parameters for the edge grouping function.
 * @param {TGraph} params.graph - The graph instance from 'graphology' to process.
 * @param {string | [string, string]} [params.node] - The node or node pair to focus the grouping on.
 *    If not specified, the grouping is applied across all edges in the graph.
 * @param {function} params.fn - A function that determines the grouping key for an edge.
 *    This function should return a string that represents the key for grouping.
 * @param {Extract<keyof Graph, `reduce${string}Edges`>} [params.edgeReduceStrategy="reduceEdges"] - 
 *    The edge reduction strategy to use. It's a method name pattern from the Graph class,
 *    such as `reduceEdges`, `reduceOutEdges`, etc., defining how edges are traversed and reduced.
 * @param {boolean | "bidirectional"} [params.ignoreParallelEdges=false] - 
 *    Controls how parallel edges are handled. If set to true, any additional edges of the same direction with matching keys from the key generating function will be ignored.
 * Setting this to "bidirectional" will perform a similar operation, but ignores directionality.
 * 
 * @returns {Record<string, InferGraphEdgeEntry<TGraph>[]>} - A record (object) where each key is a 
 *    grouping key returned by `fn`, and its value is an array of edges belonging to that group.
 * 
 * @template TGraph - A type extending from the Graph class of 'graphology'.
 * 
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
	ignoreParallelEdges?: boolean | "bidirectional"
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
	ignoreParallelEdges: boolean | "bidirectional"
) {
	const input = resolveInput(node)
	const map = mapFactory(fn, ignoreParallelEdges)
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

function mapFactory<T extends EdgeEntry>(
	fn: (edge: T) => string,
	ignoreParallelEdges: boolean | "bidirectional"
) {
	switch (ignoreParallelEdges) {
		case true:
			return new GroupEdgeEntriesCollectionIgnoreParallel(fn)
		case "bidirectional":
			const map = new GroupEdgeEntriesCollectionIgnoreParallel(fn)
			map.createPairKey = createPairKeySorted
			return map
		default:
			return new GroupEdgeEntriesCollection(fn)
	}
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
		const pair = this.createPairKey(edge)
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

	createPairKey(edge: T) {
		return `${edge.source}${edge.target}`
	}
}

function createPairKeySorted(edge: EdgeEntry) {
	return [edge.source, edge.target].sort().join("")
}