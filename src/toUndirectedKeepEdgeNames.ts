import type Graph from "graphology"
import { type Attributes } from "graphology-types"
import { isGraph } from "graphology-utils"

/**
 *
 * Workaround for toUndirected causing edge key names to be lost.
 *
 */
export function toUndirectedKeepEdgeNames<TGraph extends Graph>(graph: TGraph) {
	return toUndirected(graph) as TGraph
}

function toUndirected(graph: Graph, options?: any) {
	if (!isGraph(graph))
		throw new Error(
			"graphology-operators/to-undirected: expecting a valid graphology instance."
		)

	if (typeof options === "function") options = { mergeEdge: options }

	options = options || {}

	const mergeEdge =
		typeof options.mergeEdge === "function" ? options.mergeEdge : null

	if (graph.type === "undirected") return graph.copy()

	const undirectedGraph = graph.emptyCopy({ type: "undirected" })

	// Adding undirected edges
	graph.forEachUndirectedEdge(function (edge, attr, source, target) {
		copyEdge(undirectedGraph, true, edge, source, target, attr)
	})

	// TODO: one loop for better performance

	// Merging directed edges
	graph.forEachDirectedEdge(function (edge, attr, source, target) {
		if (!graph.multi) {
			const existingEdge = undirectedGraph.edge(source, target)

			if (existingEdge) {
				// We need to merge
				if (mergeEdge)
					undirectedGraph.replaceEdgeAttributes(
						existingEdge,
						mergeEdge(
							undirectedGraph.getEdgeAttributes(existingEdge),
							attr
						)
					)

				return
			}
		}
		// changed 3rd arg null -> edge
		copyEdge(undirectedGraph, true, edge, source, target, attr)
	})

	return undirectedGraph
}

function copyEdge<EdgeAttributes extends Attributes = Attributes>(
	graph: Graph,
	undirected: boolean,
	key: unknown,
	source: unknown,
	target: unknown,
	attributes?: EdgeAttributes
): string {
	attributes = Object.assign({}, attributes)

	if (undirected) {
		if (key === null || key === undefined)
			return graph.addUndirectedEdge(source, target, attributes)
		else
			return graph.addUndirectedEdgeWithKey(
				key,
				source,
				target,
				attributes
			)
	} else {
		if (key === null || key === undefined)
			return graph.addDirectedEdge(source, target, attributes)
		else
			return graph.addDirectedEdgeWithKey(key, source, target, attributes)
	}
}
