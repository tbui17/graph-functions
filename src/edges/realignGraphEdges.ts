import type Graph from "graphology"
import {
	type InferGraphEdge,
	type InferGraphEdgeEntry,
	type InferGraphNode,
	type ObjectWithTypeFieldPassthrough,
} from "../types"
import { mapCallbackParametersToEdgeEntry } from "."
import { type Attributes, type EdgeEntry } from "graphology-types"

type EdgeEntryFilter<
	TNodeAttributes extends Attributes = Attributes,
	TEdgeAttributes extends Attributes = Attributes,
> = (edgeEntry: EdgeEntry<TNodeAttributes, TEdgeAttributes>) => boolean

const byType: EdgeEntryFilter<ObjectWithTypeFieldPassthrough, Attributes> = (
	edgeEntry
) => edgeEntry.sourceAttributes.type > edgeEntry.targetAttributes.type

/**
 * Realigns the edges of a graph based on the node type.
 * 
 * @template TGraph - The type of the graph.
 * @param {TGraph} graph - The graph to realign the edges of.
 * @returns {void}
 */
export function realignGraphEdgesByNodeType<
	TGraph extends Graph<ObjectWithTypeFieldPassthrough>,
>(graph: TGraph) {
	realignGraphEdges(graph, byType)
}

/**
 * Realigns the edges of a graph based on the provided filter(s).
 * 
 * @template TGraph - The type of the graph.
 * @param {TGraph} graph - The graph to realign the edges of.
 * @param {EdgeEntryFilter<InferGraphNode<TGraph>, InferGraphEdge<TGraph>> | EdgeEntryFilter<InferGraphNode<TGraph>, InferGraphEdge<TGraph>>[]} filter - The filter(s) to apply to the edges.
 */
export function realignGraphEdges<TGraph extends Graph>(
	graph: TGraph,
	filter:
		| EdgeEntryFilter<InferGraphNode<TGraph>, InferGraphEdge<TGraph>>
		| EdgeEntryFilter<InferGraphNode<TGraph>, InferGraphEdge<TGraph>>[]
) {
	const filters = Array.isArray(filter) ? filter : [filter]

	graph.updateEachEdgeAttributes((...args) => {
		const edge = mapCallbackParametersToEdgeEntry(args)
		filters.some((filter) => filter(edge as InferGraphEdgeEntry<TGraph>)) &&
			swapEdgeDirection(edge)
		return edge
	})
}

export function swapEdgeDirection(edge: EdgeEntry) {
	const { source, sourceAttributes, target, targetAttributes } = edge
	edge.source = target
	edge.sourceAttributes = targetAttributes
	edge.target = source
	edge.targetAttributes = sourceAttributes
}
