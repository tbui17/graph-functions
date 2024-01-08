import type Graph from "graphology"
import { mapCallbackParametersToEdgeEntry } from "./mappers"
import { mapFilterEdges } from "./mapFilterEdges"
import { type FilterEdgeEntriesArgs } from "./types"
import { type InferGraphEdgeEntry } from "../types"

type FilterEdgeEntries = <TGraph extends Graph>(
	...args: FilterEdgeEntriesArgs<TGraph>
) => InferGraphEdgeEntry<TGraph>[]

export const filterEdgeEntries: FilterEdgeEntries = (...args) => {
	const [graph, filterOrNode, filterOrNeighbor, filter] = args

	if (
		typeof filterOrNode === "string" &&
		typeof filterOrNeighbor === "string" &&
		typeof filter === "function"
	) {
		return mapFilterEdges(
			graph,
			filterOrNode,
			filterOrNeighbor,
			(...args) => {
				if (filter(...args)) {
					return mapCallbackParametersToEdgeEntry(args)
				}
			}
		)
	}

	if (
		typeof filterOrNode === "string" &&
		typeof filterOrNeighbor === "function"
	) {
		return mapFilterEdges(graph, filterOrNode, (...args) => {
			if (filterOrNeighbor(...args)) {
				return mapCallbackParametersToEdgeEntry(args)
			}
		})
	}
	if (typeof filterOrNode === "function") {
		return mapFilterEdges(graph, (...args) => {
			if (filterOrNode(...args)) {
				return mapCallbackParametersToEdgeEntry(args)
			}
		})
	}
	throw new Error("Invalid arguments")
}
