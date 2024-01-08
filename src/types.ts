import type Graph from "graphology"


import {
	type NodeEntry,
	type EdgeEntry,
	type Attributes,
	type EdgeIterationCallback,
	type EdgeMapper,
} from "graphology-types"

export type InferGraphNode<TGraph extends Graph> = TGraph extends Graph<
	infer TNode
>
	? TNode
	: never
export type InferGraphEdge<TGraph extends Graph> = TGraph extends Graph<
	any,
	infer TEdge
>
	? TEdge
	: never
export type InferGraph<
	TGraph extends Graph,
	Parameter extends "node" | "edge" | "graph",
> = TGraph extends Graph<infer TNode, infer TEdge, infer TGraphAttributes>
	? Parameter extends "node"
		? TNode
		: Parameter extends "edge"
			? TEdge
			: TGraphAttributes
	: never
export type InferGraphAttributes<TGraph extends Graph> = TGraph extends Graph<
	any,
	any,
	infer TGraphAttributes
>
	? TGraphAttributes
	: never
export type InferGraphNodeEntry<TGraph extends Graph> = NodeEntry<
	InferGraphNode<TGraph>
>
export type InferGraphEdgeEntry<TGraph extends Graph> = EdgeEntry<
	InferGraphNode<TGraph>,
	InferGraphEdge<TGraph>
>
export type EdgeIterationCallbackParameters<
	TNode extends Attributes,
	TEdge extends Attributes,
> = Parameters<EdgeIterationCallback<TNode, TEdge>>
export type InferEdgeIterationCallback<TGraph extends Graph> =
	EdgeIterationCallback<InferGraphNode<TGraph>, InferGraphEdge<TGraph>>
export type InferEdgeIterationParameters<TGraph extends Graph> = Parameters<
	InferEdgeIterationCallback<TGraph>
>

export type CreateEdgeMapper<TGraph extends Graph, TReturn> = EdgeMapper<
	TReturn,
	InferGraphNode<TGraph>,
	InferGraphEdge<TGraph>
>

export type EdgeEntryCallback<TGraph extends Graph, R> = (
	edge: InferGraphEdgeEntry<TGraph>
) => R

export type ObjectWithTypeFieldGeneric<T> = { type: T }
export type ObjectWithTypeFieldGenericPassthrough<T> = { type: T } & Attributes
export type ObjectWithTypeField = ObjectWithTypeFieldGeneric<string>
export type ObjectWithTypeFieldPassthrough =
	ObjectWithTypeFieldGenericPassthrough<string>

export type GetTypeField<T extends ObjectWithTypeField> = T["type"]
export type ForEachNeighborMethods = Extract<
	keyof Graph,
	`forEach${string}Neighbor`
>
