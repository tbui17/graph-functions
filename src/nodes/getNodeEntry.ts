import type Graph from "graphology"
import { type InferGraphNode, type InferGraphNodeEntry } from ".."

/**
 * Retrieves the entry for a specific node in a graph.
 *
 * @template TGraph The type of the graph.
 * @param {TGraph} graph The graph to retrieve the node entry from.
 * @param {string} node The name of the node.
 * @returns {InferGraphNodeEntry<TGraph>} The entry for the specified node.
 */
export function getNodeEntry<TGraph extends Graph>(
	graph: TGraph,
	node: string
): InferGraphNodeEntry<TGraph> {
	const attributes = graph.getNodeAttributes(node) as InferGraphNode<TGraph>
	const entry: InferGraphNodeEntry<TGraph> = {
		node,
		attributes,
	}
	return entry
}
