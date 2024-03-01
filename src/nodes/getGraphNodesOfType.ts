import {
	type GraphWithTypeForNode,
	type TypesContainer,
	type GetGraphNodesofTypeResult,
	type GetGraphTypeField,
} from "./types"

import { filterNodeEntries } from "./filterNodeEntries"
import { getTypes } from "../internal/getTypes"

/**
 * Retrieves graph nodes of a specific type from the given graph.
 *
 *
 *
 * @template TGraph - A graph that contains a type field {@link ObjectWithTypeField} in its node attributes.
 * @template TTypes - A string for a single type, or object or array for multiple types.
 * @param {TGraph} graph - The graph to retrieve nodes from.
 * @param {TTypes} types - The types of nodes to retrieve.
 * @returns {GetGraphNodesofTypeResult<TGraph, TTypes>} An array if a string was provided for the types (single result), or an object of arrays if an object or array was provided for the types (multiple results). The node type is inferred from the node's type attribute if it was specified using a literal string.
 * @example
 *	 type LanguageAttributes = {
 *		_type: "language"
 *		country: string
 *	}
 *
 *	type CountryAttributes = {
 *		_type: "country"
 *		continent: string
 *	}
 *
 *	type StringResult = NodeEntry<CountryAttributes>[]
 *
 *	type ArrayOrObjectResult = {
 *		language: NodeEntry<LanguageAttributes>[]
 *		country: NodeEntry<CountryAttributes>[]
 *	}
 *
 *	const graph = new Graph<LanguageAttributes | CountryAttributes>()
 * // After adding nodes...
 *
 *
 * // StringResult is inferred
 *	const result = getGraphNodesOfType(graph, "country")
 *
 * // ArrayOrObjectResult is inferred
 *	const result2 = getGraphNodesOfType(graph, ["language", "country"])
 *
 * // ArrayOrObjectResult is inferred
 *	const result3 = getGraphNodesOfType(graph, {
 *		language: true,
 *		country: true,
 *	})
 *
 */

export function getGraphNodesOfType<
	TGraph extends GraphWithTypeForNode,
	TTypes extends TypesContainer<TGraph>,
>(graph: TGraph, types: TTypes): GetGraphNodesofTypeResult<TGraph, TTypes> {
	if (typeof types === "string") {
		return getGraphNodesOfTypeSingle(
			graph,
			types
		) as GetGraphNodesofTypeResult<TGraph, TTypes>
	}

	return getTypes(types).reduce((acc, curr) => {
		acc[curr] = getGraphNodesOfTypeSingle(graph, curr)
		return acc
	}, {} as any)
}


function getGraphNodesOfTypeSingle<
	TGraph extends GraphWithTypeForNode,
	const TType extends GetGraphTypeField<TGraph>,
>(graph: TGraph, type: TType) {
	return filterNodeEntries(graph, (_, attr) => {
		return attr.type === type
	})
}
