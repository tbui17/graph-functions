import { describe, expect, expectTypeOf, it } from "vitest"

import { getGraphEdgesOfType } from ".."
import { type TaggedUnion } from "type-fest"
import Graph from "graphology"
import type { Attributes, EdgeEntry } from "graphology-types"
import { Edges, Nodes, TestGraph } from "./testUtils/testGraph"

describe("getGraphEdgesOfType should partition edge entries by the types provided in the input.", () => {
	const g = new TestGraph()
	g.addNode("a", { type: "a", propA: "a" })
	g.addNode("a2", { type: "a", propA: "a2" })
	g.addNode("b", { type: "b", propB: "b" })
	g.addNode("c", { type: "c", propC: "c" })
	g.addEdge("a", "b", { type: "base", value: 4 })
	g.addEdge("a", "c", { type: "base", value: 5 })
	g.addEdge("a", "b", { type: "type1", type1Value: "type1Value" })

	const edgeAB: EdgeEntry = {
		attributes: { type: "base", value: 4 },
		edge: expect.any(String),
		source: "a",
		sourceAttributes: { type: "a", propA: "a" },
		target: "b",
		targetAttributes: { type: "b", propB: "b" },
		undirected: true,
	}
	const edgeAC: EdgeEntry = {
		attributes: { type: "base", value: 5 },
		edge: expect.any(String),
		source: "a",
		sourceAttributes: { type: "a", propA: "a" },
		target: "c",
		targetAttributes: { type: "c", propC: "c" },
		undirected: true,
	}
	const edgeType1AB: EdgeEntry = {
		attributes: { type: "type1", type1Value: "type1Value" },
		edge: expect.any(String),
		source: "a",
		sourceAttributes: { type: "a", propA: "a" },
		target: "b",
		targetAttributes: { type: "b", propB: "b" },
		undirected: true,
	}

	const expected = {
		base: expect.arrayContaining([edgeAB, edgeAC]),
		type1: [edgeType1AB],
		type2: [],
	}

	type ExpectedEntry = EdgeEntry<Nodes, Edges>[]

	type ExpectedType = {
		base: ExpectedEntry
		type1: ExpectedEntry
		type2: ExpectedEntry
	}

	it("array input", () => {
		const res = getGraphEdgesOfType(g, ["base", "type1", "type2"])
		expect(res).toEqual(expected)
		expect(res.base.length).toEqual(2)
		expect(res.type1.length).toEqual(1)
		expect(res.type2.length).toEqual(0)
		expectTypeOf(res).toEqualTypeOf<ExpectedType>()
	})

	it("object input", () => {
		const res = getGraphEdgesOfType(g, {
			base: true,
			type1: true,
			type2: true,
		})
		expect(res).toEqual(expected)

		expectTypeOf(res).toEqualTypeOf<ExpectedType>()
	})

	it("string input", () => {
		const res = getGraphEdgesOfType(g, "base")

		expect(res).toEqual(expected.base)

		const edge = res[0]!
		type ExpectedEdge = {
			type: "base"
			value: number
		}
		expectTypeOf(edge.attributes).toEqualTypeOf<ExpectedEdge>()
		expectTypeOf(edge.sourceAttributes).toEqualTypeOf<Nodes>()
		expectTypeOf(edge.targetAttributes).toEqualTypeOf<Nodes>()
	})
})

describe("getGraphEdgesOfType neighbors", () => {
	const g = new TestGraph()

	const nodeA = { type: "a", propA: "a" } as const
	const nodeB = { type: "b", propB: "b" } as const
	const nodeC = { type: "c", propC: "c" } as const

	g.addNode("a", nodeA)
	g.addNode("b", nodeB)
	g.addNode("c", nodeC)

	const edgeABBase = { type: "base", value: 4 } as const
	const edgeABBaseEntry: EdgeEntry = {
		attributes: edgeABBase,
		edge: expect.any(String),
		source: "a",
		sourceAttributes: nodeA,
		target: "b",
		targetAttributes: nodeB,
		undirected: true,
	}
	const edgeACBase = { type: "base", value: 5 } as const
	const edgeACBaseEntry: EdgeEntry = {
		attributes: edgeACBase,
		edge: expect.any(String),
		source: "a",
		sourceAttributes: nodeA,
		target: "c",
		targetAttributes: nodeC,
		undirected: true,
	}
	const edgeABType1 = { type: "type1", type1Value: "type1Value" } as const
	const edgeABType1Entry: EdgeEntry = {
		attributes: edgeABType1,
		edge: expect.any(String),
		source: "a",
		sourceAttributes: nodeA,
		target: "b",
		targetAttributes: nodeB,
		undirected: true,
	}
	const edgeACType1 = { type: "type1", type1Value: "type1Value" } as const
	const edgeACType1Entry: EdgeEntry = {
		attributes: edgeACType1,
		edge: expect.any(String),
		source: "a",
		sourceAttributes: nodeA,
		target: "c",
		targetAttributes: nodeC,
		undirected: true,
	}
	const edgeBCBase = { type: "base", value: 6 } as const
	const edgeBCBaseEntry: EdgeEntry = {
		attributes: edgeBCBase,
		edge: expect.any(String),
		source: "b",
		sourceAttributes: nodeB,
		target: "c",
		targetAttributes: nodeC,
		undirected: true,
	}
	const edgeBCType1 = { type: "type1", type1Value: "type1Value" } as const
	const edgeBCType1Entry: EdgeEntry = {
		attributes: edgeBCType1,
		edge: expect.any(String),
		source: "b",
		sourceAttributes: nodeB,
		target: "c",
		targetAttributes: nodeC,
		undirected: true,
	}

	g.addEdge("a", "b", edgeABBase)
	g.addEdge("a", "c", edgeACBase)
	g.addEdge("a", "b", edgeABType1)
	g.addEdge("a", "c", edgeACType1)
	g.addEdge("b", "c", edgeBCBase)
	g.addEdge("b", "c", edgeBCType1)

	it("should be able to narrow down involved nodes/neighbor through overloads", () => {
		const allType1Edges = getGraphEdgesOfType(g, ["type1"]) // 3 total type1 edges in graph
		const allType1EdgesInvolvingA = getGraphEdgesOfType(g, "a", ["type1"]) //  2 total type1 A edges
		const abType1Edges = getGraphEdgesOfType(g, "a", "b", ["type1"]) //  1 from a to b
		const acType1Edges = getGraphEdgesOfType(g, "a", "c", ["type1"]) // 1 from a to c
		const bcType1Edges = getGraphEdgesOfType(g, "b", "c", ["type1"]) // 1 from b to c

		expectArrayContentsToOnlyContain(allType1Edges.type1, [
			edgeABType1Entry,
			edgeACType1Entry,
			edgeBCType1Entry,
		])
		expectArrayContentsToOnlyContain(allType1EdgesInvolvingA.type1, [
			edgeABType1Entry,
			edgeACType1Entry,
		])
		expectArrayContentsToOnlyContain(abType1Edges.type1, [edgeABType1Entry])
		expectArrayContentsToOnlyContain(acType1Edges.type1, [edgeACType1Entry])
		expectArrayContentsToOnlyContain(bcType1Edges.type1, [edgeBCType1Entry])
	})
})

function expectArrayContentsToOnlyContain(value: any[], expected: any[]) {
	expect(value).toEqual(expect.arrayContaining(expected))
	expect(value.length).toEqual(expected.length)
}
