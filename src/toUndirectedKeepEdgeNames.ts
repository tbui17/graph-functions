import type Graph from "graphology"
import { toUndirected } from "graphology-operators"
import { renameGraphKeys } from "graphology-utils"

/**
 *
 * Workaround for toUndirected causing edge key names to be lost.
 *
 */
export function toUndirectedKeepEdgeNames<TGraph extends Graph>(graph: TGraph) {
	const tempSymbol = Symbol("temp")
	const g2 = graph.copy()
	g2.updateEachEdgeAttributes((...args) => {
		return {
			...args[1],
			[tempSymbol]: args[0],
		}
	})
	const g3 = toUndirected(g2)
	const changes = g3.reduceEdges(
		(acc, edge, attr) => {
			//@ts-expect-error symbols can be used
			acc[edge] = attr[tempSymbol]
			return acc
		},
		{} as Record<string, string>
	)
	const undirectedGraph = renameGraphKeys(g3, {}, changes)
	undirectedGraph.updateEachEdgeAttributes((_edge, attr) => {
		//@ts-expect-error symbols can be used
		delete attr[tempSymbol]
		return attr
	})

	return undirectedGraph as TGraph
}
