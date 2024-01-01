import type Graph from "graphology"
import { type MapFilterEdgeEntriesArgs, type MapFilterEdgesArgs } from "./types"
import { mapCallbackParametersToEdgeEntry } from "."

function noUndefined<T>(item: T): item is Exclude<T, undefined> {
	return item !== undefined
}

export function mapFilterEdges<TGraph extends Graph, TReturn>(
	...args: MapFilterEdgesArgs<TGraph, TReturn>
): Exclude<TReturn, undefined>[] {
	const [graph, fnOrNode, fnOrNeighbor, fn] = args

	if (
		typeof fnOrNode === "string" &&
		typeof fnOrNeighbor === "string" &&
		typeof fn === "function"
	) {
		return graph
			.mapEdges(fnOrNode, fnOrNeighbor, (...args) => {
				//@ts-expect-error Returns expected type in actual use.
				return fn(...args)
			})
			.filter(noUndefined)
	}

	if (typeof fnOrNode === "string" && typeof fnOrNeighbor === "function") {
		return graph
			.mapEdges(fnOrNode, (...args) => {
				//@ts-expect-error Returns expected type in actual use.
				return fnOrNeighbor(...args)
			})
			.filter(noUndefined)
	}
	if (typeof fnOrNode === "function") {
		return graph
			.mapEdges((...args) => {
				//@ts-expect-error Returns expected type in actual use.
				return fnOrNode(...args)
			})
			.filter(noUndefined)
	}
	throw new Error("Invalid arguments")
}

export function mapFilterEdgeEntries<TGraph extends Graph, TReturn>(
	...args: MapFilterEdgeEntriesArgs<TGraph, TReturn>
): Exclude<TReturn, undefined>[] {
	const [graph, fnOrNode, fnOrNeighbor, fn] = args

	if (
		typeof fnOrNode === "string" &&
		typeof fnOrNeighbor === "string" &&
		typeof fn === "function"
	) {
		return graph
			.mapEdges(fnOrNode, fnOrNeighbor, (...args) => {
				//@ts-expect-error Returns expected type in actual use.
				return fn(mapCallbackParametersToEdgeEntry(args))
			})
			.filter(noUndefined)
	}

	if (typeof fnOrNode === "string" && typeof fnOrNeighbor === "function") {
		return graph
			.mapEdges(fnOrNode, (...args) => {
				//@ts-expect-error Returns expected type in actual use.
				return fnOrNeighbor(mapCallbackParametersToEdgeEntry(args))
			})
			.filter(noUndefined)
	}
	if (typeof fnOrNode === "function") {
		return graph
			.mapEdges((...args) => {
				//@ts-expect-error Returns expected type in actual use.
				return fnOrNode(mapCallbackParametersToEdgeEntry(args))
			})
			.filter(noUndefined)
	}
	throw new Error("Invalid arguments")
}
