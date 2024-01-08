import { type NodeEntry } from "graphology-types"
import { type InferGraphNode } from "../types"
import type Graph from "graphology"
import { type NodeFilter } from "./types"

/**
 * Filters the node entries of a graph based on the provided filter function.
 * 
 * @template TGraph - The type of the graph.
 * @param {TGraph} graph - The graph to filter.
 * @param {NodeFilter<TGraph>} filter - The filter function to apply to each node entry.
 * @returns {NodeEntry<InferGraphNode<TGraph>>[]} - The filtered node entries.
 */
export function filterNodeEntries<TGraph extends Graph>(
	graph: TGraph,
	filter: NodeFilter<TGraph>
) {
	const results: NodeEntry<InferGraphNode<TGraph>>[] = []
	graph.forEachNode((node, attributes) => {
		//@ts-expect-error Returns expected type in actual use.
		filter(node, attributes) && results.push({ node, attributes })
	})
	return results
}
