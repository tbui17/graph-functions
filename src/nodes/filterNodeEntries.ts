import { type NodeEntry } from "graphology-types"
import { type InferGraphNode } from "../types"
import type Graph from "graphology"
import { type NodeFilter } from "./types"

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
