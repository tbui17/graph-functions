import type Graph from "graphology"
import { type ForEachNeighborMethods, bfsGraph } from ".."

/**
 * Retrieves the component of a given node in a graph using breadth-first search.
 * Returns nodes that are in the same subgraph component as the given node.
 *
 * @param graph - The graph to search in.
 * @param node - The node to find the component for.
 * @param options - Optional parameters for customizing the search behavior.
 * @param options.neighborStrategy - The strategy to use when traversing neighboring nodes.
 * @returns Returns nodes that are in the same subgraph component as the given node.
 */
export function getNodeComponent(
	graph: Graph,
	node: string,
	{
		neighborStrategy,
	}: {
		neighborStrategy?: ForEachNeighborMethods
	} = {}
): string[] {
	const nodes = new Set<string>()
	bfsGraph({
		graph,
		nodes: node,
		fn(ctx) {
			nodes.add(ctx.source).add(ctx.target)
		},
		opts: {
			neighborStrategy,
		},
	})
	return Array.from(nodes)
}
