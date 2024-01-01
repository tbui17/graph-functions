import Graph from "graphology"
import { Attributes } from "graphology-types"

abstract class BaseTestGraph<
	T1 extends Attributes = Attributes,
	T2 extends Attributes = Attributes,
	T3 extends Attributes = Attributes,
> extends Graph<T1, T2, T3> {
	constructor() {
		super({
			multi: true,
			allowSelfLoops: false,
			type: "undirected",
		})
	}
}
type NodeA = { type: "a"; propA: string }
type NodeB = { type: "b"; propB: string }
type NodeC = { type: "c"; propC: string }

export type Nodes = NodeA | NodeB | NodeC

type EdgeBase = { type: "base"; value: number }
type EdgeType1 = { type: "type1"; type1Value: string }
type EdgeType2 = { type: "type2"; type2Value: boolean }
export type Edges = EdgeBase | EdgeType1 | EdgeType2

export class TestGraph extends BaseTestGraph<Nodes, Edges> {}
