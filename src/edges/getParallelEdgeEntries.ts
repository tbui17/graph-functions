import type Graph from "graphology"
import pickBy from "lodash/pickBy"
import groupBy from "lodash/groupBy"

import { type InferGraphEdgeEntry } from ".."

type EdgeEntryMethod = Extract<keyof Graph, `${string}dgeEntries`>

/**
 * Retrieves parallel edge entries from a graph.
 *
 * @template TGraph - The type of the graph.
 * @param {Object} options - The options for retrieving parallel edge entries.
 * @param {TGraph} options.graph - The graph from which to retrieve the parallel edge entries.
 * @param {EdgeEntryMethod} [options.edgeEntryMethod="edgeEntries"] - The method to use for retrieving edge entries from the graph.
 * @returns {Record<string, InferGraphEdgeEntry<TGraph>[]>} - The parallel edge entries grouped by their source and target nodes.
 */
export function getParallelEdgeEntries<TGraph extends Graph>({
	graph,
	edgeEntryMethod = "edgeEntries",
}: {
	graph: TGraph
	edgeEntryMethod?: EdgeEntryMethod
}): Record<string, InferGraphEdgeEntry<TGraph>[]> {
	const res = groupBy([...graph[edgeEntryMethod]()], (s) =>
		[s.source, s.target].sort().join("_")
	)
	return pickBy(res, (v) => v.length > 1) as Record<
		string,
		InferGraphEdgeEntry<TGraph>[]
	>
}
