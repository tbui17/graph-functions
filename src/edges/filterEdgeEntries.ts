import type Graph from "graphology"
import { mapCallbackParametersToEdgeEntry } from "./mappers"
import { mapFilterEdges } from "./mapFilterEdges"
import { type FilterEdgeEntriesArgs } from "./types"
import { type InferGraphEdgeEntry } from "../types"

type FilterEdgeEntries = <TGraph extends Graph>(
	...args: FilterEdgeEntriesArgs<TGraph>
) => InferGraphEdgeEntry<TGraph>[]

export const filterEdgeEntries: FilterEdgeEntries = (...args) => {
	const [graph, ...rest] = args
	const lastIndex = rest.length - 1
	rest[lastIndex] = createFn(
		rest[lastIndex] as (...args: any[]) => boolean
	) as any
	return mapFilterEdges(graph, ...rest) as any
}

function createFn(filter: (...args: any[]) => boolean) {
	return (...args: any[]) => {
		if (filter(...args)) {
			// @ts-expect-error Returns expected type in actual use.
			return mapCallbackParametersToEdgeEntry(args)
		}
	}
}