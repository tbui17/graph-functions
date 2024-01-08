import { expect, it } from "vitest"
import { TestGraph2 } from "./testUtils/testGraph"
import { SubgraphError, minOrderSubgraph } from ".."
import _ from "lodash"

/**
 Table1 --> Table2 --> Table3 --> Table4 --> Table5
    \                              ^
     \____________________________/
    
 Table6 --> Table7

 Table 8
**/

const graph = TestGraph2.create()

it("should exclude table2 in the subgraph", () => {
	const inp = ["table1", "table3", "table5"]
	const res = minOrderSubgraph(graph, inp)
	expect(res.nodes()).toEqual(
		expect.arrayContaining(["table1", "table3", "table4", "table5"])
	)
	return
})

it("should keep attributes", () => {
	const inp = ["table1", "table3", "table5"]
	const graph2 = minOrderSubgraph(graph, inp)

	const nodeEntries = [...graph.nodeEntries()]
	expect(nodeEntries.length).toBeGreaterThan(0)
	const nodeEntries2 = [...graph2.nodeEntries()]
	const edgeEntries = [...graph.edgeEntries()]
	const edgeEntries2 = [...graph2.edgeEntries()]

	const res = nodeEntries2.map((entry) => {
		return nodeEntries.some((s) => _.isEqual(s, entry))
	})
	const res2 = edgeEntries2.map((entry) => {
		return edgeEntries.some((s) => _.isEqual(s, entry))
	})
	const res3 = res.concat(res2).every((s) => s === true)
	expect(res3).toBe(true)
})

it("should keep node keys", () => {
	const inp = ["table1", "table3", "table5"]
	const res = minOrderSubgraph(graph, inp)

	expect(res.nodes().every((node) => graph.hasNode(node))).toBe(true)
})

it("should keep edge keys", () => {
	const inp = ["table1", "table3", "table5"]
	const res = minOrderSubgraph(graph, inp)

	expect(res.edges().every((edge) => graph.hasEdge(edge))).toBe(true)
})

it("should throw if nodes have no connection in the graph", () => {
	const inp = ["table1", "table3", "table6"]
	expect(() => minOrderSubgraph(graph, inp)).toThrowError(SubgraphError)
})
