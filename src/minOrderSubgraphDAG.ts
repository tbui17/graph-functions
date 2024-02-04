import { allPairsEach } from "@tbui17/iteration-utilities"
import Graph from "graphology"
import { bidirectional } from "graphology-shortest-path"
import { type NodeEntry, type EdgeEntry } from "graphology-types"
import {
	type InferGraphEdge,
	type InferGraphNode,
	mapCallbackParametersToEdgeEntry,
} from "."

/**
 *
 * Assumes provided subgraph is a DAG.
 *
 * Retrieves smallest subgraph containing all specified terminal nodes, disregarding weight and direction
 *
 * @returns The subgraph if the nodes are connected.
 *
 * @throws {SubgraphError} - If the provided nodes are not connected in the original graph.
 */
export function minOrderSubgraphDAG<TGraph extends Graph>(
	graph: TGraph,
	nodes: string[]
) {
	const subgraph = new Graph()

	mergeKeyNodeComponentIntoSubgraph(nodes, graph, subgraph)
	return subgraph as Graph<InferGraphNode<TGraph>, InferGraphEdge<TGraph>>
}

class ItemMap<T> {
	private map = new Map<string, T>()

	constructor(public selector: (item: T) => string) {}

	get data() {
		return Array.from(this.map.values())
	}

	add(item: T) {
		const res = this.selector(item)
		if (this.map.has(res)) {
			return this
		}
		this.map.set(res, item)

		return this
	}
	addDelayed(key: string, fn: () => T) {
		if (this.map.has(key)) {
			return this
		}
		this.add(fn())
		return this
	}

	has(item: T) {
		return this.map.has(this.selector(item))
	}

	hasKey(key: string) {
		return this.map.has(key)
	}
}

function mergeKeyNodeComponentIntoSubgraph(
	keyNodes: string[],
	graph: Graph,
	subgraph: Graph
) {
	const { nodes, edges } = prepareSubgraphData(graph, keyNodes)
	nodes.forEach((node) => {
		subgraph.addNode(node.node, node.attributes)
	})
	edges.forEach((edge) => {
		subgraph.addEdgeWithKey(
			edge.edge,
			edge.source,
			edge.target,
			edge.attributes
		)
	})
}

export class SubgraphError extends Error {
	constructor(nodeA: string, nodeB: string, nodeInput: string[]) {
		const msg = {
			message: `Provided nodes are not connected.`,
			nodeA,
			nodeB,
			nodeInput,
		}
		const message = JSON.stringify(msg)
		super(message)
		this.name = "SubgraphError"
	}
}

function prepareSubgraphData(graph: Graph, nodeInput: string[]) {
	const nodeCollection = new ItemMap<NodeEntry>((node) => node.node)
	const edgeCollection = new ItemMap<EdgeEntry>((edge) => edge.edge)

	const shortestPathAdder = (path: string[]) => {
		for (const node of path) {
			nodeCollection.add({
				node,
				attributes: graph.getNodeAttributes(node),
			})
		}
		allPairsEach(path, (nodeA2, nodeB2) => {
			// adds parallel edges
			graph.forEachEdge(nodeA2, nodeB2, (...args) => {
				const edge = mapCallbackParametersToEdgeEntry(args)
				edgeCollection.add(edge)
			})
		})
	}

	allPairsEach(nodeInput, (nodeA, nodeB) => {
		const path = bidirectional(graph, nodeA, nodeB)
		if (!path) {
			throw new SubgraphError(nodeA, nodeB, nodeInput)
		}
		shortestPathAdder(path)
	})
	return {
		nodes: nodeCollection.data,
		edges: edgeCollection.data,
	}
}
