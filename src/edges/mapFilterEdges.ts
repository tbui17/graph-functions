import type Graph from "graphology"
import { type MapFilterEdgeEntriesArgs, type MapFilterEdgesArgs } from "./types"
import { mapCallbackParametersToEdgeEntry } from "."

function noUndefined<T>(item: T): item is Exclude<T, undefined> {
	return item !== undefined
}

/**
 * Maps and filters the edges of a graph based on the provided arguments.
 * 
 * @template TGraph - The type of the graph.
 * @template TReturn - The return type of the mapping function.
 * @param {...MapFilterEdgesArgs<TGraph, TReturn>} args - The arguments for mapping and filtering the edges.
 * @returns {Exclude<TReturn, undefined>[]} - The mapped and filtered edges.
 * @throws {Error} - If the arguments are invalid.
 */
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

/**
 * Maps and filters the entries of the edges in a graph. Converts edges into entries for the callback function.
 * 
 * @template TGraph - The type of the graph.
 * @template TReturn - The type of the returned values.
 * @param {...MapFilterEdgeEntriesArgs<TGraph, TReturn>} args - The arguments for mapping and filtering the edge entries.
 * @returns {Exclude<TReturn, undefined>[]} - An array of the mapped and filtered edge entries.
 * @throws {Error} - If the arguments are invalid.
 */
export function mapFilterEdgeEntries<TGraph extends Graph, TReturn>(
	...args: MapFilterEdgeEntriesArgs<TGraph, TReturn>
): Exclude<TReturn, undefined>[] {
	const [graph, fnOrNode, fnOrNeighbor, fn] = args

	if (
		typeof fnOrNode === "string" &&
		typeof fnOrNeighbor === "string" &&
		typeof fn === "function"
	) {
		const result: any[] = []
		graph.forEachEdge(fnOrNode, fnOrNeighbor, (...args) => {
			//@ts-expect-error Returns expected type in actual use.

			const res = fn(mapCallbackParametersToEdgeEntry(args))
			if (res !== undefined) {
				result.push(res)
			}
		})
		return result
	}

	if (typeof fnOrNode === "string" && typeof fnOrNeighbor === "function") {
		const result: any[] = []
		graph.forEachEdge(fnOrNode, (...args) => {
			//@ts-expect-error Returns expected type in actual use.
			const res = fnOrNeighbor(mapCallbackParametersToEdgeEntry(args))
			if (res !== undefined) {
				result.push(res)
			}
		})
		return result
	}
	if (typeof fnOrNode === "function") {
		const result: any[] = []
		graph.forEachEdge((...args) => {
			//@ts-expect-error Returns expected type in actual use.
			const res = fnOrNode(mapCallbackParametersToEdgeEntry(args))
			if (res !== undefined) {
				result.push(res)
			}
		})
		return result
	}
	throw new Error("Invalid arguments")
}