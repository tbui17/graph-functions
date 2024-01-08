import { describe, expect, it, vi } from "vitest"
import { TestGraph1 } from "./testUtils/testGraph"
import { type EdgeEntry } from "graphology-types"
import { bfsGraph } from ".."
import _ from "lodash"

describe("bfs", () => {
	const g = new TestGraph1()

	const nodeA = { type: "a", propA: "a" } as const
	const nodeB = { type: "b", propB: "b" } as const
	const nodeC = { type: "c", propC: "c" } as const

	g.addNode("a", nodeA)
	g.addNode("b", nodeB)
	g.addNode("c", nodeC)

	const edgeABBase = { type: "base", value: 4 } as const
	const edgeABBaseEntry: EdgeEntry = {
		attributes: edgeABBase,
		edge: "edgeABBase",
		source: "a",
		sourceAttributes: nodeA,
		target: "b",
		targetAttributes: nodeB,
		undirected: true,
	}
	const edgeACBase = { type: "base", value: 5 } as const
	const edgeACBaseEntry: EdgeEntry = {
		attributes: edgeACBase,
		edge: "edgeACBase",
		source: "a",
		sourceAttributes: nodeA,
		target: "c",
		targetAttributes: nodeC,
		undirected: true,
	}
	const edgeABType1 = { type: "type1", type1Value: "type1Value" } as const
	const edgeABType1Entry: EdgeEntry = {
		attributes: edgeABType1,
		edge: "edgeABType1",
		source: "a",
		sourceAttributes: nodeA,
		target: "b",
		targetAttributes: nodeB,
		undirected: true,
	}
	const edgeACType1 = { type: "type1", type1Value: "type1Value" } as const
	const edgeACType1Entry: EdgeEntry = {
		attributes: edgeACType1,
		edge: "edgeACType1",
		source: "a",
		sourceAttributes: nodeA,
		target: "c",
		targetAttributes: nodeC,
		undirected: true,
	}
	const edgeBCBase = { type: "base", value: 6 } as const
	const edgeBCBaseEntry: EdgeEntry = {
		attributes: edgeBCBase,
		edge: "edgeBCBase",
		source: "b",
		sourceAttributes: nodeB,
		target: "c",
		targetAttributes: nodeC,
		undirected: true,
	}
	const edgeBCType1 = { type: "type1", type1Value: "type1Value" } as const
	const edgeBCType1Entry: EdgeEntry = {
		attributes: edgeBCType1,
		edge: "edgeBCType1",
		source: "b",
		sourceAttributes: nodeB,
		target: "c",
		targetAttributes: nodeC,
		undirected: true,
	}

	g.addEdgeWithKey("edgeABBase", "a", "b", edgeABBase)
	g.addEdgeWithKey("edgeABType1", "a", "b", edgeABType1)
	g.addEdgeWithKey("edgeBCBase", "b", "c", edgeBCBase)
	g.addEdgeWithKey("edgeBCType1", "b", "c", edgeBCType1)
	it("should maintain expected path", () => {
		const expectedPath = [
			["a", "b"],
			["a", "b", "c"],
		]
		const path: string[][] = []

		bfsGraph({
			graph: g,
			nodes: "a",
			fn(ctx) {
				expect(ctx.currentInputNode).toBe("a")
				path.push(ctx.path)
			},
		})

		expect(path).toEqual(expect.arrayContaining(expectedPath))
	})

	it("should pass essential state to context to retrieve correct derived information", () => {
		const data: {
			source: string
			target: string
			edges: string[]
		}[] = []

		bfsGraph({
			graph: g,
			nodes: "a",
			fn(ctx) {
				const result = {
					source: ctx.source,
					target: ctx.target,
					edges: ctx.edges(),
				}
				data.push(result)
			},
			opts: {
				neighborStrategy: "forEachNeighbor",
			},
		})
		const expected = [
			{
				source: "a",
				target: "b",
				edges: expect.arrayContaining(["edgeABType1", "edgeABBase"]),
			},
			{
				source: "b",
				target: "c",
				edges: expect.arrayContaining(["edgeBCType1", "edgeBCBase"]),
			},
		]

		expect(data).toEqual(expect.arrayContaining(expected))
	})

	it("should be able to break and return value if specified by visitor", () => {
		const res = bfsGraph({
			graph: g,
			nodes: "a",
			fn(ctx) {
				if (ctx.source === "b") {
					return Array.from(ctx.edgeEntries())
				}
			},
		})

		expect(res).toEqual(
			expect.arrayContaining([edgeBCBaseEntry, edgeBCType1Entry])
		)
	})
})
