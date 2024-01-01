import {
	type Attributes,
	type EdgeEntry,
	type EdgeIterationCallback,
} from "graphology-types"
import { type EdgeIterationCallbackParameters } from "../types"
// [0 edge, 1 attributes, 2 source, 3 target, 4 sourceAttributes, 5 targetAttributes, 6 undirected]
export enum EdgeEnums {
	edge,
	attributes,
	source,
	target,
	sourceAttributes,
	targetAttributes,
	undirected,
}
export function mapCallbackParametersToEdgeEntry<
	TNode extends Attributes,
	TEdge extends Attributes,
>([
	edge,
	attributes,
	source,
	target,
	sourceAttributes,
	targetAttributes,
	undirected,
]: EdgeIterationCallbackParameters<TNode, TEdge>): EdgeEntry<TNode, TEdge> {
	return {
		edge,
		attributes,
		source,
		target,
		sourceAttributes,
		targetAttributes,
		undirected,
	}
}
/**
 *
 * Reorders edge such that the source key and attributes are the same as that of the provided key.
 */
export function alignEdgeObject<
	TNode extends Attributes,
	TEdge extends Attributes,
>(selfKey: string, edge: EdgeEntry<TNode, TEdge>) {
	if (edge.target === selfKey) {
		return {
			...edge,
			source: edge.target,
			target: edge.source,
			sourceAttributes: edge.targetAttributes,
			targetAttributes: edge.sourceAttributes,
		}
	}
	return edge
}

export function alignEdgeAndMapToObject<
	TNode extends Attributes,
	TEdge extends Attributes,
>(
	selfKey: string,
	edge:
		| EdgeEntry<TNode, TEdge>
		| EdgeIterationCallbackParameters<TNode, TEdge>
) {
	if (Array.isArray(edge)) {
		return mapCallbackParametersToEdgeEntry(alignEdge(selfKey, edge))
	}
	return alignEdgeObject(selfKey, edge)
}

/**
 *
 * Reorders edge such that the source key and attributes are the same as that of the provided key.
 */
export function alignEdge<TNode extends Attributes, TEdge extends Attributes>(
	selfKey: string,
	edge: EdgeIterationCallbackParameters<TNode, TEdge>
): EdgeIterationCallbackParameters<TNode, TEdge> {
	if (edge[3] === selfKey) {
		// swap source and target, sourceAttributes and targetAttributes
		return [
			edge[EdgeEnums.edge],
			edge[EdgeEnums.attributes],
			edge[EdgeEnums.target],
			edge[EdgeEnums.source],
			edge[EdgeEnums.targetAttributes],
			edge[EdgeEnums.sourceAttributes],
			edge[EdgeEnums.undirected],
		]
	}
	return edge
}
export function createEdgeEntryFromIterationArgs<
	TNodeAttributes extends Attributes,
	TEdgeAttributes extends Attributes,
>([
	edge,
	attributes,
	source,
	target,
	sourceAttributes,
	targetAttributes,
	undirected,
]: Parameters<EdgeIterationCallback<TNodeAttributes, TEdgeAttributes>>) {
	return {
		edge,
		attributes,
		source,
		target,
		sourceAttributes,
		targetAttributes,
		undirected,
	}
}
