import { describe, expect, expectTypeOf, it } from "vitest"
import { TestGraph } from "./testUtils/testGraph"
import { getGraphNodesOfType } from ".."
import { NodeEntry } from "graphology-types"

describe("getGraphNodesOfType", () => {
	const g = new TestGraph()

	const nodeA = { type: "a", propA: "a" } as const
	const nodeA2 = { type: "a", propA: "a2" } as const
	const nodeAEntry: NodeEntry = {
		node: "a",
		attributes: nodeA,
	}
	type NodeAExpectedType = {
		node: string
		attributes: {
			type: "a"
			propA: string
		}
	}
	const nodeA2Entry: NodeEntry = {
		node: "a2",
		attributes: nodeA2,
	}

	const nodeB = { type: "b", propB: "b" } as const
	const nodeBEntry: NodeEntry = {
		node: "b",
		attributes: nodeB,
	}

	g.addNode("a", nodeA)
	g.addNode("a2", nodeA2)
	g.addNode("b", nodeB)

	it("string input", () => {
		const res = getGraphNodesOfType(g, "a")

		expect(res).toEqual([nodeAEntry, nodeA2Entry])
		expectTypeOf(res[0]!).toEqualTypeOf<NodeAExpectedType>()
	})

	it("array input", () => {
		const res = getGraphNodesOfType(g, ["a", "b"])

		expect(res.a).toEqual([nodeAEntry, nodeA2Entry])
		expectTypeOf(res.a[0]!).toEqualTypeOf<NodeAExpectedType>()
		expect(res.b).toEqual([nodeBEntry])
	})

	it("object input", () => {
		const res = getGraphNodesOfType(g, {
			a: true,
			b: true,
		})

		expect(res.a).toEqual([nodeAEntry, nodeA2Entry])
		expect(res.b).toEqual([nodeBEntry])
	})
})
