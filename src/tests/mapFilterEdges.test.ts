import { describe, expect, expectTypeOf, it } from "vitest"
import { TestGraph } from "./testUtils/testGraph"
import {
	mapCallbackParametersToEdgeEntry,
	mapFilterEdgeEntries,
	mapFilterEdges,
} from ".."
const g = new TestGraph()
g.addNode("a")
g.addNode("b")
g.addNode("c")

g.addEdge("a", "b", { type: "base", value: 1 })
g.addEdge("b", "c", { type: "base", value: 2 })
describe("mapFilterEdges", () => {
	it("basic functionality test", () => {
		const edge = mapFilterEdges(g, "a", "b", (...args) => {
			const edge = mapCallbackParametersToEdgeEntry(args)
			if (edge.attributes.type === "base") {
				return edge.attributes
			}
		})
		expect(edge).toEqual([{ type: "base", value: 1 }])
		expectTypeOf(edge).toEqualTypeOf<{ type: "base"; value: number }[]>()
	})
})

describe("mapFilterEdgeEntries", () => {
	it("basic functionality test", () => {
		const g = new TestGraph()
		g.addNode("a")
		g.addNode("b")
		g.addNode("c")

		g.addEdge("a", "b", { type: "base", value: 1 })
		g.addEdge("b", "c", { type: "base", value: 2 })

		const edge = mapFilterEdgeEntries(g, "a", "b", (edge) => {
			if (edge.attributes.type === "base") {
				return edge.attributes
			}
		})
		expect(edge).toEqual([{ type: "base", value: 1 }])
		expectTypeOf(edge).toEqualTypeOf<{ type: "base"; value: number }[]>()
	})
})