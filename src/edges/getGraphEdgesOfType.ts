import { type InferGraphEdge } from "../types"

import {
	type GraphWithTypeForEdge,
	type GetGraphEdgesOfTypeArgs,
	type GetGraphEdgesOfTypeImplResult,
	type TypesContainerForEdge,
	type GetGraphEdgesOfTypesResult,
} from "./types"
import { filterEdgeEntries } from "./filterEdgeEntries"

function getGraphEdgesOfTypeSingle<
	TGraph extends GraphWithTypeForEdge,
	const TType extends InferGraphEdge<TGraph>["type"],
>(
	...args: GetGraphEdgesOfTypeArgs<TGraph, TType>
): GetGraphEdgesOfTypeImplResult<TGraph, TType> {
	const [graph, nodeOrType, neighborOrType, type] = args

	if (typeof type === "string" && typeof neighborOrType === "string") {
		//@ts-expect-error Returns expected type in actual use.
		return filterEdgeEntries(
			graph,
			nodeOrType,
			neighborOrType,
			(_, attr) => attr.type === type
		)
	}
	if (typeof neighborOrType === "string") {
		//@ts-expect-error Returns expected type in actual use.
		return filterEdgeEntries(
			graph,
			nodeOrType,
			(_, attr) => attr.type === neighborOrType
		)
	}
	//@ts-expect-error Returns expected type in actual use.
	return filterEdgeEntries(graph, (_, attr) => attr.type === nodeOrType)
}

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
	const edges = {} as any

	if (
		Array.isArray(types) &&
		typeof neighborOrTypes === "string" &&
		typeof nodeOrTypes === "string"
	) {
		for (const type of types) {
			edges[type] = getGraphEdgesOfTypeSingle(
				graph,
				nodeOrTypes,
				neighborOrTypes,
				type
			)
		}
		return edges
	}
	if (Array.isArray(neighborOrTypes) && typeof nodeOrTypes === "string") {
		for (const type of neighborOrTypes) {
			edges[type] = getGraphEdgesOfTypeSingle(graph, nodeOrTypes, type)
		}
		return edges
	}
	if (Array.isArray(nodeOrTypes)) {
		for (const type of nodeOrTypes) {
			edges[type] = getGraphEdgesOfTypeSingle(graph, type)
		}
		return edges
	}

	if (
		typeof types === "object" &&
		typeof neighborOrTypes === "string" &&
		typeof nodeOrTypes === "string"
	) {
		for (const type in types) {
			edges[type] = getGraphEdgesOfTypeSingle(
				graph,
				nodeOrTypes,
				neighborOrTypes,
				type
			)
		}
		return edges
	}

	if (
		typeof neighborOrTypes === "object" &&
		typeof nodeOrTypes === "string"
	) {
		for (const type in neighborOrTypes) {
			edges[type] = getGraphEdgesOfTypeSingle(graph, nodeOrTypes, type)
		}
		return edges
	}
	if (typeof nodeOrTypes === "object") {
		for (const type in nodeOrTypes) {
			edges[type] = getGraphEdgesOfTypeSingle(graph, type)
		}
		return edges
	}

	if (
		typeof types === "string" &&
		typeof neighborOrTypes === "string" &&
		typeof nodeOrTypes === "string"
	) {
		return getGraphEdgesOfTypeSingle(
			graph,
			nodeOrTypes,
			neighborOrTypes,
			types
		) as GetGraphEdgesOfTypesResult<TGraph, TTypes>
	}
	if (
		typeof neighborOrTypes === "string" &&
		typeof nodeOrTypes === "string"
	) {
		return getGraphEdgesOfTypeSingle(
			graph,
			nodeOrTypes,
			neighborOrTypes
		) as GetGraphEdgesOfTypesResult<TGraph, TTypes>
	}
	if (typeof nodeOrTypes === "string") {
		return getGraphEdgesOfTypeSingle(
			graph,
			nodeOrTypes
		) as GetGraphEdgesOfTypesResult<TGraph, TTypes>
	}

	throw new Error("Invalid arguments")
}
