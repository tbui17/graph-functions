import { type EdgeEntry } from "graphology-types"

import {
	type GetTypeField,
	type ObjectWithTypeField,
	type ObjectWithTypeFieldGeneric,
	type CreateEdgeMapper as EdgeMapper,
	type InferGraphEdge,
	type EdgeEntryCallback,
} from "../types"
import { type InferGraphNode } from "../types"
import type Graph from "graphology"

export type GraphWithTypeForEdge = Graph<
	ObjectWithTypeField,
	ObjectWithTypeField
>

export type TypesObjectForEdge<TGraph extends GraphWithTypeForEdge> = {
	[K in GetTypeField<InferGraphEdge<TGraph>>]?: true
}

export type TypesArrayForEdge<TGraph extends GraphWithTypeForEdge> =
	ReadonlyArray<GetTypeField<InferGraphEdge<TGraph>>>

// defaults to union of all original node/edge types if type is widened to string
type ExtractEdgeEntry<TGraph extends Graph, K> = Extract<
	InferGraphEdge<TGraph>,
	ObjectWithTypeFieldGeneric<K>
> extends never
	? InferGraphEdge<TGraph>
	: Extract<InferGraphEdge<TGraph>, ObjectWithTypeFieldGeneric<K>>

type EdgeResult<TGraph extends GraphWithTypeForEdge, K> = EdgeEntry<
	InferGraphNode<TGraph>,
	ExtractEdgeEntry<TGraph, K>
>

type EdgeResultMultiple<TGraph extends GraphWithTypeForEdge, K> = EdgeResult<
	TGraph,
	K
>[]
export type TypesContainerForEdge<TGraph extends GraphWithTypeForEdge> =
	| TypesObjectForEdge<TGraph>
	| TypesArrayForEdge<TGraph>
	| GetTypeField<InferGraphEdge<TGraph>>

export type GetGraphEdgesOfTypeImplResult<
	TGraph extends GraphWithTypeForEdge,
	TType extends GetTypeField<InferGraphEdge<TGraph>>,
> = EdgeResultMultiple<TGraph, TType>

export type EdgeArrayResult<
	TGraph extends GraphWithTypeForEdge,
	TTypes extends TypesArrayForEdge<TGraph>,
> = {
	[K in TTypes[number]]: EdgeResultMultiple<TGraph, TTypes>
}

export type EdgeObjectResult<
	TGraph extends GraphWithTypeForEdge,
	TTypes extends TypesObjectForEdge<TGraph>,
> = {
	[K in keyof TTypes]: EdgeResultMultiple<TGraph, TTypes>
}

export type GetGraphEdgesOfTypesResult<
	TGraph extends GraphWithTypeForEdge,
	TTypes extends TypesContainerForEdge<TGraph>,
> = TTypes extends TypesArrayForEdge<TGraph>
	? EdgeArrayResult<TGraph, TTypes>
	: TTypes extends TypesObjectForEdge<TGraph>
	  ? EdgeObjectResult<TGraph, TTypes>
	  : TTypes extends GetTypeField<InferGraphEdge<TGraph>>
	    ? GetGraphEdgesOfTypeImplResult<TGraph, TTypes>
	    : never

export type GetGraphEdgesOfTypeArgs<
	TGraph extends Graph,
	TType extends string,
> =
	| [graph: TGraph, type: TType]
	| [graph: TGraph, node: string, type: TType]
	| [graph: TGraph, node: string, neighbor: string, type: TType]

export type FilterEdgeEntriesArgs<TGraph extends Graph> =
	| [graph: TGraph, filter: EdgeFilter<TGraph>]
	| [graph: TGraph, node: string, filter: EdgeFilter<TGraph>]
	| [
			graph: TGraph,
			node: string,
			neighbor: string,
			filter: EdgeFilter<TGraph>,
	  ]

export type MapFilterEdgesArgs<TGraph extends Graph, TReturn> =
	| [graph: TGraph, mapFilterFunction: EdgeMapper<TGraph, TReturn>]
	| [
			graph: TGraph,
			node: string,
			mapFilterFunction: EdgeMapper<TGraph, TReturn>,
	  ]
	| [
			graph: TGraph,
			node: string,
			neighbor: string,
			mapFilterFunction: EdgeMapper<TGraph, TReturn>,
	  ]

export type MapFilterEdgeEntriesArgs<TGraph extends Graph, TReturn> =
	| [graph: TGraph, mapFilterFunction: EdgeEntryCallback<TGraph, TReturn>]
	| [
			graph: TGraph,
			node: string,
			mapFilterFunction: EdgeEntryCallback<TGraph, TReturn>,
	  ]
	| [
			graph: TGraph,
			node: string,
			neighbor: string,
			mapFilterFunction: EdgeEntryCallback<TGraph, TReturn>,
	  ]

export type EdgeFilter<TGraph extends Graph> = EdgeMapper<
	TGraph,
	boolean | void
>
