import { type NodeMapper } from "graphology-types"
import type Graph from "graphology"
import { type InferGraphNode } from "../types"

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
