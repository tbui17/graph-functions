import type Graph from "graphology"
import {
	type EdgeEntryCallback,
	type CreateEdgeMapper,
	type InferGraphEdgeEntry,
	type InferGraphNode,
	type InferGraphEdge,
} from "../types"
import {
	filterEdgeEntries,
	mapCallbackParametersToEdgeEntry,
	mapFilterEdgeEntries,
	mapFilterEdges,
} from ".."

export class RecursorContext<TGraph extends Graph> {
	constructor(
		public graph: TGraph,
		public inputNodes: Set<string>,
		public currentInputNode: string,
		public source: string,
		public target: string,
		public path: string[]
	) {}

	public sourceAttributes() {
		return this.graph.getNodeAttributes(
			this.source
		) as InferGraphNode<TGraph>
	}

	public targetAttributes() {
		return this.graph.getNodeAttributes(
			this.target
		) as InferGraphNode<TGraph>
	}

	public edges() {
		return this.graph.edges(this.source, this.target)
	}

	public edgeEntries() {
		return this.graph.edgeEntries(
			this.source,
			this.target
		) as IterableIterator<InferGraphEdgeEntry<TGraph>>
	}

	public edge() {
		return this.graph.edge(this.source, this.target)
	}

	public directedEdge() {
		return this.graph.directedEdge(this.source, this.target)
	}

	public directedEdgeAttributes() {
		return this.graph.getDirectedEdgeAttributes(
			this.source,
			this.target
		) as InferGraphEdge<TGraph>
	}

	public inEdges() {
		return this.graph.inEdges(this.source, this.target)
	}

	public inEdgeEntries() {
		return this.graph.inEdgeEntries(
			this.source,
			this.target
		) as IterableIterator<InferGraphEdgeEntry<TGraph>>
	}

	public outboundEdges() {
		return this.graph.outboundEdges(this.source, this.target)
	}

	public inboundEdges() {
		return this.graph.inboundEdges(this.source, this.target)
	}

	public inboundEdgeEntries() {
		return this.graph.inboundEdgeEntries(
			this.source,
			this.target
		) as IterableIterator<InferGraphEdgeEntry<TGraph>>
	}

	public outboundEdgeEntries() {
		return this.graph.outboundEdgeEntries(
			this.source,
			this.target
		) as IterableIterator<InferGraphEdgeEntry<TGraph>>
	}

	public outEdges() {
		return this.graph.outEdges(this.source, this.target)
	}

	public undirectedEdge() {
		return this.graph.undirectedEdge(this.source, this.target)
	}

	public undirectedEdgeAttributes() {
		return this.graph.getUndirectedEdgeAttributes(
			this.source,
			this.target
		) as InferGraphEdge<TGraph>
	}

	public outEdgeEntries() {
		return this.graph.outEdgeEntries(
			this.source,
			this.target
		) as IterableIterator<InferGraphEdgeEntry<TGraph>>
	}

	public edgeAttributes() {
		return this.graph.getEdgeAttributes(
			this.source,
			this.target
		) as InferGraphEdge<TGraph>
	}

	public forEachEdge(cb: CreateEdgeMapper<TGraph, void>) {
		//@ts-expect-error Possible attributes should be the same type given current constraints.
		this.graph.forEachEdge(this.source, this.target, cb)
	}

	public forEachEdgeEntry(cb: EdgeEntryCallback<TGraph, void>) {
		this.graph.forEachEdge(this.source, this.target, (...args) => {
			//@ts-expect-error Possible attributes should be the same type given current constraints.
			cb(mapCallbackParametersToEdgeEntry(args))
		})
	}

	public filterEdges(cb: CreateEdgeMapper<TGraph, boolean | void>) {
		//@ts-expect-error Possible attributes should be the same type given current constraints.
		return this.graph.filterEdges(this.source, this.target, cb)
	}

	public mapEdges<TReturn>(cb: CreateEdgeMapper<TGraph, TReturn>) {
		//@ts-expect-error Possible attributes should be the same type given current constraints.
		return this.graph.mapEdges(this.source, this.target, cb)
	}

	public mapFilterEdges<TReturn>(cb: CreateEdgeMapper<TGraph, TReturn>) {
		return mapFilterEdges(this.graph, this.source, this.target, cb)
	}

	public mapFilterEdgeEntries<TReturn>(
		cb: EdgeEntryCallback<TGraph, TReturn>
	) {
		return mapFilterEdgeEntries(this.graph, this.source, this.target, cb)
	}

	public filterEdgeEntries(cb: CreateEdgeMapper<TGraph, boolean | void>) {
		return filterEdgeEntries(this.graph, this.source, this.target, cb)
	}
}
