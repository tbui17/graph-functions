import { type NodeEntry } from "graphology-types"
import {
	type GetTypeField,
	type ObjectWithTypeField,
	type ObjectWithTypeFieldGeneric,
	type InferGraphNode,
} from "../types"

import { type NodeIterationCallback } from "graphology-types"

import type Graph from "graphology"
import { type SetReturnType } from "type-fest"

export type GetGraphTypeField<TGraph extends GraphWithTypeForNode> =
	GetTypeField<InferGraphNode<TGraph>>

export type GraphWithTypeForNode = Graph<ObjectWithTypeField>

export type TypesObject<TGraph extends GraphWithTypeForNode> = {
	[K in GetGraphTypeField<TGraph>]?: true
}

type DefaultNodeEntry<TGraph extends Graph> = InferGraphNode<TGraph> // default if type is widened to string

export type ExtractNodeAttributes<TGraph extends Graph, K> = Extract<
	InferGraphNode<TGraph>,
	ObjectWithTypeFieldGeneric<K>
> extends never
	? DefaultNodeEntry<TGraph>
	: Extract<InferGraphNode<TGraph>, ObjectWithTypeFieldGeneric<K>>

export type ExtractNodeEntry<TGraph extends Graph, K> = NodeEntry<
	ExtractNodeAttributes<TGraph, K>
>

export type TypesArray<TGraph extends GraphWithTypeForNode> = ReadonlyArray<
	GetGraphTypeField<TGraph>
>

export type TypesContainer<TGraph extends GraphWithTypeForNode> =
	| TypesObject<TGraph>
	| TypesArray<TGraph>
	| GetGraphTypeField<TGraph>

type NodeEntryForKey<TGraph extends Graph, K> = ExtractNodeEntry<TGraph, K>[]

export type GetGraphNodesOfTypeResultFromObject<
	TGraph extends GraphWithTypeForNode,
	TTypes extends TypesObject<TGraph>,
> = {
	[K in keyof TTypes]: NodeEntryForKey<TGraph, K>
}

export type GetGraphNodesOfTypeResultFromArray<
	TGraph extends GraphWithTypeForNode,
	TTypes extends TypesArray<TGraph>,
> = {
	[K in TTypes[number]]: NodeEntryForKey<TGraph, K>
}

export type GetGraphNodesofTypeResult<
	TGraph extends GraphWithTypeForNode,
	TTypes extends TypesContainer<TGraph>,
> = TTypes extends TypesArray<TGraph>
	? GetGraphNodesOfTypeResultFromArray<TGraph, TTypes>
	: TTypes extends TypesObject<TGraph>
	  ? GetGraphNodesOfTypeResultFromObject<TGraph, TTypes>
	  : TTypes extends GetGraphTypeField<TGraph>
	    ? ExtractNodeEntry<TGraph, TTypes>[]
	    : never

export type NodeFilter<TGraph extends Graph> = SetReturnType<
	NodeIterationCallback<InferGraphNode<TGraph>>,
	boolean | void
>
