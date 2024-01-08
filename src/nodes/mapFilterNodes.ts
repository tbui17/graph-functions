import { type NodeMapper } from "graphology-types"
import type Graph from "graphology"
import { type InferGraphNode } from "../types"

/**
 * Maps and filters the nodes of a graph. Return undefined to exclude a node from the results.
 * 
 * @template TReturn The return type of the mapper function.
 * @template TGraph The type of the graph.
 * 
 * @param graph The graph to map and filter.
 * @param mapper The function used to map each node of the graph.
 * 
 * @returns An array of mapped and filtered values.
 */
export function mapFilterNodes<TReturn, TGraph extends Graph>(
	graph: TGraph,
	mapper: NodeMapper<TReturn, InferGraphNode<TGraph>>
) {
	const results: Exclude<TReturn, undefined>[] = []
	graph.forEachNode((...args) => {
		//@ts-expect-error Returns expected type in actual use.
		const result = mapper(...args)
		if (result !== undefined) {
			results.push(result as Exclude<TReturn, undefined>)
		}
	})

	return results
}
