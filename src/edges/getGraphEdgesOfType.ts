import {
	type GraphWithTypeForEdge,
	type TypesContainerForEdge,
	type GetGraphEdgesOfTypesResult,
} from "./types"
import { filterEdgeEntries } from "./filterEdgeEntries"

import compact from "lodash/fp/compact"
import flow from "lodash/fp/flow"
import map from "lodash/fp/map"
import { getTypes } from "../internal/getTypes"

// array autocomplete does not work with overloading through type interfaces

/**
 * Retrieves the edges of a graph based on the specified types.
 *
 * @template TGraph - The type of the graph.
 * @template TTypes - The type of the edge types.
 * @param {TGraph} graph - The graph to retrieve the edges from.
 * @param {string | TTypes} nodeOrTypes - The node or types to filter the edges by.
 * @param {string | TTypes} [neighborOrTypes] - The neighbor or types to filter the edges by.
 * @param {TTypes} [types] - The specific types to filter the edges by.
 * @returns {GetGraphEdgesOfTypesResult<TGraph, TTypes>} - The edges of the graph that match the specified types.
 * @throws {Error} - If the arguments are invalid.
 */
export function getGraphEdgesOfType<
	TGraph extends GraphWithTypeForEdge,
	TTypes extends TypesContainerForEdge<TGraph>,
>(graph: TGraph, types: TTypes): GetGraphEdgesOfTypesResult<TGraph, TTypes>

export function getGraphEdgesOfType<
	TGraph extends GraphWithTypeForEdge,
	TTypes extends TypesContainerForEdge<TGraph>,
>(
	graph: TGraph,
	node: string,
	types: TTypes
): GetGraphEdgesOfTypesResult<TGraph, TTypes>

export function getGraphEdgesOfType<
	TGraph extends GraphWithTypeForEdge,
	TTypes extends TypesContainerForEdge<TGraph>,
>(
	graph: TGraph,
	node: string,
	neighbor: string,
	types: TTypes
): GetGraphEdgesOfTypesResult<TGraph, TTypes>

export function getGraphEdgesOfType<
	TGraph extends GraphWithTypeForEdge,
	TTypes extends TypesContainerForEdge<TGraph>,
>(
	graph: TGraph,
	nodeOrTypes: string | TTypes,
	neighborOrTypes?: string | TTypes,
	types?: TTypes
): GetGraphEdgesOfTypesResult<TGraph, TTypes> {
	const args = [nodeOrTypes, neighborOrTypes, types]
	return flow(
		() => args,
		compact,
		createGetEdgesArgs,
		(result) => getEdges(result, graph)
	)()
}

interface GetEdgesValue {
	type: string
	args: any[]
}

type GetEdgesArgs =
	| {
			type: "single"
			value: GetEdgesValue
	  }
	| {
			type: "multi"
			value: GetEdgesValue[]
	  }

function getEdges(result: GetEdgesArgs, graph: any) {
	if (result.type === "multi") {
		return result.value.reduce((acc: any, { type, args }: any) => {
			// @ts-expect-error Returns expected type in actual use.
			acc[type] = filterEdgeEntries(graph, ...args)
			return acc
		}, {} as any)
	}
	// @ts-expect-error Returns expected type in actual use.
	return filterEdgeEntries(graph, ...result.value.args)
}

function createGetEdgesArgs(data: any[]): GetEdgesArgs {
	function createArgs(type: any) {
		return {
			type,
			args: [...data, createFn(type)],
		}
	}
	const last = data.pop()
	if (typeof last === "object") {
		return flow(
			() => last,
			getTypes,
			map(createArgs),
			(s) => ({ type: "multi", value: s }) as const
		)()
	}

	return { type: "single", value: createArgs(last) } as const
}

function createFn(type: any) {
	return (_: any, attr: any) => attr.type === type
}
