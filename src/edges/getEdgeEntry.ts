import type Graph from "graphology"
import {
	type InferGraphEdge,
	type InferGraphEdgeEntry,
	type InferGraphNode,
} from ".."

/**
 * Retrieves the entry for a specific edge in a graph.
 *
 * @template TGraph - The type of the graph.
 * @param {TGraph} graph - The graph object.
 * @param {string} edge - The identifier of the edge.
 * @returns {InferGraphEdgeEntry<TGraph>} - The entry for the specified edge.
 */
export function getEdgeEntry<TGraph extends Graph>(
	graph: TGraph,
	edge: string
): InferGraphEdgeEntry<TGraph> {
	const node1 = graph.source(edge)
	const node2 = graph.target(edge)
	const attributes = graph.getEdgeAttributes(edge) as InferGraphEdge<TGraph>
	const entry: InferGraphEdgeEntry<TGraph> = {
		edge,
		attributes,
		source: node1,
		target: node2,
		sourceAttributes: graph.getNodeAttributes(
			node1
		) as InferGraphNode<TGraph>,
		targetAttributes: graph.getNodeAttributes(
			node2
		) as InferGraphNode<TGraph>,
		undirected: graph.isUndirected(edge),
	}
	return entry
}
