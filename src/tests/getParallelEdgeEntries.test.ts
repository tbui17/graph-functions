import Graph from "graphology"
import { describe, expect, it } from "vitest"
import { getParallelEdgeEntries } from ".."

describe("getParallelEdgeEntries", () => {
	it("should obtain edge entries of nodes with > 1 edge between each other grouped by the pairing of their node keys sorted", () => {
		const graph = new Graph({ multi: true })

		graph.mergeEdge("a", "b", { edgeId: 1 })
		graph.addNode("c")
		graph.addEdge("b", "a", { edgeId: 2 })
		graph.addEdge("a", "c", { edgeId: 3 })

		const entries = getParallelEdgeEntries({
			graph,
			edgeEntryMethod: "edgeEntries",
		})
		const expected = {
			a_b: expect.arrayContaining([
				expect.objectContaining({
					attributes: { edgeId: 1 },
				}),
				expect.objectContaining({
					attributes: { edgeId: 2 },
				}),
			]),
		}
		expect(entries).toEqual(expected)
		expect(entries.a_b!.length).toBe(2)
		expect(Object.keys(entries).length).toBe(1)
	})
})
